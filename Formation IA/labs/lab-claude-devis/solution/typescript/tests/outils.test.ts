// Tests unitaires des outils (sans modèle) — mêmes attentes que tests/test_outils.py
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CATALOGUE, MESSAGE_HORS_CATALOGUE, controlerDevis, coutUsd, enregistrerDevis, rechercherPrestation, verifierTva } from "../src/outils.js";

describe("TODO 1 — rechercherPrestation", () => {
  it("trouve les prises au prix du catalogue", () => {
    const hits = JSON.parse(rechercherPrestation("prise"));
    expect(hits.map((h: any) => h.code)).toEqual(expect.arrayContaining(["PRISE-SUPP", "PRISE-DEPL"]));
    for (const h of hits) expect(h.prix_ht).toBe(CATALOGUE[h.code].prix_ht);
  });
  it("ignore casse et accents", () => {
    expect(JSON.parse(rechercherPrestation("DETECTEUR"))[0].code).toBe("DETECT-FUMEE");
    expect(JSON.parse(rechercherPrestation("tab-rempl"))[0].code).toBe("TAB-REMPL");
  });
  it("signale le hors catalogue", () => expect(rechercherPrestation("climatisation")).toBe(MESSAGE_HORS_CATALOGUE));
  it("limite à 8 résultats", () => {
    const cat = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`X${i}`, { code: `X${i}`, libelle: "prise test", unite: "u", prix_ht: 1, page: 1 }]));
    expect(JSON.parse(rechercherPrestation("prise", cat))).toHaveLength(8);
  });
});

describe("TODO 2 — verifierTva", () => {
  it.each([[true, false, false, 10], [true, true, false, 5.5], [false, true, false, 20], [false, false, false, 20], [true, true, true, 20]])(
    "plus2=%s énergie=%s pro=%s → %s %%", (a, b, c, attendu) => {
      const r = JSON.parse(verifierTva(a as boolean, b as boolean, c as boolean));
      expect(r.taux).toBe(attendu); expect(r.motif).toBeTruthy();
    });
});

describe("TODO 3 — enregistrerDevis (confirmation humaine)", () => {
  it("refus : erreur et aucun fichier", async () => {
    const f = join(mkdtempSync(join(tmpdir(), "devis-")), "valides.jsonl");
    await expect(enregistrerDevis("Mme Fabre", 396, () => false, f)).rejects.toThrow(/refusé/);
    expect(existsSync(f)).toBe(false);
  });
  it("accord : une ligne écrite", async () => {
    const f = join(mkdtempSync(join(tmpdir(), "devis-")), "valides.jsonl");
    expect(await enregistrerDevis("Mme Fabre", 396, () => true, f)).toBe("devis enregistré");
    expect(JSON.parse(readFileSync(f, "utf8")).total_ttc).toBe(396);
  });
});

describe("TODO 4 — controlerDevis", () => {
  const ok = { code: "PRISE-SUPP", libelle: "Prise", quantite: 3, prix_unitaire_ht: 95, page_catalogue: 3 };
  const devis = (lignes: any[], total?: number, taux: number | null = 10) =>
    ({ lignes, taux_tva: taux, total_ht: total ?? lignes.reduce((s, l) => s + l.quantite * l.prix_unitaire_ht, 0) });
  it("devis conforme", () => expect(controlerDevis(devis([ok]))).toEqual([]));
  it("prix inventé", () => expect(controlerDevis(devis([{ ...ok, prix_unitaire_ht: 99 }])).some((a) => a.startsWith("prix non conforme"))).toBe(true));
  it("code inconnu", () => expect(controlerDevis(devis([{ ...ok, code: "PISCINE" }])).some((a) => a.startsWith("code inconnu"))).toBe(true));
  it("total incohérent et taux interdit", () => {
    const a = controlerDevis(devis([ok], 100, 0));
    expect(a.some((x) => x.startsWith("total_ht incohérent"))).toBe(true);
    expect(a.some((x) => x.startsWith("taux de TVA non autorisé"))).toBe(true);
  });
});

describe("TODO 5 — coutUsd", () => {
  it("applique les tarifs Sonnet 5.5", () => {
    expect(coutUsd({ input: 10_000, output: 1_000, cache_w: 1_500, cache_r: 12_000 })).toBeCloseTo(0.0372, 6);
    expect(coutUsd({ input: 1_000_000 })).toBeCloseTo(2, 6);
  });
});
