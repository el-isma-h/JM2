/**
 * Catalogue des agents de cybersécurité.
 * « socle » = protège tout le monde, quel que soit l'abonnement (antivirus, intégrité) :
 * ces protections ne sont jamais réservées à une formule payante.
 */
export type AgentId =
  | "sentinelle"
  | "integrite"
  | "vigie"
  | "classeur"
  | "lecteur"
  | "facteur"
  | "conformite"
  | "analyste"
  | "orchestrateur"
  | "aiguilleur"
  | "liaison-optimisation"
  | "liaison-ads"
  | "liaison-pay"
  | "liaison-courtage"
  | "liaison-immobilier"
  | "liaison-legalcy"
  | "liaison-formation"
  | "liaison-capital"
  | "relance"
  | "commandant";

export const AGENTS: {
  id: AgentId;
  nom: string;
  role: string;
  socle: boolean;
  ia: "aucune" | "locale" | "locale+secours";
  /** 0 = lancé à la demande seulement (console). */
  intervalleSecondes: number;
  famille: "securite" | "ecosysteme" | "coffre";
  /** Next piloté par l'agent (couleur et forme affichées). */
  produit?: string;
}[] = [
  {
    id: "sentinelle",
    nom: "Sentinelle",
    role: "Analyse chaque pièce déposée : antivirus ClamAV, signature réelle du fichier, macros Office, scripts PDF. Met en quarantaine au moindre doute.",
    socle: true,
    ia: "aucune",
    intervalleSecondes: 20,
    famille: "securite",
  },
  {
    id: "integrite",
    nom: "Intégrité",
    role: "Recalcule l'empreinte de chaque fichier chiffré et vérifie que le journal d'audit n'a pas été altéré.",
    socle: true,
    ia: "aucune",
    intervalleSecondes: 3600,
    famille: "securite",
  },
  {
    id: "vigie",
    nom: "Vigie",
    role: "Surveille les connexions et les téléchargements : attaques par mot de passe, nouvelles adresses, volumes anormaux. Coupe les sessions en cas d'attaque.",
    socle: false,
    ia: "aucune",
    intervalleSecondes: 60,
    famille: "securite",
  },
  {
    id: "classeur",
    nom: "Classeur",
    role: "Range automatiquement les pièces (URSSAF, énergie, taxe foncière, paie, juridique…) avec l'IA locale. Rien ne quitte la machine.",
    socle: false,
    ia: "locale",
    intervalleSecondes: 120,
    famille: "securite",
  },
  {
    id: "lecteur",
    nom: "Lecteur",
    role: "Lit chaque pièce saine (PDF, scans par OCR, Word, Excel), en fait la synthèse : type de document, résumé, données clés, ce qu'il faut en faire, rangement et pièces liées. Mots-clés pour la recherche. IA locale par défaut, IA externe seulement si un super admin l'autorise.",
    socle: false,
    ia: "locale",
    intervalleSecondes: 30,
    famille: "coffre",
  },
  {
    id: "facteur",
    nom: "Facteur",
    role: "Le courrier de HPT : relève la boîte e-mail (IMAP) pour rattacher les réponses des clients à leurs e-mails et déposer dans leur coffre les pièces qu'ils envoient ; expédie les e-mails programmés et les relances automatiques restées sans réponse. Rien n'est supprimé côté boîte.",
    socle: false,
    ia: "aucune",
    intervalleSecondes: 60,
    famille: "coffre",
  },
  {
    id: "conformite",
    nom: "Conformité",
    role: "Applique les règles RGPD : purge des sessions expirées, suppression définitive de la corbeille après 30 jours, pièces à renouveler (Kbis de plus de 3 mois).",
    socle: false,
    ia: "aucune",
    intervalleSecondes: 3600,
    famille: "securite",
  },
  {
    id: "analyste",
    nom: "Analyste",
    role: "Lit les alertes et rédige une synthèse pour l'équipe HPT. IA locale en priorité, Grok en secours uniquement sur des données anonymisées.",
    socle: false,
    ia: "locale+secours",
    intervalleSecondes: 900,
    famille: "securite",
  },
  {
    id: "orchestrateur",
    nom: "Orchestrateur",
    role: "Coordonne toute l'armée : synthèse de l'écosystème Next, propositions en souffrance, Next en panne. Rédige le point du jour pour les super admins.",
    socle: true,
    ia: "locale+secours",
    intervalleSecondes: 600,
    famille: "ecosysteme",
  },
  {
    id: "aiguilleur",
    nom: "Aiguilleur",
    role: "Lit le dossier de chaque pièce saine et propose de la copier vers le bon Next : URSSAF, énergie, taxe foncière vers Next Optimisation, paie vers Next Pay, contrats d'énergie, d'assurance et financements vers Next Courtage, baux vers Next Immobilier Solidaire, pièces juridiques vers Next Legalcy… Un admin valide.",
    socle: true,
    ia: "aucune",
    intervalleSecondes: 60,
    famille: "ecosysteme",
  },
  ...(
    [
      ["liaison-optimisation", "next-optimisation", "Liaison Optimisation", "dossiers de trop-payés, réclamations et agents de Next Optimisation"],
      ["liaison-ads", "next-ads", "Liaison Ads", "campagnes et dix agents publicitaires de Next Ads"],
      ["liaison-pay", "next-pay", "Liaison Pay", "paie, DSN et orchestrateur de Next Pay (ex-Next RH)"],
      ["liaison-formation", "next-formation", "Liaison Formation", "sessions, Qualiopi et assistant de Next Formation"],
      ["liaison-capital", "next-capital", "Liaison Capital", "candidatures, KYC et réservations de Next Kapital"],
      ["liaison-courtage", "next-courtage", "Liaison Courtage", "contrats d'énergie, d'assurance et dossiers de financement de Next Courtage (Énergie, Assurance, Bank)"],
      ["liaison-immobilier", "next-immobilier-solidaire", "Liaison Immobilier", "baux, quittances et hébergements de Next Immobilier Solidaire"],
      ["liaison-legalcy", "next-legalcy", "Liaison Legalcy", "dossiers juridiques et avocats partenaires de Next Legalcy"],
    ] as const
  ).map(([id, produit, nom, objet]) => ({
    id,
    nom,
    role: `Surveille ${objet} : indicateurs, alertes à remonter, clients HPT connus ou à inviter.`,
    socle: true,
    ia: "aucune" as const,
    intervalleSecondes: 120,
    famille: "ecosysteme" as const,
    produit,
  })),
  {
    id: "relance",
    nom: "Relance",
    role: "Repère les clients qui n'ont pas fini leur inscription ou n'ont déposé aucune pièce, et prépare un message de relance à valider.",
    socle: true,
    ia: "aucune",
    intervalleSecondes: 3600,
    famille: "ecosysteme",
  },
  {
    id: "commandant",
    nom: "Commandant",
    role: "Reçoit les ordres en français dans la console (« envoie les pièces URSSAF de Cabinet Test vers Optimisation ») et les traduit en propositions à valider.",
    socle: true,
    ia: "locale+secours",
    intervalleSecondes: 0,
    famille: "ecosysteme",
  },
];

export const agentParId = (id: string) => AGENTS.find((a) => a.id === id);
