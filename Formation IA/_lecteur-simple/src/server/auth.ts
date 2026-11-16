/**
 * Authentification par session cookie (SPEC § Sécurité) :
 * cookie httpOnly `nfia_session` (path /ia), jeton aléatoire dont seul le sha256 est stocké (table sessions),
 * mots de passe bcrypt, comptes sur invitation uniquement + compte démo.
 *
 * Dans une page / un layout / une server action :
 *   const user = await requireUser();               // redirige vers /connexion si non connecté
 *   const staff = await requireRole("admin", "trainer"); // 404 si rôle insuffisant
 * Dans un route handler (API) :
 *   const user = await getSession(); if (!user) return Response.json({ error: "unauthenticated" }, { status: 401 });
 *
 * NB : un layout ne protège PAS ses pages (rendu partiel lors des navigations) — chaque page appelle requireUser().
 */
import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { and, eq, gt, isNull, lt } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Role } from "@/db/schema";
import { randomToken, sha256 } from "@/lib/crypto";
import { BASE_PATH, routes } from "@/lib/paths";
import { hashPassword, verifyPassword } from "./passwords";

export { hashPassword, verifyPassword, validatePasswordStrength } from "./passwords";

export const SESSION_COOKIE = "nfia_session";
export const SESSION_COOKIE_PATH = BASE_PATH;
export const SESSION_DAYS = 14;

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isDemo: boolean;
  dailyGoalXp: number;
  sessionId: string;
};

export const STAFF_ROLES: readonly Role[] = ["admin", "trainer"];
export function isStaff(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}

/** Cookie `Secure` : COOKIE_SECURE=true|false, sinon déduit d'APP_URL (https → sécurisé). */
function cookieSecure(): boolean {
  if (process.env.COOKIE_SECURE) return process.env.COOKIE_SECURE === "true";
  return (process.env.APP_URL ?? "").startsWith("https://");
}

export async function requestMeta() {
  const h = await headers();
  const ip = (h.get("x-real-ip") ?? h.get("x-forwarded-for") ?? "").split(",")[0].trim() || null;
  return { ip: ip && /^[0-9a-f.:]+$/i.test(ip) ? ip : null, userAgent: h.get("user-agent")?.slice(0, 300) ?? null };
}

/** Crée une session et pose le cookie. Appelable uniquement depuis une server action ou un route handler. */
export async function createSession(userId: string): Promise<void> {
  const token = randomToken(32);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DAYS * 86_400_000);
  const meta = await requestMeta();
  await db.delete(schema.sessions).where(and(eq(schema.sessions.userId, userId), lt(schema.sessions.expiresAt, now)));
  await db.insert(schema.sessions).values({ userId, tokenHash: sha256(token), expiresAt, ip: meta.ip, userAgent: meta.userAgent });
  await db.update(schema.users).set({ lastLoginAt: now }).where(eq(schema.users.id, userId));
  await db.insert(schema.activityLog).values({ userId, kind: "login", at: now });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    path: SESSION_COOKIE_PATH,
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(schema.sessions).where(eq(schema.sessions.tokenHash, sha256(token)));
  jar.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: cookieSecure(), path: SESSION_COOKIE_PATH, maxAge: 0 });
}

/** Utilisateur courant (mis en cache pour la requête). null si non connecté, session expirée ou compte désactivé. */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await db
    .select({ s: schema.sessions, u: schema.users })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(and(eq(schema.sessions.tokenHash, sha256(token)), gt(schema.sessions.expiresAt, new Date()), isNull(schema.users.disabledAt)))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.u.id,
    email: row.u.email,
    firstName: row.u.firstName,
    lastName: row.u.lastName,
    role: row.u.role,
    isDemo: row.u.isDemo,
    dailyGoalXp: row.u.dailyGoalXp,
    sessionId: row.s.id,
  };
});

/** Exige un utilisateur connecté ; sinon redirige vers /connexion (avec retour éventuel). */
export async function requireUser(returnTo?: string): Promise<SessionUser> {
  const u = await getSession();
  if (!u) redirect(returnTo ? `${routes.login}?suite=${encodeURIComponent(returnTo)}` : routes.login);
  return u;
}

/** Exige un des rôles donnés ; 404 sinon (on ne révèle pas l'existence des pages d'administration). */
export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const u = await requireUser();
  if (!roles.includes(u.role)) notFound();
  return u;
}

// Hachage factice pour égaliser le temps de réponse quand l'e-mail n'existe pas.
let dummyHash: Promise<string> | null = null;

/** Vérifie e-mail + mot de passe. null si inconnu, mauvais mot de passe, compte démo ou désactivé. */
export async function authenticate(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const [u] = await db.select().from(schema.users).where(eq(schema.users.email, normalized)).limit(1);
  if (!u || u.disabledAt || u.isDemo) {
    dummyHash ??= hashPassword(randomToken(12));
    await verifyPassword(password, await dummyHash);
    return null;
  }
  return (await verifyPassword(password, u.passwordHash)) ? u : null;
}

export const DEMO_EMAIL = "demo@formation-ia.local";

/** Compte démo actif ? (DEMO_ENABLED=false pour le désactiver). */
export function demoEnabled(): boolean {
  return process.env.DEMO_ENABLED !== "false";
}

export async function findDemoUser() {
  const [u] = await db
    .select()
    .from(schema.users)
    .where(and(eq(schema.users.email, DEMO_EMAIL), eq(schema.users.isDemo, true), isNull(schema.users.disabledAt)))
    .limit(1);
  return u ?? null;
}
