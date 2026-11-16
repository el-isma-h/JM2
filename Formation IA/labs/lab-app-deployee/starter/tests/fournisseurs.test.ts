// Fournisseurs : simulé (fourni) et Anthropic (fourni, testé avec un faux fetch : aucun appel réseau).
import { describe, expect, it } from "vitest";
import { FournisseurAnthropic, FournisseurSimule, type Fragment } from "../src/lib/fournisseurs";
import { fluxDecoupe } from "./aides";

async function tout(it: AsyncIterable<Fragment>): Promise<Fragment[]> {
  const out: Fragment[] = [];
  for await (const f of it) out.push(f);
  return out;
}

describe("FournisseurSimule (fourni)", () => {
  it("est déterministe et termine par l'usage", async () => {
    const f = new FournisseurSimule(0);
    const a = await tout(f.generer([{ role: "user", content: "Échéance TVA ?" }], { maxOutputTokens: 800 }));
    const b = await tout(f.generer([{ role: "user", content: "Échéance TVA ?" }], { maxOutputTokens: 800 }));
    expect(a).toEqual(b);
    expect(a.at(-1)?.type).toBe("usage");
    expect(a.filter((x) => x.type === "texte").map((x) => (x as { texte: string }).texte).join("")).toContain("Échéance TVA ?");
  });
  it("#panne lève une erreur au milieu du flux", async () => {
    await expect(tout(new FournisseurSimule(0).generer([{ role: "user", content: "#panne" }], { maxOutputTokens: 800 })))
      .rejects.toThrow(/panne simulée/);
  });
});

describe("FournisseurAnthropic (faux fetch) — dépend du TODO 7", () => {
  const flux = [
    { type: "message_start", message: { usage: { input_tokens: 1000, output_tokens: 1, cache_read_input_tokens: 2000 } } },
    { type: "content_block_start", index: 0, content_block: { type: "text", text: "" } },
    { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: "Le 24 " } },
    { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: "du mois." } },
    { type: "message_delta", delta: { stop_reason: "end_turn" }, usage: { output_tokens: 400 } },
    { type: "message_stop" },
  ].map((d) => `event: ${d.type}\ndata: ${JSON.stringify(d)}\n\n`).join("");

  it("envoie une requête conforme (version 2026-10-21, pas de temperature, cache du system) et lit le flux", async () => {
    let requete: { url: string; init: RequestInit } | null = null;
    const faux = (async (url: string, init: RequestInit) => {
      requete = { url, init };
      return new Response(fluxDecoupe(flux, 7), { headers: { "content-type": "text/event-stream" } });
    }) as unknown as typeof fetch;
    const f = new FournisseurAnthropic("sk-ant-test", "claude-sonnet-5-5", "https://exemple.test/v1/messages", faux);
    const out = await tout(f.generer([{ role: "user", content: "Échéance TVA ?" }], { maxOutputTokens: 300 }));
    expect(out).toEqual([
      { type: "texte", texte: "Le 24 " }, { type: "texte", texte: "du mois." },
      { type: "usage", usage: { input_tokens: 1000, output_tokens: 400, cache_read_input_tokens: 2000 } },
    ]);
    const corps = JSON.parse(String(requete!.init.body));
    expect(corps).toMatchObject({ model: "claude-sonnet-5-5", max_tokens: 300, stream: true });
    expect(corps).not.toHaveProperty("temperature");
    expect(corps.system[0].cache_control).toEqual({ type: "ephemeral" });
    expect((requete!.init.headers as Record<string, string>)["anthropic-version"]).toBe("2026-10-21");
  });

  it("une réponse HTTP en erreur lève une erreur sans le corps de la réponse", async () => {
    const faux = (async () => new Response('{"error":{"message":"détail interne"}}', { status: 529 })) as unknown as typeof fetch;
    const f = new FournisseurAnthropic("sk-ant-test", "claude-sonnet-5-5", "https://exemple.test", faux);
    await expect(tout(f.generer([{ role: "user", content: "x" }], { maxOutputTokens: 10 }))).rejects.toThrow("Fournisseur indisponible (HTTP 529)");
  });
});
