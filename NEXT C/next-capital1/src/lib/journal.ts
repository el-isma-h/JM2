import { db } from "./db";

export function auditer(acteur: { id: number | null; email: string | null }, action: string, cible?: string, details?: unknown) {
  db().prepare("INSERT INTO journal_audit (acteur_id, acteur_email, action, cible, details) VALUES (?, ?, ?, ?, ?)")
    .run(acteur.id, acteur.email, action, cible ?? null, details === undefined ? null : typeof details === "string" ? details : JSON.stringify(details));
}

/** Les e-mails ne sont pas envoyés (aucun SMTP) : ils sont journalisés et consultables dans l'admin. */
export function journaliserEmail(destinataire: string, sujet: string, corps: string) {
  db().prepare("INSERT INTO emails_journal (destinataire, sujet, corps) VALUES (?, ?, ?)").run(destinataire, sujet, corps);
}

export function nouvelleReference(prefixe: string) {
  const alea = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefixe}-${alea}`;
}
