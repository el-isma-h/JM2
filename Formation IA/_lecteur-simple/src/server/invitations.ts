/**
 * Invitations : jeton aléatoire envoyé par e-mail (Resend si RESEND_API_KEY, sinon lien à copier côté admin),
 * seul son sha256 est stocké. Activation sur /invitation/[token] : création du compte + mot de passe.
 */
import "server-only";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Role } from "@/db/schema";
import { randomToken, sha256 } from "@/lib/crypto";
import { absoluteUrl, routes } from "@/lib/paths";
import { hashPassword } from "./passwords";

export const INVITATION_DAYS = 14;

export async function createInvitation(input: {
  email: string;
  role?: Role;
  firstName?: string;
  lastName?: string;
  invitedBy?: string | null;
  ttlDays?: number;
}): Promise<{ token: string; url: string; invitation: typeof schema.invitations.$inferSelect }> {
  const token = randomToken(32);
  const [invitation] = await db
    .insert(schema.invitations)
    .values({
      email: input.email.trim().toLowerCase(),
      role: input.role ?? "learner",
      firstName: input.firstName ?? null,
      lastName: input.lastName ?? null,
      invitedBy: input.invitedBy ?? null,
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + (input.ttlDays ?? INVITATION_DAYS) * 86_400_000),
    })
    .returning();
  return { token, url: absoluteUrl(routes.invitation(token)), invitation };
}

/** Invitation valide (non acceptée, non expirée) pour ce jeton, sans la consommer. */
export async function peekInvitation(token: string) {
  if (!token || token.length > 100) return null;
  const [row] = await db
    .select()
    .from(schema.invitations)
    .where(and(eq(schema.invitations.tokenHash, sha256(token)), isNull(schema.invitations.acceptedAt), gt(schema.invitations.expiresAt, new Date())))
    .limit(1);
  return row ?? null;
}

export type AcceptResult = { ok: true; userId: string } | { ok: false; error: "invalid" | "email_taken" };

/** Consomme l'invitation et crée le compte (transaction). */
export async function acceptInvitation(token: string, input: { firstName: string; lastName: string; password: string }): Promise<AcceptResult> {
  const passwordHash = await hashPassword(input.password);
  return db.transaction(async (tx) => {
    const [inv] = await tx
      .select()
      .from(schema.invitations)
      .where(and(eq(schema.invitations.tokenHash, sha256(token)), isNull(schema.invitations.acceptedAt), gt(schema.invitations.expiresAt, new Date())))
      .limit(1)
      .for("update");
    if (!inv) return { ok: false, error: "invalid" } as const;
    const [existing] = await tx.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, inv.email)).limit(1);
    if (existing) return { ok: false, error: "email_taken" } as const;
    const [user] = await tx
      .insert(schema.users)
      .values({ email: inv.email, firstName: input.firstName.trim(), lastName: input.lastName.trim(), role: inv.role, passwordHash })
      .returning({ id: schema.users.id });
    await tx.update(schema.invitations).set({ acceptedAt: new Date() }).where(eq(schema.invitations.id, inv.id));
    return { ok: true, userId: user.id } as const;
  });
}
