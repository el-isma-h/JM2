/** Questions de l'onboarding client. Les libellés et options sont partagés entre le formulaire et l'admin. */
export const o = (...libelles: string[]) => libelles.map((l) => ({ valeur: l, libelle: l }));

export const CIVILITES = o("Madame", "Monsieur", "Ne pas préciser");
export const FONCTIONS = o("Dirigeant ou gérant", "Associé", "Directeur administratif et financier", "Responsable RH", "Comptable", "Assistant de direction", "Autre");
export const SECTEURS = o(
  "BTP et construction",
  "Commerce et distribution",
  "Industrie",
  "Transport et logistique",
  "Hôtellerie, restauration",
  "Santé et médico-social",
  "Services aux entreprises",
  "Immobilier",
  "Agriculture",
  "Sport et loisirs",
  "Numérique et technologie",
  "Association",
  "Autre",
);
export const EFFECTIFS = o("Aucun salarié", "1 à 2", "3 à 5", "6 à 9", "10 à 19", "20 à 49", "50 à 99", "100 à 249", "250 et plus");
export const CHIFFRES_AFFAIRES = o("Ne pas préciser", "Moins de 100 k€", "100 à 500 k€", "500 k€ à 2 M€", "2 à 10 M€", "10 à 50 M€", "Plus de 50 M€");
export const LOCAUX = o("Propriétaire", "Locataire", "Les deux", "Pas de locaux");
export const BESOINS = [
  "Gestion de la paie",
  "Audit URSSAF",
  "Récupération de trésorerie et optimisation des charges",
  "Énergie et environnement",
  "Taxe foncière",
  "Immobilier solidaire",
  "Rénovation et adaptation des logements",
  "Formation et insertion",
  "Conseil, management de transition, performance financière",
  "Transformation digitale",
  "HPT Private Air",
];
export const USAGES_COFFRE = [
  "Transmettre des pièces à HPT pour un audit",
  "Archiver mes pièces administratives",
  "Conserver les documents RH et de paie",
  "Centraliser contrats et factures fournisseurs",
  "Sauvegarder des pièces juridiques (Kbis, statuts)",
];
export const DELAIS = o("Dès maintenant", "Dans les 3 mois", "Dans les 6 mois", "Je me renseigne");
export const SOURCES = o("Recommandation", "Un conseiller HPT", "Club sportif partenaire", "Société partenaire du GIE", "Réseaux sociaux", "Recherche internet", "Événement", "Autre");

export const ETAPES = [
  { id: 1, titre: "Vous", texte: "Qui êtes-vous et quel est votre rôle ?" },
  { id: 2, titre: "Votre société", texte: "L'identité légale de l'entreprise." },
  { id: 3, titre: "Votre activité", texte: "Pour adapter nos analyses à votre secteur." },
  { id: 4, titre: "Vos objectifs", texte: "Ce que vous attendez de HPT GIE." },
  { id: 5, titre: "Formule", texte: "Votre abonnement et vos consentements." },
] as const;

export type Reponses = Partial<{
  civilite: string;
  prenom: string;
  nom: string;
  telephone: string;
  dateNaissance: string;
  fonction: string;
  metier: string;
  siret: string;
  raisonSociale: string;
  formeJuridique: string;
  codeNaf: string;
  adresse: string;
  codePostal: string;
  ville: string;
  dateCreation: string;
  tvaIntra: string;
  siteWeb: string;
  kbisRecent: string;
  secteur: string;
  effectif: string;
  chiffreAffaires: string;
  etablissements: string;
  locaux: string;
  fournisseurEnergie: string;
  besoins: string[];
  produitsNext: string[];
  usagesCoffre: string[];
  priorite: string;
  delai: string;
  source: string;
  message: string;
  consentementRgpd: string;
  consentementContact: string;
  consentementNext: string;
  planSouhaite: string;
  termineLe: string;
}>;

/** Contrôle de la clé de Luhn d'un SIRET (14 chiffres). La Poste (356 000 000) fait exception. */
export function siretValide(s: string) {
  if (!/^\d{14}$/.test(s)) return false;
  if (s.startsWith("356000000")) return [...s].reduce((t, c) => t + Number(c), 0) % 5 === 0;
  let somme = 0;
  for (let i = 0; i < 14; i++) {
    let n = Number(s[13 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    somme += n;
  }
  return somme % 10 === 0;
}

/** Présentation des réponses dans l'admin, dans l'ordre de l'onboarding. */
export const SECTIONS_REPONSES: { titre: string; champs: [keyof Reponses, string][] }[] = [
  {
    titre: "Identité",
    champs: [
      ["civilite", "Civilité"],
      ["prenom", "Prénom"],
      ["nom", "Nom"],
      ["telephone", "Téléphone"],
      ["dateNaissance", "Date de naissance"],
      ["fonction", "Fonction"],
      ["metier", "Métier"],
    ],
  },
  {
    titre: "Société",
    champs: [
      ["raisonSociale", "Raison sociale"],
      ["siret", "SIRET"],
      ["formeJuridique", "Forme juridique"],
      ["codeNaf", "Code NAF"],
      ["adresse", "Adresse"],
      ["codePostal", "Code postal"],
      ["ville", "Ville"],
      ["dateCreation", "Création"],
      ["tvaIntra", "TVA intracommunautaire"],
      ["siteWeb", "Site internet"],
      ["kbisRecent", "Kbis de moins de 3 mois"],
    ],
  },
  {
    titre: "Activité",
    champs: [
      ["secteur", "Secteur"],
      ["effectif", "Salariés"],
      ["chiffreAffaires", "Chiffre d'affaires"],
      ["etablissements", "Établissements"],
      ["locaux", "Locaux"],
      ["fournisseurEnergie", "Fournisseur d'énergie"],
    ],
  },
  {
    titre: "Objectifs",
    champs: [
      ["besoins", "Besoins"],
      ["produitsNext", "Intérêt Next"],
      ["usagesCoffre", "Usage du coffre"],
      ["priorite", "Priorité"],
      ["delai", "Délai"],
      ["source", "Connu par"],
      ["message", "Message"],
    ],
  },
  {
    titre: "Consentements",
    champs: [
      ["planSouhaite", "Formule choisie"],
      ["consentementRgpd", "Traitement des données"],
      ["consentementContact", "Accepte d'être contacté"],
      ["consentementNext", "Nouveautés Next"],
      ["termineLe", "Onboarding terminé le"],
    ],
  },
];
