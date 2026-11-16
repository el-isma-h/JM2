// src/lib/sse.ts — lecture d'un flux Server-Sent Events, fragment par fragment.
// Sert deux fois : dans le navigateur (page.tsx lit /api/chat) et côté serveur (flux de l'API Anthropic).

export interface EvenementSSE {
  event: string | null;
  data: string;
}

function analyserBloc(bloc: string): EvenementSSE | null {
  let event: string | null = null;
  const donnees: string[] = [];
  for (const ligne of bloc.split("\n")) {
    if (ligne === "" || ligne.startsWith(":")) continue;            // ligne vide ou commentaire (keep-alive)
    const i = ligne.indexOf(":");
    const champ = i === -1 ? ligne : ligne.slice(0, i);
    let valeur = i === -1 ? "" : ligne.slice(i + 1);
    if (valeur.startsWith(" ")) valeur = valeur.slice(1);
    if (champ === "event") event = valeur;
    else if (champ === "data") donnees.push(valeur);
  }
  return donnees.length > 0 ? { event, data: donnees.join("\n") } : null;
}

/**
 * Découpe le flux en événements. Les fragments réseau arrivent n'importe où : au milieu d'un événement,
 * d'une ligne, voire d'un caractère UTF-8 multi-octets. On accumule donc dans un tampon et on ne traite
 * que les blocs complets (séparés par une ligne vide).
 */
export async function* lireEvenementsSSE(flux: ReadableStream<Uint8Array>): AsyncGenerator<EvenementSSE> {
  // TODO 7 : lire flux.getReader() jusqu'à done ; décoder avec new TextDecoder() et { stream: true } ;
  // accumuler dans un tampon, remplacer "\r\n" par "\n" SUR LE TAMPON ENTIER ; tant que le tampon contient
  // "\n\n", analyserBloc(bloc) et yield l'événement ; à la fin, traiter le dernier bloc sans ligne vide ;
  // dans un finally, lecteur.releaseLock().
  void analyserBloc;
  throw new Error("TODO 7 : lire un flux SSE (lireEvenementsSSE)");
}
