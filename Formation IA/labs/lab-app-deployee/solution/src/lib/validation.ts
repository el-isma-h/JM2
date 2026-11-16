// src/lib/validation.ts — tout ce qui vient du navigateur est hostile tant qu'il n'est pas validé.

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Limites {
  maxMessages: number;
  maxCaracteres: number;
}

export type ResultatValidation =
  | { ok: true; messages: Message[] }
  | { ok: false; statut: 400 | 413; erreur: string };

const refus = (statut: 400 | 413, erreur: string): ResultatValidation => ({ ok: false, statut, erreur });

/**
 * Règles : `{ messages: [...] }` non vide ; rôles `user` / `assistant` uniquement (jamais `system` venu du client) ;
 * contenus texte non vides ; dernier message de l'utilisateur ; un message trop long → 413 ;
 * historique tronqué aux `maxMessages` derniers messages, en commençant par un message `user`.
 */
export function validerRequete(corps: unknown, limites: Limites): ResultatValidation {
  if (typeof corps !== "object" || corps === null || !Array.isArray((corps as { messages?: unknown }).messages)) {
    return refus(400, "Le corps doit être { messages: [...] }");
  }
  const bruts = (corps as { messages: unknown[] }).messages;
  if (bruts.length === 0) return refus(400, "Aucun message");
  const messages: Message[] = [];
  for (const m of bruts) {
    if (typeof m !== "object" || m === null) return refus(400, "Message mal formé");
    const { role, content } = m as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return refus(400, "Rôle non autorisé");
    if (typeof content !== "string" || content.trim() === "") return refus(400, "Contenu vide ou non textuel");
    if (content.length > limites.maxCaracteres) {
      return refus(413, `Message trop long (maximum ${limites.maxCaracteres} caractères)`);
    }
    messages.push({ role, content });
  }
  if (messages[messages.length - 1].role !== "user") return refus(400, "Le dernier message doit venir de l'utilisateur");
  let garde = messages.slice(-limites.maxMessages);
  while (garde.length > 0 && garde[0].role !== "user") garde = garde.slice(1);
  return { ok: true, messages: garde };
}
