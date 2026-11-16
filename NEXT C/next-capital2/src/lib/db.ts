import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { seedSiVide } from "./seed";

const DOSSIER = path.join(process.cwd(), "data");
const FICHIER = path.join(DOSSIER, "next-capital.sqlite");

declare global {
  var __nextCapitalDb: Database.Database | undefined;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS utilisateurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  mot_de_passe_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'investisseur',
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  langue TEXT NOT NULL DEFAULT 'fr',
  telephone TEXT,
  pays TEXT,
  statut_kyc TEXT NOT NULL DEFAULT 'en_attente',
  adhesion_niveau TEXT,
  adhesion_payee_le TEXT,
  adhesion_expire_le TEXT,
  bons_priorite_restants INTEGER NOT NULL DEFAULT 0,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS kyc (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id),
  reponses TEXT NOT NULL,
  piece_identite TEXT,
  justificatif_domicile TEXT,
  soumis_le TEXT NOT NULL DEFAULT (datetime('now')),
  decide_le TEXT,
  decide_par INTEGER,
  decision TEXT,
  commentaire TEXT
);
CREATE TABLE IF NOT EXISTS wallets (
  utilisateur_id INTEGER PRIMARY KEY REFERENCES utilisateurs(id),
  solde_cents INTEGER NOT NULL DEFAULT 0,
  tokens_centi INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS depots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id),
  methode TEXT NOT NULL,
  montant_cents INTEGER NOT NULL,
  statut TEXT NOT NULL DEFAULT 'en_attente',
  reference TEXT NOT NULL UNIQUE,
  detail TEXT,
  cree_le TEXT NOT NULL DEFAULT (datetime('now')),
  confirme_le TEXT,
  confirme_par INTEGER
);
CREATE TABLE IF NOT EXISTS souscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id),
  montant_cents INTEGER NOT NULL,
  frais_cents INTEGER NOT NULL,
  net_cents INTEGER NOT NULL,
  tokens_centi INTEGER NOT NULL,
  niveau TEXT NOT NULL,
  reference TEXT NOT NULL UNIQUE,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS mouvements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id),
  type TEXT NOT NULL,
  montant_cents INTEGER NOT NULL DEFAULT 0,
  tokens_centi INTEGER NOT NULL DEFAULT 0,
  solde_apres_cents INTEGER NOT NULL,
  tokens_apres_centi INTEGER NOT NULL,
  reference TEXT,
  description TEXT,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS deals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  nom TEXT NOT NULL,
  these TEXT NOT NULL,
  stade TEXT NOT NULL,
  pays TEXT NOT NULL,
  canal TEXT NOT NULL,
  objectif_cents INTEGER NOT NULL,
  alloue_cents INTEGER NOT NULL DEFAULT 0,
  statut TEXT NOT NULL DEFAULT 'a_venir',
  exemple INTEGER NOT NULL DEFAULT 1,
  resume_fr TEXT NOT NULL DEFAULT '',
  resume_en TEXT NOT NULL DEFAULT '',
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS journal_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  acteur_id INTEGER,
  acteur_email TEXT,
  action TEXT NOT NULL,
  cible TEXT,
  details TEXT,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS emails_journal (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destinataire TEXT NOT NULL,
  sujet TEXT NOT NULL,
  corps TEXT NOT NULL,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS parametres (
  cle TEXT PRIMARY KEY,
  valeur TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  jeton TEXT PRIMARY KEY,
  utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id),
  expire_le TEXT NOT NULL,
  cree_le TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_mouvements_user ON mouvements(utilisateur_id, id);
CREATE INDEX IF NOT EXISTS idx_depots_statut ON depots(statut);
`;

export function db(): Database.Database {
  if (globalThis.__nextCapitalDb) return globalThis.__nextCapitalDb;
  fs.mkdirSync(path.join(DOSSIER, "uploads"), { recursive: true });
  const instance = new Database(FICHIER);
  instance.pragma("journal_mode = WAL");
  instance.pragma("foreign_keys = ON");
  instance.exec(SCHEMA);
  seedSiVide(instance);
  globalThis.__nextCapitalDb = instance;
  return instance;
}

export function reinitialiserBase() {
  const instance = db();
  instance.exec(`
    DELETE FROM sessions; DELETE FROM mouvements; DELETE FROM souscriptions; DELETE FROM depots;
    DELETE FROM wallets; DELETE FROM kyc; DELETE FROM journal_audit; DELETE FROM emails_journal;
    DELETE FROM deals; DELETE FROM utilisateurs; DELETE FROM parametres;
  `);
  seedSiVide(instance);
}

export const CHEMIN_UPLOADS = path.join(DOSSIER, "uploads");
