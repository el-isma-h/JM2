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
  // TODO 2 : valider le corps envoyé par le navigateur (voir le commentaire ci-dessus et tests/validation.test.ts)
  // INDICE : renvoyez refus(400, "...") ou refus(413, "...") ; en fin de fonction,
  //   let garde = messages.slice(-limites.maxMessages) puis retirez les messages "assistant" en tête.
  void refus;
  throw new Error("TODO 2 : valider la requête (validerRequete)");
}
