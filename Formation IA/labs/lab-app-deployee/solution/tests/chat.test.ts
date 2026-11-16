// TODO 6 — traiterChat : l'ordre des contrôles avant le modèle, puis le streaming
import { describe, expect, it } from "vitest";
import { traiterChat, type Dependances } from "../src/lib/chat";
import { lireConfig } from "../src/lib/config";
import { MESSAGE_INDISPONIBLE } from "../src/lib/flux";
import { FournisseurSimule, type Fournisseur } from "../src/lib/fournisseurs";
import { Budget, Limiteur } from "../src/lib/quota";
import { evenements } from "./aides";

const JETON = "jeton-de-demo-assez-long";

function deps(surcharges: Partial<Dependances> = {}) {
  const journal: Record<string, unknown>[] = [];
  let appels = 0;
  const simule = new FournisseurSimule(0);
  const espion: Fournisseur = {
    nom: simule.nom, modele: simule.modele,
    generer: (m, o) => { appels++; return simule.generer(m, o); },
  };
  const d: Dependances = {
    config: lireConfig({ DEMO_TOKEN: JETON, QUOTA_PAR_MINUTE: "2", MAX_CARACTERES: "100" }),
    fournisseur: espion, limiteur: new Limiteur(2), budget: new Budget(300),
    journal: (e) => journal.push(e), ...surcharges,
  };
  return { d, journal, appels: () => appels };
}

const requete = (corps: unknown, jeton: string | null = JETON) =>
  new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", ...(jeton ? { authorization: `Bearer ${jeton}` } : {}) },
    body: typeof corps === "string" ? corps : JSON.stringify(corps),
  });
const question = { messages: [{ role: "user", content: "Quelle échéance de TVA ?" }] };

describe("TODO 6 — traiterChat", () => {
  it("⛔ 401 sans jeton ou avec un mauvais jeton, sans appeler le modèle", async () => {
    const { d, appels } = deps();
    expect((await traiterChat(requete(question, null), d)).status).toBe(401);
    expect((await traiterChat(requete(question, "mauvais-jeton-de-demo"), d)).status).toBe(401);
    expect(appels()).toBe(0);
  });

  it("400 sur JSON illisible, 413 sur message trop long, sans appeler le modèle", async () => {
    const { d, appels } = deps();
    expect((await traiterChat(requete("{pas du json"), d)).status).toBe(400);
    const long = await traiterChat(requete({ messages: [{ role: "user", content: "x".repeat(101) }] }), d);
    expect(long.status).toBe(413);
    expect(appels()).toBe(0);
  });

  it("200 : flux SSE (en-têtes anti-tampon), texte puis fin, appel journalisé avec son coût", async () => {
    const { d, journal } = deps();
    const r = await traiterChat(requete(question), d);
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toMatch(/^text\/event-stream/);
    expect(r.headers.get("cache-control")).toContain("no-transform");
    const evs = await evenements(r.body!);
    expect(evs[0].type).toBe("texte");
    expect(evs.at(-1)).toMatchObject({ type: "fin", coutUsd: 0 });
    expect(evs.filter((e) => e.type === "texte").map((e) => e.delta).join("")).toContain("Quelle échéance de TVA ?");
    expect(journal).toEqual([expect.objectContaining({ type: "appel_llm", modele: "simule", promptVersion: "dev" })]);
  });

  it("429 avec Retry-After au-delà du quota, sans appeler le modèle", async () => {
    const { d, appels } = deps();
    for (let i = 0; i < 2; i++) await (await traiterChat(requete(question), d)).text();
    const r = await traiterChat(requete(question), d);
    expect(r.status).toBe(429);
    expect(Number(r.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(appels()).toBe(2);
  });

  it("503 quand le budget global est épuisé", async () => {
    const budget = new Budget(1);
    budget.ajouter(1);
    const { d, appels } = deps({ budget });
    expect((await traiterChat(requete(question), d)).status).toBe(503);
    expect(appels()).toBe(0);
  });

  it("panne du fournisseur : message propre à l'utilisateur, détail dans le journal seulement", async () => {
    const { d, journal } = deps();
    const r = await traiterChat(requete({ messages: [{ role: "user", content: "#panne en plein flux" }] }), d);
    const evs = await evenements(r.body!);
    expect(evs.at(-1)).toEqual({ type: "erreur", message: MESSAGE_INDISPONIBLE });
    expect(journal).toEqual([expect.objectContaining({ type: "erreur_llm", message: expect.stringContaining("panne simulée") })]);
  });
});
