import type { NiveauAdhesion } from "@/config/fonds";

export interface Utilisateur {
  id: number;
  email: string;
  mot_de_passe_hash: string;
  role: "investisseur" | "admin";
  prenom: string;
  nom: string;
  langue: string;
  telephone: string | null;
  pays: string | null;
  statut_kyc: "en_attente" | "valide" | "refuse" | "incomplet";
  adhesion_niveau: NiveauAdhesion | null;
  adhesion_payee_le: string | null;
  adhesion_expire_le: string | null;
  bons_priorite_restants: number;
  cree_le: string;
}

export interface Kyc {
  id: number;
  utilisateur_id: number;
  reponses: string;
  piece_identite: string | null;
  justificatif_domicile: string | null;
  soumis_le: string;
  decide_le: string | null;
  decide_par: number | null;
  decision: string | null;
  commentaire: string | null;
}

export interface Wallet { utilisateur_id: number; solde_cents: number; tokens_centi: number }

export interface Depot {
  id: number; utilisateur_id: number; methode: "sepa" | "carte" | "crypto"; montant_cents: number;
  statut: "en_attente" | "confirme" | "rejete"; reference: string; detail: string | null;
  cree_le: string; confirme_le: string | null; confirme_par: number | null;
}

export interface Souscription {
  id: number; utilisateur_id: number; montant_cents: number; frais_cents: number; net_cents: number;
  tokens_centi: number; niveau: NiveauAdhesion; reference: string; cree_le: string;
}

export interface Mouvement {
  id: number; utilisateur_id: number; type: "depot" | "adhesion" | "souscription" | "ajustement";
  montant_cents: number; tokens_centi: number; solde_apres_cents: number; tokens_apres_centi: number;
  reference: string | null; description: string | null; cree_le: string;
}

export interface Deal {
  id: number; slug: string; nom: string; these: string; stade: string; pays: string; canal: string;
  objectif_cents: number; alloue_cents: number; statut: "ouvert" | "a_venir" | "cloture"; exemple: number;
  resume_fr: string; resume_en: string; cree_le: string;
}

export interface EntreeJournal {
  id: number; acteur_id: number | null; acteur_email: string | null; action: string; cible: string | null; details: string | null; cree_le: string;
}

export interface EmailJournal { id: number; destinataire: string; sujet: string; corps: string; cree_le: string }
