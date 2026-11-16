import type { TheseId } from "./fonds";

/**
 * Dossiers d'illustration. Ce sont des EXEMPLES FICTIFS (champ `exemple: true`),
 * affichés comme tels sur la vitrine. Aucune société réelle n'est représentée.
 */
export interface DealSeed {
  slug: string;
  nom: string;
  these: TheseId;
  stade: string;
  pays: string;
  canal: string;
  objectifCents: number;
  alloueCents: number;
  statut: "ouvert" | "a_venir" | "cloture";
  exemple: boolean;
  resume: Record<string, string>; // par langue
}

export const DEALS_SEED: DealSeed[] = [
  {
    slug: "helion-vision", nom: "Helion Vision", these: "ia", stade: "Série A", pays: "Allemagne", canal: "europe",
    objectifCents: 150000000, alloueCents: 96000000, statut: "ouvert", exemple: true,
    resume: { fr: "Vision par ordinateur embarquée pour l'inspection industrielle en temps réel (exemple fictif).", en: "Embedded computer vision for real-time industrial inspection (fictional example)." },
  },
  {
    slug: "qubitra", nom: "Qubitra", these: "quantique", stade: "Seed", pays: "Pays-Bas", canal: "yc",
    objectifCents: 80000000, alloueCents: 52000000, statut: "ouvert", exemple: true,
    resume: { fr: "Correction d'erreurs pour processeurs quantiques supraconducteurs (exemple fictif).", en: "Error correction for superconducting quantum processors (fictional example)." },
  },
  {
    slug: "terranova-foods", nom: "Terranova Foods", these: "agroalimentaire", stade: "Série B", pays: "France", canal: "internes",
    objectifCents: 200000000, alloueCents: 200000000, statut: "cloture", exemple: true,
    resume: { fr: "Protéines végétales fermentées pour la restauration collective (exemple fictif).", en: "Fermented plant proteins for food service (fictional example)." },
  },
  {
    slug: "arena-pulse", nom: "Arena Pulse", these: "sport", stade: "Série A", pays: "Espagne", canal: "miami",
    objectifCents: 120000000, alloueCents: 31000000, statut: "ouvert", exemple: true,
    resume: { fr: "Données de performance et billetterie intelligente pour clubs professionnels (exemple fictif).", en: "Performance data and smart ticketing for professional clubs (fictional example)." },
  },
  {
    slug: "sylva-ai", nom: "Sylva AI", these: "ia", stade: "Seed", pays: "États-Unis", canal: "yc",
    objectifCents: 60000000, alloueCents: 0, statut: "a_venir", exemple: true,
    resume: { fr: "Agents IA pour la gestion de trésorerie des PME (exemple fictif).", en: "AI agents for SME treasury management (fictional example)." },
  },
  {
    slug: "cryo-grid", nom: "CryoGrid", these: "quantique", stade: "Série A", pays: "Luxembourg", canal: "luxembourg",
    objectifCents: 180000000, alloueCents: 0, statut: "a_venir", exemple: true,
    resume: { fr: "Électronique cryogénique pour centres de calcul quantique (exemple fictif).", en: "Cryogenic electronics for quantum data centers (fictional example)." },
  },
  {
    slug: "oliveum", nom: "Oliveum", these: "agroalimentaire", stade: "Série A", pays: "Italie", canal: "europe",
    objectifCents: 90000000, alloueCents: 44000000, statut: "ouvert", exemple: true,
    resume: { fr: "Traçabilité blockchain des huiles d'olive premium (exemple fictif).", en: "Blockchain traceability for premium olive oils (fictional example)." },
  },
  {
    slug: "kinetik-labs", nom: "Kinetik Labs", these: "sport", stade: "Seed", pays: "Royaume-Uni", canal: "reseau",
    objectifCents: 50000000, alloueCents: 50000000, statut: "cloture", exemple: true,
    resume: { fr: "Capteurs de prévention des blessures pour le sport de haut niveau (exemple fictif).", en: "Injury-prevention sensors for elite sport (fictional example)." },
  },
];
