"use server";

/**
 * Server actions de l'administration (rôles admin et trainer, vérifiés à CHAQUE appel ; CSRF géré par Next).
 * Toute action est journalisée dans admin_actions. Le formateur ne gère ni les réglages ni les rôles :
 * il n'invite que des apprenants et n'agit que sur des comptes apprenants.
 */
import { revalidatePath } from "next/cache";
import { and, desc, eq, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";
import type { Role } from "@/db/schema";
import { getSession, type SessionUser } from "@/server/auth";
import { createInvitation } from "@/server/invitations";
import { issueCertificate } from "@/server/certificates";
import { getLevel, getModule } from "@/content";
import { canActOn, invitableRoles, isStaffRole } from "@/lib/roles";
import { routes } from "@/lib/paths";
import { logAdminAction } from "@/server/admin/audit";
import { mailEnabled, renewInvitation, sendInvitationEmail } from "@/server/admin/invitations";

export type ActionResult = { ok: true; message: string; url?: string } | { ok: false; error: string };

const uuid = z.string().uuid();

async function staff(): Promise<SessionUser> {
  const u = await getSession();
  if (!u || !isStaffRole(u.role)) throw new Error("Accès refusé.");
  return u;
}

async function target(actor: SessionUser, userId: string, action: "progress" | "disable") {
  if (!uuid.safeParse(userId).success) return null;
  const [t] = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
  if (!t || !canActOn(actor, t, action)) return null;
  return t;
}

const DENIED: ActionResult = { ok: false, error: "Action non autorisée sur ce compte." };

function refresh(userId?: string) {
  revalidatePath(routes.admin);
  revalidatePath(routes.adminLearners);
  if (userId) revalidatePath(routes.adminLearner(userId));
}

// ---------- Déblocages ----------

export async function unlockAction(userId: string, scope: "module" | "level", refId: string): Promise<ActionResult> {
  const actor = await staff();
  const t = await target(actor, userId, "progress");
  if (!t) return DENIED;
  const valid = scope === "module" ? getModule(refId) : getLevel(refId);
  if (!valid) return { ok: false, error: "Élément du programme introuvable." };
  await db.transaction(async (tx) => {
    await tx.insert(schema.unlocks).values({ userId, scope, refId, unlockedBy: actor.id }).onConflictDoNothing();
    await logAdminAction(actor.id, scope === "module" ? "unlock.module" : "unlock.level", { targetUserId: userId, refId }, tx);
  });
  refresh(userId);
  return { ok: true, message: scope === "module" ? `Module ${refId} débloqué.` : `Niveau ${refId} débloqué.` };
}

export async function removeUnlockAction(userId: string, scope: "module" | "level", refId: string): Promise<ActionResult> {
  const actor = await staff();
  const t = await target(actor, userId, "progress");
  if (!t) return DENIED;
  await db.transaction(async (tx) => {
    await tx.delete(schema.unlocks).where(and(eq(schema.unlocks.userId, userId), eq(schema.unlocks.scope, scope), eq(schema.unlocks.refId, refId)));
    await logAdminAction(actor.id, "unlock.remove", { targetUserId: userId, refId, details: { scope } }, tx);
  });
  refresh(userId);
  return { ok: true, message: `Déblocage manuel de ${refId} retiré.` };
}

// ---------- Examens ----------

/** Annule (voidedAt) les tentatives non réussies d'un niveau : l'historique reste dans la base et les exports. */
export async function resetExamAttemptsAction(userId: string, levelId: string): Promise<ActionResult> {
  const actor = await staff();
  const t = await target(actor, userId, "progress");
  if (!t) return DENIED;
  if (!getLevel(levelId)) return { ok: false, error: "Niveau introuvable." };
  const voided = await db.transaction(async (tx) => {
    const rows = await tx
      .update(schema.examAttempts)
      .set({ voidedAt: new Date() })
      .where(
        and(
          eq(schema.examAttempts.userId, userId),
          eq(schema.examAttempts.levelId, levelId),
          isNull(schema.examAttempts.voidedAt),
          or(isNull(schema.examAttempts.passed), eq(schema.examAttempts.passed, false)),
        ),
      )
      .returning({ id: schema.examAttempts.id });
    await logAdminAction(actor.id, "exam.reset", { targetUserId: userId, refId: levelId, details: { voided: rows.map((r) => r.id) } }, tx);
    return rows.length;
  });
  refresh(userId);
  return { ok: true, message: voided ? `${voided} tentative${voided > 1 ? "s" : ""} annulée${voided > 1 ? "s" : ""} : l'apprenant dispose de nouveau de 3 tentatives.` : "Aucune tentative à réinitialiser." };
}

// ---------- Certificats ----------

export async function revokeCertificateAction(certificateId: string): Promise<ActionResult> {
  const actor = await staff();
  if (!uuid.safeParse(certificateId).success) return DENIED;
  const [c] = await db.select().from(schema.certificates).where(eq(schema.certificates.id, certificateId)).limit(1);
  if (!c || c.revokedAt) return { ok: false, error: "Certificat introuvable ou déjà révoqué." };
  if (!(await target(actor, c.userId, "progress"))) return DENIED;
  await db.transaction(async (tx) => {
    await tx.update(schema.certificates).set({ revokedAt: new Date() }).where(eq(schema.certificates.id, c.id));
    await logAdminAction(actor.id, "certificate.revoke", { targetUserId: c.userId, refId: c.number, details: { levelId: c.levelId } }, tx);
  });
  refresh(c.userId);
  return { ok: true, message: `Certificat ${c.number} révoqué : la page de vérification l'indique désormais.` };
}

/** Émet un nouveau certificat (nouveau numéro) pour un niveau dont l'examen est réussi et sans certificat actif. */
export async function reissueCertificateAction(userId: string, levelId: string): Promise<ActionResult> {
  const actor = await staff();
  const t = await target(actor, userId, "progress");
  if (!t) return DENIED;
  const [passed] = await db
    .select()
    .from(schema.examAttempts)
    .where(and(eq(schema.examAttempts.userId, userId), eq(schema.examAttempts.levelId, levelId), eq(schema.examAttempts.passed, true), isNull(schema.examAttempts.voidedAt)))
    .orderBy(desc(schema.examAttempts.submittedAt))
    .limit(1);
  if (!passed) return { ok: false, error: "L'examen de ce niveau n'est pas réussi : aucun certificat ne peut être émis." };
  const [active] = await db
    .select()
    .from(schema.certificates)
    .where(and(eq(schema.certificates.userId, userId), eq(schema.certificates.levelId, levelId), isNull(schema.certificates.revokedAt)))
    .limit(1);
  if (active) return { ok: false, error: `Un certificat actif existe déjà (${active.number}). Révoquez-le d'abord.` };
  const cert = await db.transaction(async (tx) => {
    const c = await issueCertificate({ userId, levelId, examAttemptId: passed.id }, tx);
    await logAdminAction(actor.id, "certificate.reissue", { targetUserId: userId, refId: c.number, details: { levelId } }, tx);
    return c;
  });
  refresh(userId);
  return { ok: true, message: `Nouveau certificat émis : ${cert.number}.` };
}

// ---------- Comptes ----------

export async function setAccountDisabledAction(userId: string, disabled: boolean): Promise<ActionResult> {
  const actor = await staff();
  const t = await target(actor, userId, "disable");
  if (!t) return DENIED;
  await db.transaction(async (tx) => {
    await tx.update(schema.users).set({ disabledAt: disabled ? new Date() : null }).where(eq(schema.users.id, userId));
    if (disabled) await tx.delete(schema.sessions).where(eq(schema.sessions.userId, userId));
    await logAdminAction(actor.id, disabled ? "user.disable" : "user.enable", { targetUserId: userId }, tx);
  });
  refresh(userId);
  return { ok: true, message: disabled ? "Compte désactivé : la connexion est refusée et les sessions ouvertes sont fermées." : "Compte réactivé." };
}

// ---------- Invitations ----------

export type InviteState = { error?: string; fieldErrors?: Record<string, string>; values?: Record<string, string>; result?: { email: string; url: string; sent: boolean; mailError?: string } } | null;

const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide.").max(254),
  firstName: z.string().trim().max(80),
  lastName: z.string().trim().max(80),
  role: z.enum(["learner", "trainer", "admin"]),
});

function actorName(u: SessionUser) {
  return `${u.firstName} ${u.lastName}`.trim() || "L'équipe Next Formation";
}

export async function inviteAction(_prev: InviteState, formData: FormData): Promise<InviteState> {
  const actor = await staff();
  const values = { email: String(formData.get("email") ?? ""), firstName: String(formData.get("firstName") ?? ""), lastName: String(formData.get("lastName") ?? ""), role: String(formData.get("role") ?? "learner") };
  const parsed = inviteSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { fieldErrors, values };
  }
  const { email, firstName, lastName, role } = parsed.data;
  if (!invitableRoles(actor.role).includes(role as Role)) return { fieldErrors: { role: "Vous ne pouvez inviter que des apprenants." }, values };
  const [existing] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email)).limit(1);
  if (existing) return { fieldErrors: { email: "Un compte existe déjà avec cette adresse." }, values };
  const [pending] = await db
    .select({ id: schema.invitations.id })
    .from(schema.invitations)
    .where(and(eq(schema.invitations.email, email), isNull(schema.invitations.acceptedAt)))
    .limit(1);
  if (pending) {
    await db.delete(schema.invitations).where(and(eq(schema.invitations.id, pending.id), isNull(schema.invitations.acceptedAt)));
  }
  const { url, invitation } = await createInvitation({ email, role, firstName: firstName || undefined, lastName: lastName || undefined, invitedBy: actor.id });
  const mail = await sendInvitationEmail({ to: email, firstName, url, role, inviter: actorName(actor) });
  await logAdminAction(actor.id, "invitation.create", { refId: invitation.id, details: { email, role, mailed: mail?.sent ?? false, replaced: Boolean(pending) } });
  revalidatePath(routes.adminInvitations);
  return { result: { email, url, sent: mail?.sent ?? false, mailError: mail && !mail.sent ? mail.error : undefined } };
}

/** Nouveau lien (l'ancien est invalidé), envoyé par e-mail si possible et toujours renvoyé pour être copié. */
export async function renewInvitationAction(invitationId: string): Promise<ActionResult> {
  const actor = await staff();
  if (!uuid.safeParse(invitationId).success) return DENIED;
  const [inv] = await db.select().from(schema.invitations).where(eq(schema.invitations.id, invitationId)).limit(1);
  if (!inv || inv.acceptedAt) return { ok: false, error: "Invitation introuvable ou déjà acceptée." };
  if (!invitableRoles(actor.role).includes(inv.role)) return DENIED;
  const renewed = await renewInvitation(inv.id);
  if (!renewed) return { ok: false, error: "Invitation introuvable." };
  const mail = await sendInvitationEmail({ to: inv.email, firstName: inv.firstName, url: renewed.url, role: inv.role, inviter: actorName(actor) });
  await logAdminAction(actor.id, "invitation.renew", { refId: inv.id, details: { email: inv.email, mailed: mail?.sent ?? false } });
  revalidatePath(routes.adminInvitations);
  const how = mail?.sent ? `E-mail renvoyé à ${inv.email}.` : mail ? `L'e-mail n'a pas pu partir (${mail.error}) : copiez le lien.` : mailEnabled() ? "" : "Envoi d'e-mails désactivé : copiez le lien ci-dessous.";
  return { ok: true, message: `Nouveau lien valable 14 jours. ${how}`.trim(), url: renewed.url };
}

