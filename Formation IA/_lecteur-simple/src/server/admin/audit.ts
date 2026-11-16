/** Journal des actions d'administration (table admin_actions). */
import "server-only";
import { desc, eq } from "drizzle-orm";
import { db, schema, type DbOrTx } from "@/db";

export type AdminActionName =
  | "unlock.module"
  | "unlock.level"
  | "unlock.remove"
  | "exam.reset"
  | "certificate.revoke"
  | "certificate.reissue"
  | "user.disable"
  | "user.enable"
  | "invitation.create"
  | "invitation.renew"
  | "settings.ai.save"
  | "settings.ai.delete"
  | "settings.ai.test";

export const ACTION_LABELS: Record<AdminActionName, string> = {
  "unlock.module": "Module débloqué",
  "unlock.level": "Niveau débloqué",
  "unlock.remove": "Déblocage retiré",
  "exam.reset": "Tentatives d'examen réinitialisées",
  "certificate.revoke": "Certificat révoqué",
  "certificate.reissue": "Certificat réémis",
  "user.disable": "Compte désactivé",
  "user.enable": "Compte réactivé",
  "invitation.create": "Invitation envoyée",
  "invitation.renew": "Invitation renouvelée",
  "settings.ai.save": "Clé IA de la plateforme enregistrée",
  "settings.ai.delete": "Clé IA de la plateforme supprimée",
  "settings.ai.test": "Clé IA de la plateforme testée",
};

export async function logAdminAction(
  actorId: string,
  action: AdminActionName,
  data: { targetUserId?: string | null; refId?: string | null; details?: Record<string, unknown> } = {},
  conn: DbOrTx = db,
): Promise<void> {
  await conn.insert(schema.adminActions).values({ actorId, action, targetUserId: data.targetUserId ?? null, refId: data.refId ?? null, details: data.details ?? null });
}

export async function adminActionsFor(targetUserId: string, limit = 50) {
  return db
    .select({ a: schema.adminActions, actorFirst: schema.users.firstName, actorLast: schema.users.lastName })
    .from(schema.adminActions)
    .leftJoin(schema.users, eq(schema.users.id, schema.adminActions.actorId))
    .where(eq(schema.adminActions.targetUserId, targetUserId))
    .orderBy(desc(schema.adminActions.at))
    .limit(limit);
}
