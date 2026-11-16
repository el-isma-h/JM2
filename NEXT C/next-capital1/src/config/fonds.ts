/**
 * Configuration du fonds NEXT Capital.
 * Tous les montants sont en centimes d'euro. Modifiable sans toucher au reste du code.
 * Les valeurs sont des hypothèses de démonstration : elles n'engagent personne.
 */

export const FONDS = {
  nom: "NEXT Capital",
  nomCourt: "NEXT",
  token: { symbole: "NXT", nom: "NEXT Capital Token", standardPrevu: "ERC-20", prixEmissionCents: 1000 }, // 1 NXT = 10 €
  ticketMinimumCents: 150000, // 1 500 €
  ticketPasCents: 50000, // multiples de 500 €
  fraisGestionAnnuelsPct: { min: 1, max: 2 },
  commissionPlusValuePct: 20,
  dureeVehiculeAnnees: { min: 5, max: 10 },
  objectifCollecteCents: 2500000000, // 25 M€ (hypothèse)
  siege: "Luxembourg",
  reseaux: ["Luxembourg", "Paris", "Miami", "San Francisco"],
} as const;

export type NiveauAdhesion = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface Adhesion {
  id: NiveauAdhesion;
  prixAnnuelCents: number;
  plafondAnnuelCents: number | null; // null = illimité
  plafondParOperationCents: number | null;
  fraisStructurationPct: number;
  bonsPriorite: number;
  chargeAffaire: boolean;
  evenementsVip: boolean;
  dinersPrives: boolean;
}

/** Modèle calqué sur le modèle économique de Blast (adhésion annuelle + frais de structuration). */
export const ADHESIONS: Adhesion[] = [
  { id: "bronze", prixAnnuelCents: 150000, plafondAnnuelCents: 1000000, plafondParOperationCents: 200000, fraisStructurationPct: 5, bonsPriorite: 0, chargeAffaire: false, evenementsVip: false, dinersPrives: false },
  { id: "silver", prixAnnuelCents: 200000, plafondAnnuelCents: 2500000, plafondParOperationCents: 500000, fraisStructurationPct: 5, bonsPriorite: 0, chargeAffaire: true, evenementsVip: false, dinersPrives: false },
  { id: "gold", prixAnnuelCents: 300000, plafondAnnuelCents: 5000000, plafondParOperationCents: 1500000, fraisStructurationPct: 4, bonsPriorite: 1, chargeAffaire: true, evenementsVip: true, dinersPrives: false },
  { id: "platinum", prixAnnuelCents: 500000, plafondAnnuelCents: 10000000, plafondParOperationCents: 3000000, fraisStructurationPct: 4, bonsPriorite: 2, chargeAffaire: true, evenementsVip: true, dinersPrives: true },
  { id: "diamond", prixAnnuelCents: 1000000, plafondAnnuelCents: null, plafondParOperationCents: null, fraisStructurationPct: 3, bonsPriorite: 3, chargeAffaire: true, evenementsVip: true, dinersPrives: true },
];

export function adhesion(id: NiveauAdhesion): Adhesion {
  return ADHESIONS.find((a) => a.id === id) ?? ADHESIONS[0];
}

export type StatutId = "membre" | "partenaire" | "associe" | "club50" | "cercle100";

export interface Statut {
  id: StatutId;
  seuilCents: number; // capital investi cumulé
  ordre: number;
}

/** Statuts par capital investi cumulé (validés par Nika le 16/10/2026). */
export const STATUTS: Statut[] = [
  { id: "membre", seuilCents: 150000, ordre: 1 },
  { id: "partenaire", seuilCents: 1000000, ordre: 2 },
  { id: "associe", seuilCents: 2500000, ordre: 3 },
  { id: "club50", seuilCents: 5000000, ordre: 4 },
  { id: "cercle100", seuilCents: 10000000, ordre: 5 },
];

export function statutPourCapital(capitalInvestiCents: number): Statut | null {
  let actuel: Statut | null = null;
  for (const s of STATUTS) if (capitalInvestiCents >= s.seuilCents) actuel = s;
  return actuel;
}

export function prochainStatut(capitalInvestiCents: number): Statut | null {
  return STATUTS.find((s) => capitalInvestiCents < s.seuilCents) ?? null;
}

export type TheseId = "sport" | "ia" | "quantique" | "agroalimentaire";

export interface These {
  id: TheseId;
  allocationCiblePct: number;
  stades: string;
  horizonAnnees: string;
  performanceCible: string; // multiple cible, hypothèse non contractuelle
}

export const THESES: These[] = [
  { id: "ia", allocationCiblePct: 35, stades: "Seed – Série B", horizonAnnees: "5 – 8", performanceCible: "x5 – x12" },
  { id: "quantique", allocationCiblePct: 20, stades: "Seed – Série A", horizonAnnees: "7 – 10", performanceCible: "x8 – x15" },
  { id: "agroalimentaire", allocationCiblePct: 25, stades: "Série A – Série B", horizonAnnees: "4 – 7", performanceCible: "x3 – x6" },
  { id: "sport", allocationCiblePct: 20, stades: "Seed – Série B", horizonAnnees: "4 – 8", performanceCible: "x3 – x8" },
];

/** Canaux d'accès aux deals mis en avant sur la vitrine. */
export const CANAUX = ["yc", "europe", "internes", "luxembourg", "miami", "reseau"] as const;

export const PAIEMENTS = {
  methodes: ["sepa", "carte", "crypto"] as const,
  delaiSepaJours: "1 à 3",
  depotMinimumCents: 10000, // 100 €
};

export function calculSouscription(montantCents: number, niveau: NiveauAdhesion) {
  const a = adhesion(niveau);
  const fraisCents = Math.round((montantCents * a.fraisStructurationPct) / 100);
  const netCents = montantCents - fraisCents;
  const tokensCenti = Math.floor((netCents * 100) / FONDS.token.prixEmissionCents); // tokens en centièmes
  return { fraisCents, netCents, tokensCenti, fraisPct: a.fraisStructurationPct };
}

export function montantValide(montantCents: number): boolean {
  return montantCents >= FONDS.ticketMinimumCents && montantCents % FONDS.ticketPasCents === 0;
}

export function formatEuros(cents: number, locale = "fr-FR"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: cents % 100 === 0 ? 0 : 2 }).format(cents / 100);
}

export function formatTokens(centi: number, locale = "fr-FR"): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(centi / 100)} ${FONDS.token.symbole}`;
}
