import type { Avantage } from "@/serveur/db/schema";

const Go = 1024 ** 3;

/**
 * Formules d'abonnement par défaut (insérées par `npm run setup`, modifiables ensuite dans l'admin).
 * Les avantages Next sont marqués « à valider » : ils ont été proposés, pas encore confirmés par HPT GIE.
 */
export const PLANS_DEFAUT: {
  id: string;
  nom: string;
  prixCentimes: number;
  quotaOctets: number;
  agents: string[];
  avantages: Avantage[];
  ordre: number;
}[] = [
  {
    id: "basique",
    nom: "Basique",
    prixCentimes: 4990,
    quotaOctets: 10 * Go,
    agents: ["vigie"],
    avantages: [
      { texte: "Coffre-fort chiffré de 10 Go, hébergé sur l'infrastructure locale HPT", aValider: true },
      { texte: "Agent IA de surveillance des accès (Vigie)", aValider: true },
      { texte: "Messagerie sécurisée avec l'équipe HPT GIE", aValider: true },
    ],
    ordre: 1,
  },
  {
    id: "pro",
    nom: "Pro",
    prixCentimes: 8900,
    quotaOctets: 100 * Go,
    agents: ["vigie", "classeur", "conformite", "analyste"],
    avantages: [
      { texte: "Coffre-fort chiffré de 100 Go", aValider: true },
      { texte: "Tous les agents IA de cybersécurité", aValider: true },
      { texte: "Un diagnostic HPT offert", aValider: true },
      { texte: "-10 % sur les solutions Next", aValider: true, next: "tous" },
    ],
    ordre: 2,
  },
  {
    id: "ultra",
    nom: "Ultra",
    prixCentimes: 20000,
    quotaOctets: 1024 * Go,
    agents: ["vigie", "classeur", "conformite", "analyste"],
    avantages: [
      { texte: "Coffre-fort chiffré de 1 To", aValider: true },
      { texte: "Tous les agents IA de cybersécurité", aValider: true },
      { texte: "Un conseiller HPT dédié", aValider: true },
      { texte: "-20 % sur les solutions Next", aValider: true, next: "tous" },
      { texte: "Accès prioritaire à HPT Private Air", aValider: true },
    ],
    ordre: 3,
  },
];
