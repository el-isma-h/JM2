import { db } from "./db";
import type { Mouvement, Wallet } from "./types";

export function wallet(utilisateurId: number): Wallet {
  const w = db().prepare("SELECT * FROM wallets WHERE utilisateur_id = ?").get(utilisateurId) as Wallet | undefined;
  if (w) return w;
  db().prepare("INSERT INTO wallets (utilisateur_id, solde_cents, tokens_centi) VALUES (?, 0, 0)").run(utilisateurId);
  return { utilisateur_id: utilisateurId, solde_cents: 0, tokens_centi: 0 };
}

/**
 * Applique un mouvement au wallet et l'inscrit dans le grand livre (traçabilité).
 * Doit être appelé dans une transaction pour les opérations composées.
 */
export function mouvement(utilisateurId: number, type: Mouvement["type"], montantCents: number, tokensCenti: number, reference: string | null, description: string) {
  const w = wallet(utilisateurId);
  const solde = w.solde_cents + montantCents;
  const tokens = w.tokens_centi + tokensCenti;
  if (solde < 0 || tokens < 0) throw new Error("solde_insuffisant");
  db().prepare("UPDATE wallets SET solde_cents = ?, tokens_centi = ? WHERE utilisateur_id = ?").run(solde, tokens, utilisateurId);
  db().prepare("INSERT INTO mouvements (utilisateur_id, type, montant_cents, tokens_centi, solde_apres_cents, tokens_apres_centi, reference, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run(utilisateurId, type, montantCents, tokensCenti, solde, tokens, reference, description);
  return { solde, tokens };
}

export function capitalInvesti(utilisateurId: number): number {
  const r = db().prepare("SELECT COALESCE(SUM(montant_cents), 0) AS total FROM souscriptions WHERE utilisateur_id = ?").get(utilisateurId) as { total: number };
  return r.total;
}

export function investiCetteAnnee(utilisateurId: number): number {
  const r = db().prepare("SELECT COALESCE(SUM(montant_cents), 0) AS total FROM souscriptions WHERE utilisateur_id = ? AND strftime('%Y', cree_le) = strftime('%Y', 'now')").get(utilisateurId) as { total: number };
  return r.total;
}
