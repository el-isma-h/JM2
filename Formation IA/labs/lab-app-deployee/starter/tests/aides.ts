// Outils communs aux tests (aucun réseau).
import type { Fragment } from "../src/lib/fournisseurs";
import { lireEvenementsSSE } from "../src/lib/sse";

export async function* fragments(liste: Fragment[], erreurApres?: number): AsyncGenerator<Fragment> {
  for (let i = 0; i < liste.length; i++) {
    if (erreurApres !== undefined && i === erreurApres) throw new Error("détail interne : pile, chemin /srv/app");
    yield liste[i];
  }
}

/** Découpe un texte en morceaux d'octets de taille fixe : simule un réseau qui coupe n'importe où. */
export function fluxDecoupe(texte: string, taille = 3): ReadableStream<Uint8Array> {
  const octets = new TextEncoder().encode(texte);
  let i = 0;
  return new ReadableStream({
    pull(c) {
      if (i >= octets.length) return c.close();
      c.enqueue(octets.slice(i, i + taille));
      i += taille;
    },
  });
}

export async function evenements(flux: ReadableStream<Uint8Array>): Promise<any[]> {
  const out: any[] = [];
  for await (const ev of lireEvenementsSSE(flux)) out.push(JSON.parse(ev.data));
  return out;
}
