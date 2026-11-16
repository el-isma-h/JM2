/**
 * Invitations côté administration : liste avec état, renouvellement du lien, envoi par e-mail (Resend si
 * RESEND_API_KEY, sinon le lien est affiché pour être copié). La création utilise `createInvitation`
 * (src/server/invitations.ts) ; le jeton en clair n'est jamais stocké, d'où le renouvellement pour un nouveau lien.
 */
import "server-only";
import { desc, eq } from "drizzle-orm";
import { Resend } from "resend";
import { db, schema } from "@/db";
import { randomToken, sha256 } from "@/lib/crypto";
import { absoluteUrl, routes } from "@/lib/paths";
import { INVITATION_DAYS } from "@/server/invitations";

export type InvitationState = "pending" | "accepted" | "expired";

export function invitationState(inv: { acceptedAt: Date | null; expiresAt: Date }, now = new Date()): InvitationState {
  if (inv.acceptedAt) return "accepted";
  return inv.expiresAt < now ? "expired" : "pending";
}

export async function listInvitations() {
  const rows = await db
    .select({ i: schema.invitations, byFirst: schema.users.firstName, byLast: schema.users.lastName })
    .from(schema.invitations)
    .leftJoin(schema.users, eq(schema.users.id, schema.invitations.invitedBy))
    .orderBy(desc(schema.invitations.createdAt))
    .limit(500);
  const now = new Date();
  return rows.map((r) => ({ ...r.i, state: invitationState(r.i, now), invitedByName: r.byFirst ? `${r.byFirst} ${r.byLast ?? ""}`.trim() : null }));
}

/** Nouveau jeton + nouvelle échéance pour une invitation non acceptée (l'ancien lien cesse de fonctionner). */
export async function renewInvitation(id: string) {
  const token = randomToken(32);
  const [inv] = await db
    .update(schema.invitations)
    .set({ tokenHash: sha256(token), expiresAt: new Date(Date.now() + INVITATION_DAYS * 86_400_000) })
    .where(eq(schema.invitations.id, id))
    .returning();
  if (!inv) return null;
  return { invitation: inv, token, url: absoluteUrl(routes.invitation(token)) };
}

export function mailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

const ROLE_LABEL = { learner: "apprenant", trainer: "formateur", admin: "administrateur" } as const;

/** Envoie l'e-mail d'invitation. Renvoie null si l'envoi est désactivé, sinon le résultat. */
export async function sendInvitationEmail(input: { to: string; firstName?: string | null; url: string; role: keyof typeof ROLE_LABEL; inviter: string }): Promise<{ sent: true } | { sent: false; error: string } | null> {
  if (!mailEnabled()) return null;
  const from = process.env.MAIL_FROM || "Next Formation IA <onboarding@resend.dev>";
  const hello = input.firstName ? `Bonjour ${input.firstName},` : "Bonjour,";
  const text = [
    hello,
    "",
    `${input.inviter} vous invite à rejoindre Next Formation IA en tant qu'${ROLE_LABEL[input.role]}.`,
    "Pour activer votre compte et choisir votre mot de passe, ouvrez ce lien :",
    input.url,
    "",
    `Ce lien est personnel et reste valable ${INVITATION_DAYS} jours.`,
    "",
    "Next Formation IA",
  ].join("\n");
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const html = `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#0a0b0d;background:#f3f0e8;padding:32px">
<p style="font-family:Archivo,Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;font-size:13px;color:#4b2a7f;margin:0 0 24px">Next Formation IA</p>
<p>${esc(hello)}</p>
<p>${esc(input.inviter)} vous invite à rejoindre la formation en tant qu'${ROLE_LABEL[input.role]}.</p>
<p style="margin:28px 0"><a href="${esc(input.url)}" style="background:#0a0b0d;color:#f3f0e8;padding:12px 20px;text-decoration:none;text-transform:uppercase;letter-spacing:.16em;font-size:12px">Activer mon compte</a></p>
<p style="font-size:13px;color:#5c5b61">Ce lien est personnel et reste valable ${INVITATION_DAYS} jours. Si le bouton ne fonctionne pas : ${esc(input.url)}</p>
</div>`;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({ from, to: input.to, subject: "Votre accès à Next Formation IA", text, html });
    return error ? { sent: false, error: error.message } : { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "Envoi impossible" };
  }
}
