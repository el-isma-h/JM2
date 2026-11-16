"use server";

/** Server actions du profil : nom, mot de passe, objectif quotidien. Compte démo : nom et mot de passe en lecture seule. */
import { revalidatePath } from "next/cache";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import { DAILY_GOAL_OPTIONS } from "@/domain";
import { getSession, hashPassword, validatePasswordStrength, verifyPassword } from "@/server/auth";
import { sharedLimiter } from "@/lib/rate-limit";

export type ProfileFormState = { ok?: string; error?: string; fieldErrors?: Record<string, string> } | null;

const DEMO_LOCKED: ProfileFormState = { error: "Le compte démo est partagé : cette modification est désactivée." };
const pwLimiter = sharedLimiter("profile-password", { limit: 5, windowMs: 15 * 60_000 });

const nameSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis.").max(80),
  lastName: z.string().trim().min(1, "Nom requis.").max(80),
});

function issues(e: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of e.issues) out[String(i.path[0])] ??= i.message;
  return out;
}

export async function updateNameAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const user = await getSession();
  if (!user) return { error: "Session expirée : reconnectez-vous." };
  if (user.isDemo) return DEMO_LOCKED;
  const parsed = nameSchema.safeParse({ firstName: formData.get("firstName"), lastName: formData.get("lastName") });
  if (!parsed.success) return { fieldErrors: issues(parsed.error) };
  await db.update(schema.users).set(parsed.data).where(eq(schema.users.id, user.id));
  revalidatePath("/", "layout");
  return { ok: "Nom enregistré." };
}

const passwordSchema = z
  .object({ current: z.string().min(1, "Mot de passe actuel requis.").max(200), password: z.string().max(200), confirm: z.string().max(200) })
  .superRefine((v, ctx) => {
    const weak = validatePasswordStrength(v.password);
    if (weak) ctx.addIssue({ code: "custom", path: ["password"], message: weak });
    if (v.password !== v.confirm) ctx.addIssue({ code: "custom", path: ["confirm"], message: "Les mots de passe ne correspondent pas." });
  });

export async function changePasswordAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const user = await getSession();
  if (!user) return { error: "Session expirée : reconnectez-vous." };
  if (user.isDemo) return DEMO_LOCKED;
  if (!pwLimiter.hit(user.id).allowed) return { error: "Trop de tentatives. Réessayez dans 15 min." };
  const parsed = passwordSchema.safeParse({ current: formData.get("current") ?? "", password: formData.get("password") ?? "", confirm: formData.get("confirm") ?? "" });
  if (!parsed.success) return { fieldErrors: issues(parsed.error) };
  const [row] = await db.select({ hash: schema.users.passwordHash }).from(schema.users).where(eq(schema.users.id, user.id)).limit(1);
  if (!row || !(await verifyPassword(parsed.data.current, row.hash))) return { fieldErrors: { current: "Mot de passe actuel incorrect." } };
  await db.update(schema.users).set({ passwordHash: await hashPassword(parsed.data.password) }).where(eq(schema.users.id, user.id));
  // Déconnecte les autres appareils : seule la session courante est conservée.
  await db.delete(schema.sessions).where(and(eq(schema.sessions.userId, user.id), ne(schema.sessions.id, user.sessionId)));
  return { ok: "Mot de passe modifié. Vos autres sessions ont été fermées." };
}

const goalValues = DAILY_GOAL_OPTIONS.map((o) => o.xp) as number[];

export async function updateDailyGoalAction(xp: number): Promise<{ ok: boolean; error?: string }> {
  const user = await getSession();
  if (!user) return { ok: false, error: "Session expirée : reconnectez-vous." };
  if (!goalValues.includes(xp)) return { ok: false, error: "Objectif invalide." };
  await db.update(schema.users).set({ dailyGoalXp: xp }).where(eq(schema.users.id, user.id));
  revalidatePath("/");
  return { ok: true };
}
