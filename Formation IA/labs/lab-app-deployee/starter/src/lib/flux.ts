// src/lib/flux.ts — transforme les fragments du fournisseur en flux SSE pour le navigateur.
import { coutUsd, type Usage } from "./couts";
import type { Fragment } from "./fournisseurs";

export type Evenement =
  | { type: "texte"; delta: string }
  | { type: "fin"; usage: Usage; coutUsd: number }
  | { type: "erreur"; message: string };

export const MESSAGE_INDISPONIBLE = "Service momentanément indisponible, réessayez dans une minute.";

export function encoderSSE(ev: Evenement): string {
  return `data: ${JSON.stringify(ev)}\n\n`;
}

export interface OptionsFlux {
  modele: string;
  surFin?: (usage: Usage, cout: number) => void;
  surErreur?: (erreur: unknown) => void;
}

/**
 * Chaque fragment de texte devient immédiatement un événement `texte` (aucune mise en tampon) ;
 * l'usage final devient un événement `fin` avec le coût ; une exception devient un événement `erreur`
 * au message générique (jamais la pile ni le message interne), puis le flux se ferme proprement.
 * Si le navigateur annule (bouton Stop, onglet fermé), on arrête la génération.
 */
export function versSSE(source: AsyncIterable<Fragment>, options: OptionsFlux): ReadableStream<Uint8Array> {
  // TODO 5 : renvoyer un ReadableStream<Uint8Array> qui, à chaque pull :
  // - lit le fragment suivant (const it = source[Symbol.asyncIterator](); await it.next()) ;
  // - texte → enqueue(encoderSSE({ type: "texte", delta })) ; usage → coût, options.surFin, événement "fin" ;
  // - fin de la source → close() ;
  // - exception → options.surErreur(e), événement { type: "erreur", message: MESSAGE_INDISPONIBLE }, close() ;
  // et dont cancel() appelle it.return() pour arrêter la génération.
  // INDICE : const encodeur = new TextEncoder(); encodeur.encode(texte)
  void coutUsd;
  throw new Error("TODO 5 : convertir les fragments en flux SSE (versSSE)");
}
