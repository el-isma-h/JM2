// TODO 5 — versSSE (serveur) et TODO 7 — lireEvenementsSSE (navigateur et serveur)
import { describe, expect, it } from "vitest";
import { MESSAGE_INDISPONIBLE, encoderSSE, versSSE } from "../src/lib/flux";
import { lireEvenementsSSE } from "../src/lib/sse";
import { evenements, fluxDecoupe, fragments } from "./aides";

async function texteComplet(flux: ReadableStream<Uint8Array>): Promise<string> {
  return new Response(flux).text();
}

describe("TODO 5 — versSSE", () => {
  it("un événement texte par fragment, puis fin avec usage et coût", async () => {
    let fin: unknown = null;
    const flux = versSSE(fragments([
      { type: "texte", texte: "Bonjour" }, { type: "texte", texte: " !" },
      { type: "usage", usage: { input_tokens: 1000, output_tokens: 400, cache_read_input_tokens: 2000 } },
    ]), { modele: "claude-sonnet-5-5", surFin: (u, c) => { fin = { u, c }; } });
    const brut = await texteComplet(flux);
    expect(brut.startsWith('data: {"type":"texte","delta":"Bonjour"}\n\n')).toBe(true);
    const evs = await evenements(fluxDecoupe(brut));
    expect(evs.map((e) => e.type)).toEqual(["texte", "texte", "fin"]);
    expect(evs[2].coutUsd).toBeCloseTo(0.0062, 8);
    expect(fin).toMatchObject({ c: evs[2].coutUsd });
  });

  it("une erreur du fournisseur devient un événement erreur générique, sans détail interne", async () => {
    let erreur: unknown = null;
    const flux = versSSE(fragments([{ type: "texte", texte: "Début" }, { type: "texte", texte: "jamais" }], 1),
      { modele: "simule", surErreur: (e) => { erreur = e; } });
    const brut = await texteComplet(flux);
    expect(brut).not.toContain("/srv/app");
    const evs = await evenements(fluxDecoupe(brut));
    expect(evs).toEqual([{ type: "texte", delta: "Début" }, { type: "erreur", message: MESSAGE_INDISPONIBLE }]);
    expect(erreur).toBeInstanceOf(Error);
  });

  it("l'annulation par le client arrête la génération", async () => {
    let arrete = false;
    async function* infini() {
      try { while (true) yield { type: "texte" as const, texte: "x" }; } finally { arrete = true; }
    }
    const flux = versSSE(infini(), { modele: "simule" });
    const lecteur = flux.getReader();
    await lecteur.read();
    await lecteur.cancel();
    expect(arrete).toBe(true);
  });
});

describe("TODO 7 — lireEvenementsSSE", () => {
  it("reconstitue les événements quel que soit le découpage réseau (y compris au milieu d'un caractère UTF-8)", async () => {
    const brut = encoderSSE({ type: "texte", delta: "Échéance : 15 €" }) + encoderSSE({ type: "texte", delta: "ç" });
    for (const taille of [1, 2, 5, 1000]) {
      const evs = await evenements(fluxDecoupe(brut, taille));
      expect(evs).toEqual([{ type: "texte", delta: "Échéance : 15 €" }, { type: "texte", delta: "ç" }]);
    }
  });

  it("lit le champ event, ignore les commentaires, accepte \\r\\n et un dernier bloc sans ligne vide", async () => {
    const brut = ": keep-alive\r\n\r\nevent: message_start\r\ndata: {\"a\":1}\r\n\r\ndata: {\"b\":2}";
    const evs = [];
    for await (const ev of lireEvenementsSSE(fluxDecoupe(brut, 4))) evs.push(ev);
    expect(evs).toEqual([{ event: "message_start", data: '{"a":1}' }, { event: null, data: '{"b":2}' }]);
  });
});
