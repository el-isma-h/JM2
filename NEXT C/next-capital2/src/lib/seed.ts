import type Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { DEALS_SEED } from "@/config/deals";
import { calculSouscription } from "@/config/fonds";

/** Comptes de démonstration (mot de passe commun : demo1234). */
export const COMPTES_DEMO = {
  admin: "admin@demo.next",
  investisseur: "investisseur@demo.next",
  candidat: "candidat@demo.next",
  motDePasse: "demo1234",
};

export function seedSiVide(d: Database.Database) {
  const n = d.prepare("SELECT COUNT(*) AS n FROM utilisateurs").get() as { n: number };
  if (n.n > 0) return;

  const hash = bcrypt.hashSync(COMPTES_DEMO.motDePasse, 10);
  const insUser = d.prepare(`INSERT INTO utilisateurs (email, mot_de_passe_hash, role, prenom, nom, langue, telephone, pays, statut_kyc, adhesion_niveau, adhesion_payee_le, adhesion_expire_le, bons_priorite_restants)
    VALUES (@email, @hash, @role, @prenom, @nom, @langue, @tel, @pays, @kyc, @niveau, @payee, @expire, @bons)`);

  const admin = insUser.run({ email: COMPTES_DEMO.admin, hash, role: "admin", prenom: "Direction", nom: "NEXT", langue: "fr", tel: null, pays: "LU", kyc: "valide", niveau: null, payee: null, expire: null, bons: 0 });
  const inv = insUser.run({ email: COMPTES_DEMO.investisseur, hash, role: "investisseur", prenom: "Camille", nom: "Durand", langue: "fr", tel: "+33 6 00 00 00 00", pays: "FR", kyc: "valide", niveau: "gold", payee: "2026-10-01 10:00:00", expire: "2027-10-01", bons: 1 });
  const cand = insUser.run({ email: COMPTES_DEMO.candidat, hash, role: "investisseur", prenom: "Yuki", nom: "Tanaka", langue: "en", tel: "+81 90 0000 0000", pays: "JP", kyc: "en_attente", niveau: "silver", payee: null, expire: null, bons: 0 });

  const insKyc = d.prepare("INSERT INTO kyc (utilisateur_id, reponses, soumis_le, decide_le, decide_par, decision, commentaire) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insKyc.run(Number(inv.lastInsertRowid), JSON.stringify({
    situation: "salarie", revenus: "100k-250k", patrimoine: "500k-1m", secteur: "finance", zones: ["europe", "etats-unis"],
    theses: ["ia", "quantique"], risque: "eleve", rendement: "x5", horizon: "5-8", experience: "confirme", origineFonds: "epargne", pep: "non", usPerson: "non",
  }), "2026-09-28 09:12:00", "2026-09-29 15:40:00", Number(admin.lastInsertRowid), "valide", "Dossier complet, pièces conformes.");
  insKyc.run(Number(cand.lastInsertRowid), JSON.stringify({
    situation: "entrepreneur", revenus: "250k-500k", patrimoine: "1m-5m", secteur: "tech", zones: ["asie", "etats-unis"],
    theses: ["ia", "sport"], risque: "moyen", rendement: "x3", horizon: "3-5", experience: "debutant", origineFonds: "cession", pep: "non", usPerson: "non",
  }), "2026-10-14 18:03:00", null, null, null, null);

  const insWallet = d.prepare("INSERT INTO wallets (utilisateur_id, solde_cents, tokens_centi) VALUES (?, ?, ?)");
  insWallet.run(Number(admin.lastInsertRowid), 0, 0);
  insWallet.run(Number(cand.lastInsertRowid), 0, 0);

  // Investisseur démo : dépôts, adhésion, souscriptions, journal cohérent.
  const uid = Number(inv.lastInsertRowid);
  let solde = 0, tokens = 0;
  const insDepot = d.prepare("INSERT INTO depots (utilisateur_id, methode, montant_cents, statut, reference, detail, cree_le, confirme_le, confirme_par) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  const insMvt = d.prepare("INSERT INTO mouvements (utilisateur_id, type, montant_cents, tokens_centi, solde_apres_cents, tokens_apres_centi, reference, description, cree_le) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  const insSous = d.prepare("INSERT INTO souscriptions (utilisateur_id, montant_cents, frais_cents, net_cents, tokens_centi, niveau, reference, cree_le) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

  const depot1 = 2000000; solde += depot1;
  insDepot.run(uid, "sepa", depot1, "confirme", "NXT-SEPA-7F3A21", JSON.stringify({ iban: "démo" }), "2026-09-30 11:00:00", "2026-10-01 09:30:00", Number(admin.lastInsertRowid));
  insMvt.run(uid, "depot", depot1, 0, solde, tokens, "NXT-SEPA-7F3A21", "Virement SEPA confirmé", "2026-10-01 09:30:00");
  solde -= 300000;
  insMvt.run(uid, "adhesion", -300000, 0, solde, tokens, "ADH-GOLD-2026", "Adhésion annuelle Gold", "2026-10-01 10:00:00");
  const s1 = calculSouscription(1000000, "gold"); solde -= 1000000; tokens += s1.tokensCenti;
  insSous.run(uid, 1000000, s1.fraisCents, s1.netCents, s1.tokensCenti, "gold", "NXT-SOUS-000001", "2026-10-02 14:20:00");
  insMvt.run(uid, "souscription", -1000000, s1.tokensCenti, solde, tokens, "NXT-SOUS-000001", "Souscription NXT (frais de structuration 4 %)", "2026-10-02 14:20:00");
  const depot2 = 1500000; solde += depot2;
  insDepot.run(uid, "carte", depot2, "confirme", "NXT-CARTE-SIM-91B2", JSON.stringify({ mode: "simulation" }), "2026-10-10 17:45:00", "2026-10-10 17:45:10", null);
  insMvt.run(uid, "depot", depot2, 0, solde, tokens, "NXT-CARTE-SIM-91B2", "Paiement par carte (simulation)", "2026-10-10 17:45:10");
  const s2 = calculSouscription(500000, "gold"); solde -= 500000; tokens += s2.tokensCenti;
  insSous.run(uid, 500000, s2.fraisCents, s2.netCents, s2.tokensCenti, "gold", "NXT-SOUS-000002", "2026-10-11 09:05:00");
  insMvt.run(uid, "souscription", -500000, s2.tokensCenti, solde, tokens, "NXT-SOUS-000002", "Souscription NXT (frais de structuration 4 %)", "2026-10-11 09:05:00");
  insDepot.run(uid, "crypto", 300000, "en_attente", "NXT-CRYPTO-C0DE55", JSON.stringify({ txHash: "0xdemo…", reseau: "Ethereum" }), "2026-10-15 20:10:00", null, null);
  insWallet.run(uid, solde, tokens);

  const insDeal = d.prepare("INSERT INTO deals (slug, nom, these, stade, pays, canal, objectif_cents, alloue_cents, statut, exemple, resume_fr, resume_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  for (const x of DEALS_SEED) insDeal.run(x.slug, x.nom, x.these, x.stade, x.pays, x.canal, x.objectifCents, x.alloueCents, x.statut, x.exemple ? 1 : 0, x.resume.fr, x.resume.en);

  d.prepare("INSERT INTO journal_audit (acteur_id, acteur_email, action, cible, details) VALUES (?, ?, ?, ?, ?)")
    .run(null, "système", "seed", "base", "Base de démonstration créée");
}
