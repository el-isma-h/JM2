import { db } from "./db";
import { auditer, journaliserEmail } from "./journal";
import { mouvement } from "./wallet";
import type { Depot } from "./types";

/** Confirme un dépôt et crédite le wallet (webhook Stripe, retour Stripe, simulation ou admin). Jamais exposé comme action serveur. */
export function confirmerDepot(depotId: number, acteur: { id: number | null; email: string | null }, description: string): boolean {
  const d = db();
  const depot = d.prepare("SELECT * FROM depots WHERE id = ?").get(depotId) as Depot | undefined;
  if (!depot || depot.statut !== "en_attente") return false;
  d.transaction(() => {
    d.prepare("UPDATE depots SET statut = 'confirme', confirme_le = datetime('now'), confirme_par = ? WHERE id = ?").run(acteur.id, depotId);
    mouvement(depot.utilisateur_id, "depot", depot.montant_cents, 0, depot.reference, description);
  })();
  auditer(acteur, "depot_confirme", depot.reference, { montant: depot.montant_cents, methode: depot.methode });
  const u = d.prepare("SELECT email FROM utilisateurs WHERE id = ?").get(depot.utilisateur_id) as { email: string };
  journaliserEmail(u.email, "NEXT Capital : dépôt crédité", `Votre dépôt ${depot.reference} de ${depot.montant_cents / 100} € a été crédité sur votre wallet.`);
  return true;
}

export function rejeterDepot(depotId: number, acteur: { id: number | null; email: string | null }, motif: string): boolean {
  const d = db();
  const depot = d.prepare("SELECT * FROM depots WHERE id = ?").get(depotId) as Depot | undefined;
  if (!depot || depot.statut !== "en_attente") return false;
  d.prepare("UPDATE depots SET statut = 'rejete', confirme_le = datetime('now'), confirme_par = ? WHERE id = ?").run(acteur.id, depotId);
  auditer(acteur, "depot_rejete", depot.reference, { motif });
  return true;
}
