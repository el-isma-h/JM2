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
  const encodeur = new TextEncoder();
  const it = source[Symbol.asyncIterator]();
  return new ReadableStream<Uint8Array>({
    async pull(controleur) {
      try {
        const { value, done } = await it.next();
        if (done) {
          controleur.close();
          return;
        }
        if (value.type === "texte") {
          controleur.enqueue(encodeur.encode(encoderSSE({ type: "texte", delta: value.texte })));
        } else {
          const cout = coutUsd(value.usage, options.modele);
          options.surFin?.(value.usage, cout);
          controleur.enqueue(encodeur.encode(encoderSSE({ type: "fin", usage: value.usage, coutUsd: cout })));
        }
      } catch (e) {
        options.surErreur?.(e);
        controleur.enqueue(encodeur.encode(encoderSSE({ type: "erreur", message: MESSAGE_INDISPONIBLE })));
        controleur.close();
      }
    },
    async cancel() {
      await it.return?.();
    },
  });
}
