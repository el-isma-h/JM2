/**
 * Droits de l'espace d'administration (règles pures, testées).
 * - admin : tout ;
 * - trainer (formateur) : tout sauf les réglages de la plateforme et la gestion des rôles
 *   (il n'invite que des apprenants et ne peut agir sur un compte admin / formateur).
 */
export type AppRole = "learner" | "trainer" | "admin";

export function isStaffRole(role: AppRole): boolean {
  return role === "admin" || role === "trainer";
}

export function canManageSettings(role: AppRole): boolean {
  return role === "admin";
}

/** Rôles qu'un membre de l'équipe peut attribuer par invitation. */
export function invitableRoles(role: AppRole): AppRole[] {
  if (role === "admin") return ["learner", "trainer", "admin"];
  if (role === "trainer") return ["learner"];
  return [];
}

/** Peut-on agir (déblocage, désactivation…) sur ce compte ? Jamais sur soi-même pour la désactivation. */
export function canActOn(actor: { id: string; role: AppRole }, target: { id: string; role: AppRole }, action: "progress" | "disable"): boolean {
  if (!isStaffRole(actor.role)) return false;
  if (action === "disable" && actor.id === target.id) return false;
  if (actor.role === "trainer" && target.role !== "learner") return false;
  return true;
}

export const EXPORT_TYPES = ["preuves", "activite", "quiz", "examens", "certificats"] as const;
export type ExportType = (typeof EXPORT_TYPES)[number];
export function isExportType(v: string): v is ExportType {
  return (EXPORT_TYPES as readonly string[]).includes(v);
}
