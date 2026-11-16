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
  if (!jetonValide(req.headers.get("authorization"), d.config.demoToken)) {
    return json(401, { erreur: "Non authentifié" });
  }
  let corps: unknown;
  try {
    corps = await req.json();
  } catch {
    return json(400, { erreur: "JSON invalide" });
  }
  const v = validerRequete(corps, d.config);
  if (!v.ok) return json(v.statut, { erreur: v.erreur });

  const qui = identifiant(d.config.demoToken);
  const q = d.limiteur.autoriser(qui);
  if (!q.ok) {
    return json(429, { erreur: "Trop de requêtes, réessayez plus tard" }, { "retry-after": String(q.reessayerDansS) });
  }
  if (d.budget.epuise()) {
    return json(503, { erreur: "Budget mensuel atteint : service suspendu jusqu'à la remise à zéro" });
  }

  const debut = Date.now();
  const source = d.fournisseur.generer(v.messages, { maxOutputTokens: d.config.maxOutputTokens, signal: req.signal });
  const flux = versSSE(source, {
    modele: d.fournisseur.modele,
    surFin: (usage, cout) => {
      d.budget.ajouter(cout);
      d.journal({ type: "appel_llm", utilisateur: qui, fournisseur: d.fournisseur.nom, modele: d.fournisseur.modele,
        usage, coutUsd: cout, dureeMs: Date.now() - debut, promptVersion: d.config.promptVersion,
        alerteBudget: d.budget.alerte() });
    },
    surErreur: (e) => d.journal({ type: req.signal.aborted ? "annulation" : "erreur_llm", utilisateur: qui,
      fournisseur: d.fournisseur.nom, message: e instanceof Error ? e.message : String(e), dureeMs: Date.now() - debut }),
  });
  return new Response(flux, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",   // no-transform : un proxy ne doit ni compresser ni regrouper
      "x-accel-buffering": "no",                   // nginx et compatibles : pas de mise en tampon
    },
  });
}
