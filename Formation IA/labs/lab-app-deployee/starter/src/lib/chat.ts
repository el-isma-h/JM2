// src/lib/chat.ts — la logique de /api/chat, testable sans Next.js (Request → Response standard).
import { createHash, timingSafeEqual } from "node:crypto";
import type { Config } from "./config";
import { versSSE } from "./flux";
import type { Fournisseur } from "./fournisseurs";
import type { Budget, Limiteur } from "./quota";
import { validerRequete } from "./validation";

export interface Dependances {
  config: Config;
  fournisseur: Fournisseur;
  limiteur: Limiteur;
  budget: Budget;
  journal: (entree: Record<string, unknown>) => void;
}

const json = (statut: number, corps: unknown, entetes: Record<string, string> = {}) =>
  Response.json(corps, { status: statut, headers: { "cache-control": "no-store", ...entetes } });

/** Comparaison à temps constant : ne pas révéler, par la durée de la réponse, combien de caractères sont justes. */
function jetonValide(entete: string | null, attendu: string): boolean {
  const recu = entete?.startsWith("Bearer ") ? entete.slice(7) : "";
  const a = createHash("sha256").update(recu).digest();
  const b = createHash("sha256").update(attendu).digest();
  return recu.length > 0 && timingSafeEqual(a, b);
}

export const identifiant = (jeton: string) => "u-" + createHash("sha256").update(jeton).digest("hex").slice(0, 8);

/**
 * Ordre des contrôles, du moins cher au plus cher, AVANT tout appel au modèle :
 * 1. authentification (401) → 2. JSON lisible (400) → 3. validation et bornes (400 / 413)
 * → 4. quota par utilisateur (429 + Retry-After) → 5. budget global (503) → 6. génération en streaming (SSE).
 */
export async function traiterChat(req: Request, d: Dependances): Promise<Response> {
  // TODO 6 : enchaîner les contrôles dans l'ordre du commentaire ci-dessus, AVANT tout appel au modèle :
  // 1. jetonValide(req.headers.get("authorization"), d.config.demoToken) sinon json(401, ...)
  // 2. await req.json() dans un try/catch → json(400, ...)
  // 3. validerRequete(corps, d.config) → json(v.statut, ...)
  // 4. d.limiteur.autoriser(identifiant(d.config.demoToken)) → json(429, ..., { "retry-after": ... })
  // 5. d.budget.epuise() → json(503, ...)
  // 6. d.fournisseur.generer(v.messages, { maxOutputTokens, signal: req.signal }) → versSSE(...) avec
  //    surFin (budget.ajouter + journal "appel_llm" : utilisateur, fournisseur, modele, usage, coutUsd, dureeMs,
  //    promptVersion) et surErreur (journal "erreur_llm", ou "annulation" si req.signal.aborted) ;
  //    réponse 200 avec content-type text/event-stream, cache-control "no-cache, no-transform", x-accel-buffering "no".
  void [jetonValide, json, validerRequete, versSSE];
  throw new Error("TODO 6 : assembler la route /api/chat (traiterChat)");
}
