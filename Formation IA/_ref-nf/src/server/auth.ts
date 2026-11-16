import "server-only";
import { cookies, headers } from "next/headers";
import { and, eq, gt, isNull } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { generateSecret, generateURI, verifySync } from "otplib";
import { db, schema } from "@/db";
import { decrypt, encrypt, randomToken, sha256 } from "@/lib/crypto";
import { cache } from "react";

export const SESSION_COOKIE = "nextformation_session";
const SESSION_DAYS = 14;
const ELEVATION_MINUTES = 15;

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  platformRole: "user" | "platform_admin";
  tenantId: string | null;
  emailVerified: boolean;
  totpEnabled: boolean;
  elevated: boolean;
  sessionId: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function validatePasswordStrength(pw: string): string | null {
  if (pw.length < 12) return "12 caractères minimum.";
  if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw) || !/[0-9]/.test(pw)) return "Majuscule, minuscule et chiffre requis.";
  return null;
}

async function requestMeta() {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || null;
  return { ip: ip && /^[0-9a-f.:]+$/i.test(ip) ? ip : null, userAgent: h.get("user-agent")?.slice(0, 300) ?? null };
}

export async function createSession(userId: string) {
  const token = randomToken(32);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400_000);
  const meta = await requestMeta();
  await db.insert(schema.sessions).values({ userId, tokenHash: sha256(token), expiresAt, ip: meta.ip, userAgent: meta.userAgent });
  await db.update(schema.users).set({ lastLoginAt: new Date() }).where(eq(schema.users.id, userId));
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(schema.sessions).where(eq(schema.sessions.tokenHash, sha256(token)));
  jar.delete(SESSION_COOKIE);
}

/** Utilisateur courant (mis en cache par requête). null si non connecté. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
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
    platformRole: row.u.platformRole,
    tenantId: row.u.tenantId,
    emailVerified: Boolean(row.u.emailVerifiedAt),
    totpEnabled: Boolean(row.u.totpEnabledAt),
    elevated: Boolean(row.s.elevatedUntil && row.s.elevatedUntil > new Date()),
    sessionId: row.s.id,
  };
});

export async function requireUser(): Promise<SessionUser> {
  const u = await getCurrentUser();
  if (!u) throw new AuthError("unauthenticated");
  return u;
}

export class AuthError extends Error {
  constructor(public code: "unauthenticated" | "forbidden" | "elevation_required" | "email_unverified") {
    super(code);
  }
}

// ---------- TOTP ----------

export function generateTotpSecret() {
  return generateSecret();
}
export function totpUri(email: string, secret: string) {
  return generateURI({ issuer: "Next Formation", label: email, secret });
}
export function verifyTotp(secret: string, code: string) {
  try {
    return verifySync({ secret, token: code.replace(/\s/g, ""), epochTolerance: 30 }).valid;
  } catch {
    return false;
  }
}
export async function enableTotp(userId: string, secret: string, code: string): Promise<boolean> {
  if (!verifyTotp(secret, code)) return false;
  const recovery = Array.from({ length: 8 }, () => randomToken(6).slice(0, 10));
  await db
    .update(schema.users)
    .set({
      totpSecretEnc: encrypt(secret, "totp"),
      totpEnabledAt: new Date(),
      recoveryCodesHash: recovery.map((c) => sha256(c)),
    })
    .where(eq(schema.users.id, userId));
  return true;
}
export async function checkUserTotp(userId: string, code: string): Promise<boolean> {
  const [u] = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
  if (!u?.totpSecretEnc) return false;
  if (verifyTotp(decrypt(u.totpSecretEnc, "totp"), code)) return true;
  const hashes = (u.recoveryCodesHash as string[]) ?? [];
  const h = sha256(code.trim());
  if (hashes.includes(h)) {
    await db
      .update(schema.users)
      .set({ recoveryCodesHash: hashes.filter((x) => x !== h) })
      .where(eq(schema.users.id, userId));
    return true;
  }
  return false;
}

/** Marque la session comme « renforcée » pour ELEVATION_MINUTES après une vérification TOTP (ou mot de passe si pas de TOTP). */
export async function elevateSession(sessionId: string) {
  await db
    .update(schema.sessions)
    .set({ elevatedUntil: new Date(Date.now() + ELEVATION_MINUTES * 60_000) })
    .where(eq(schema.sessions.id, sessionId));
}

// ---------- Jetons à usage unique ----------

export async function issueToken(
  purpose: "verify_email" | "reset_password" | "invite" | "download",
  opts: { userId?: string; email?: string; payload?: Record<string, unknown>; ttlMinutes?: number },
) {
  const token = randomToken(32);
  await db.insert(schema.oneTimeTokens).values({
    purpose,
    tokenHash: sha256(token),
    userId: opts.userId,
    email: opts.email,
    payload: opts.payload ?? {},
    expiresAt: new Date(Date.now() + (opts.ttlMinutes ?? 60) * 60_000),
  });
  return token;
}

export async function consumeToken(purpose: "verify_email" | "reset_password" | "invite" | "download", token: string) {
  const [row] = await db
    .select()
    .from(schema.oneTimeTokens)
    .where(and(eq(schema.oneTimeTokens.tokenHash, sha256(token)), eq(schema.oneTimeTokens.purpose, purpose), isNull(schema.oneTimeTokens.usedAt), gt(schema.oneTimeTokens.expiresAt, new Date())))
    .limit(1);
  if (!row) return null;
  await db.update(schema.oneTimeTokens).set({ usedAt: new Date() }).where(eq(schema.oneTimeTokens.id, row.id));
  return row;
}

export async function peekToken(purpose: "verify_email" | "reset_password" | "invite" | "download", token: string) {
  const [row] = await db
    .select()
    .from(schema.oneTimeTokens)
    .where(and(eq(schema.oneTimeTokens.tokenHash, sha256(token)), eq(schema.oneTimeTokens.purpose, purpose), isNull(schema.oneTimeTokens.usedAt), gt(schema.oneTimeTokens.expiresAt, new Date())))
    .limit(1);
  return row ?? null;
}
