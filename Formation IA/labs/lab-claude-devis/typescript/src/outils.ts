// Outils métier de Devis-Express (L077) — la source de vérité est le CODE, jamais le modèle.
import { appendFileSync } from "node:fs";
import { chargerCatalogue, type Prestation } from "./donnees.js";

export const CATALOGUE: Record<string, Prestation> = chargerCatalogue();
// Tarifs Claude Sonnet 5.5, $ par million de tokens (page Pricing, nov. 2026 — à revérifier)
export const TARIFS_SONNET = { input: 2.0, output: 10.0, cache_w: 4.0, cache_r: 0.1 };
export const TAUX_AUTORISES = [5.5, 10, 20];
export const MESSAGE_HORS_CATALOGUE = "aucune prestation ne correspond : signaler 'hors catalogue'";

export type Ligne = { code: string; libelle: string; quantite: number; prix_unitaire_ht: number; page_catalogue: number };
export type Devis = {
  client: string | null; resume_besoin: string; lignes: Ligne[]; taux_tva: number | null; total_ht: number;
  prestations_hors_catalogue: string[]; questions_manquantes: string[]; pret_a_valider: boolean;
  [cle: string]: unknown;
};
export type Usage = { input: number; output: number; cache_w: number; cache_r: number };
export type Confirmer = (clientNom: string, totalTtc: number) => boolean | Promise<boolean>;

export const sansAccents = (s: string): string => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Au plus 8 prestations dont le libellé ou le code contient motCle (JSON), sinon MESSAGE_HORS_CATALOGUE. */
export function rechercherPrestation(motCle: string, catalogue: Record<string, Prestation> = CATALOGUE): string {
  // TODO 1 : rechercher dans le catalogue (libellé OU code, sans casse ni accents), 8 résultats maximum
  // INDICE : comparez sansAccents(motCle) à sansAccents(p.libelle) et sansAccents(p.code)
  // INDICE : renvoyez JSON.stringify(liste), ou MESSAGE_HORS_CATALOGUE si la liste est vide
  throw new Error("TODO 1 : rechercher dans le catalogue (libellé OU code, sans casse ni accents), 8 résultats maximum");
}

/** Taux de TVA (E4) : pro → 20 ; énergétique et > 2 ans → 5,5 ; > 2 ans → 10 ; sinon 20. JSON {taux, motif}. */
export function verifierTva(logement_plus_2_ans: boolean, renovation_energetique: boolean, local_professionnel: boolean): string {
  // TODO 2 : encoder les quatre règles (le local professionnel prime)
  // INDICE : return JSON.stringify({ taux: 20, motif: "local professionnel" });
  throw new Error("TODO 2 : encoder les quatre règles (le local professionnel prime)");
}

export function creneaux(date_iso: string): string {
  const agenda: Record<string, string[]> = { "2026-11-05": ["08:00-10:00"], "2026-11-06": ["14:00-17:00"] };
  return JSON.stringify(agenda[date_iso] ?? []);
}

/** Confirmation par défaut : refus (en TypeScript, branchez votre interface « Valider » ici). */
export const refuserParDefaut: Confirmer = () => false;

/** Écrit le devis validé (JSONL) UNIQUEMENT si l'artisan confirme (E6) ; sinon lève Error("refusé par l'artisan"). */
export async function enregistrerDevis(clientNom: string, totalTtc: number, confirmer: Confirmer = refuserParDefaut,
  fichier: string = process.env.DEVIS_VALIDES ?? "devis_valides.jsonl"): Promise<string> {
  // TODO 3 : demander la confirmation ; si elle est négative, lever une Error ; sinon ajouter une ligne JSON au fichier
  // INDICE : appendFileSync(fichier, JSON.stringify({ date, client: clientNom, total_ttc: totalTtc }) + "\n")
  throw new Error("TODO 3 : demander la confirmation ; si elle est négative, lever une Error ; sinon ajouter une ligne JSON au fichier");
}

/** Contrôles de fond : code inconnu, prix non conforme, total_ht incohérent, taux non autorisé. */
export function controlerDevis(devis: Pick<Devis, "lignes" | "total_ht" | "taux_tva">,
  catalogue: Record<string, Prestation> = CATALOGUE): string[] {
  // TODO 4 : écrire les quatre contrôles (mêmes libellés d'alerte que la version Python)
  // INDICE : "code inconnu du catalogue : X", "prix non conforme au catalogue : X", "total_ht incohérent : …", "taux de TVA non autorisé : …"
  throw new Error("TODO 4 : écrire les quatre contrôles (mêmes libellés d'alerte que la version Python)");
}

export function calculerTotaux(devis: Devis): Devis {
  const ht = Math.round(devis.lignes.reduce((s, l) => s + l.quantite * l.prix_unitaire_ht, 0) * 100) / 100;
  devis.total_ht_calcule = ht;
  if (devis.taux_tva === null) { devis.total_tva = null; devis.total_ttc = null; return devis; }
  const tva = Math.round(ht * devis.taux_tva) / 100;
  devis.total_tva = tva;
  devis.total_ttc = Math.round((ht + tva) * 100) / 100;
  return devis;
}

/** Coût en $ : somme(tokens × prix par million) / 1 000 000, arrondi à 6 décimales. */
export function coutUsd(usage: Partial<Usage>, tarifs: Usage = TARIFS_SONNET): number {
  // TODO 5 : appliquer la formule (clés manquantes = 0)
  // INDICE : (Object.keys(tarifs) as (keyof Usage)[]).reduce(...)
  throw new Error("TODO 5 : appliquer la formule (clés manquantes = 0)");
}

export const OUTILS = [
  { name: "rechercher_prestation",
    description: "Recherche des prestations du catalogue par mot-clé (ex. 'prise', 'tableau'). Obligatoire avant toute ligne de devis ; si rien ne correspond, la prestation est 'hors catalogue'.",
    input_schema: { type: "object", properties: { mot_cle: { type: "string" } }, required: ["mot_cle"] } },
  { name: "verifier_tva",
    description: "Détermine le taux de TVA à partir de trois réponses du client ; si une information manque, la demander.",
    input_schema: { type: "object", properties: { logement_plus_2_ans: { type: "boolean" }, renovation_energetique: { type: "boolean" }, local_professionnel: { type: "boolean" } },
      required: ["logement_plus_2_ans", "renovation_energetique", "local_professionnel"], additionalProperties: false },
    strict: true },
  { name: "creneaux", description: "Créneaux d'intervention libres pour une date AAAA-MM-JJ.",
    input_schema: { type: "object", properties: { date_iso: { type: "string" } }, required: ["date_iso"] } },
  { name: "enregistrer_devis",
    description: "Enregistre un devis validé. N'appeler qu'après accord explicite de l'artisan. Peut être refusé.",
    input_schema: { type: "object", properties: { client_nom: { type: "string" }, total_ttc: { type: "number" } }, required: ["client_nom", "total_ttc"], additionalProperties: false },
    strict: true, cache_control: { type: "ephemeral" } },   // breakpoint de cache n° 1
];
