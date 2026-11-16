// Accès aux données partagées du lab (même dossier donnees/ que la version Python).
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type Prestation = { code: string; libelle: string; unite: string; prix_ht: number; page: number };
export type CasEval = {
  id: string; type: string; texte: string; lignes_attendues: Record<string, number>;
  taux_tva_attendu: number | null; hors_catalogue_attendu: string[]; questions_attendues: boolean;
};

export function dossierDonnees(): string {
  if (process.env.LAB_DONNEES) return process.env.LAB_DONNEES;
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, "donnees", "catalogue.json"))) return join(dir, "donnees");
    dir = resolve(dir, "..");
  }
  throw new Error("Dossier donnees/ introuvable : définissez LAB_DONNEES.");
}

const lire = (f: string) => readFileSync(join(dossierDonnees(), f), "utf8");

export function chargerCatalogue(): Record<string, Prestation> {
  const brut = JSON.parse(lire("catalogue.json")) as { prestations: Prestation[] };
  return Object.fromEntries(brut.prestations.map((p) => [p.code, p]));
}
export const chargerSchemaDevis = (): Record<string, unknown> => JSON.parse(lire("schema_devis.json"));
export const chargerPromptSysteme = (): string => lire("prompt_systeme.txt").trim();
export const chargerCasEval = (): CasEval[] =>
  lire("demandes_eval.jsonl").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l) as CasEval);
