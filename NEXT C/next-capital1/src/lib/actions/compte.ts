"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { utilisateurCourant, hacher } from "@/lib/auth";
import { auditer, journaliserEmail, nouvelleReference } from "@/lib/journal";
import { mouvement, wallet, investiCetteAnnee } from "@/lib/wallet";
import { adhesion, calculSouscription, montantValide, PAIEMENTS, type NiveauAdhesion } from "@/config/fonds";
import { estLocale, type Locale } from "@/i18n/config";
import { stripe, stripeConfigure, urlSite } from "@/lib/stripe";
import type { Depot, Utilisateur } from "@/lib/types";
import { confirmerDepot } from "@/lib/depots";
import bcrypt from "bcryptjs";

function loc(fd: FormData): Locale { const l = String(fd.get("locale") ?? "fr"); return estLocale(l) ? l : "fr"; }

async function investisseurValide(): Promise<Utilisateur> {
  const u = await utilisateurCourant();
  if (!u) redirect("/fr/connexion");
  if (u.statut_kyc !== "valide") redirect("/fr/compte?erreur=kyc");
  return u;
}

function cents(fd: FormData, champ: string): number {
  const v = Number(String(fd.get(champ) ?? "").replace(",", "."));
  return Number.isFinite(v) ? Math.round(v * 100) : 0;
}

export async function payerAdhesionAction(fd: FormData) {
  const l = loc(fd);
  const u = await investisseurValide();
  if (!u.adhesion_niveau) redirect(`/${l}/compte?erreur=generique`);
  const a = adhesion(u.adhesion_niveau);
  const d = db();
  try {
    d.transaction(() => {
      mouvement(u.id, "adhesion", -a.prixAnnuelCents, 0, `ADH-${a.id.toUpperCase()}-${new Date().getFullYear()}`, `Adhésion annuelle ${a.id}`);
      const expire = new Date(); expire.setFullYear(expire.getFullYear() + 1);
      d.prepare("UPDATE utilisateurs SET adhesion_payee_le = datetime('now'), adhesion_expire_le = ?, bons_priorite_restants = ? WHERE id = ?").run(expire.toISOString().slice(0, 10), a.bonsPriorite, u.id);
    })();
  } catch { redirect(`/${l}/compte?erreur=solde`); }
  auditer({ id: u.id, email: u.email }, "adhesion_payee", `utilisateur:${u.id}`, { niveau: a.id, montant: a.prixAnnuelCents });
  journaliserEmail(u.email, "NEXT Capital : adhésion confirmée", `Votre adhésion ${a.id} est active pour un an.`);
  revalidatePath(`/${l}/compte`, "layout");
  redirect(`/${l}/compte?ok=adhesion`);
}

export async function creerDepotSepaAction(fd: FormData) {
  const l = loc(fd);
  const u = await investisseurValide();
  const montant = cents(fd, "montant");
  if (montant < PAIEMENTS.depotMinimumCents) redirect(`/${l}/compte/wallet?erreur=montant`);
  const ref = nouvelleReference("NXT-SEPA");
  db().prepare("INSERT INTO depots (utilisateur_id, methode, montant_cents, statut, reference, detail) VALUES (?, 'sepa', ?, 'en_attente', ?, ?)").run(u.id, montant, ref, JSON.stringify({ iban: process.env.SEPA_IBAN ?? "" }));
  auditer({ id: u.id, email: u.email }, "depot_sepa_cree", ref, { montant });
  revalidatePath(`/${l}/compte/wallet`);
  redirect(`/${l}/compte/wallet?ok=depot&ref=${ref}`);
}

export async function creerDepotCryptoAction(fd: FormData) {
  const l = loc(fd);
  const u = await investisseurValide();
  const montant = cents(fd, "montant");
  const txHash = String(fd.get("txHash") ?? "").trim().slice(0, 120);
  if (montant < PAIEMENTS.depotMinimumCents || txHash.length < 10) redirect(`/${l}/compte/wallet?erreur=montant`);
  const ref = nouvelleReference("NXT-CRYPTO");
  db().prepare("INSERT INTO depots (utilisateur_id, methode, montant_cents, statut, reference, detail) VALUES (?, 'crypto', ?, 'en_attente', ?, ?)").run(u.id, montant, ref, JSON.stringify({ txHash, reseau: process.env.CRYPTO_RESEAU ?? "" }));
  auditer({ id: u.id, email: u.email }, "depot_crypto_declare", ref, { montant, txHash });
  revalidatePath(`/${l}/compte/wallet`);
  redirect(`/${l}/compte/wallet?ok=depot&ref=${ref}`);
}

export async function demarrerPaiementCarteAction(fd: FormData) {
  const l = loc(fd);
  const u = await investisseurValide();
  const montant = cents(fd, "montant");
  if (montant < PAIEMENTS.depotMinimumCents) redirect(`/${l}/compte/wallet?erreur=montant`);
  const ref = nouvelleReference(stripeConfigure() ? "NXT-CARTE" : "NXT-CARTE-SIM");
  const r = db().prepare("INSERT INTO depots (utilisateur_id, methode, montant_cents, statut, reference, detail) VALUES (?, 'carte', ?, 'en_attente', ?, ?)").run(u.id, montant, ref, JSON.stringify({ mode: stripeConfigure() ? "stripe" : "simulation" }));
  const depotId = Number(r.lastInsertRowid);
  auditer({ id: u.id, email: u.email }, "depot_carte_initie", ref, { montant, stripe: stripeConfigure() });
  if (!stripeConfigure()) redirect(`/${l}/compte/wallet/simulation?depot=${depotId}`);
  let url: string | null = null;
  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price_data: { currency: "eur", unit_amount: montant, product_data: { name: `Dépôt wallet NEXT Capital (${ref})` } }, quantity: 1 }],
      success_url: `${urlSite()}/api/stripe/retour?depot=${depotId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${urlSite()}/${l}/compte/wallet?erreur=annule`,
      client_reference_id: String(depotId),
      metadata: { depot_id: String(depotId), utilisateur_id: String(u.id), reference: ref },
      customer_email: u.email,
    });
    db().prepare("UPDATE depots SET detail = ? WHERE id = ?").run(JSON.stringify({ mode: "stripe", session: session.id }), depotId);
    url = session.url;
  } catch (e) {
    auditer({ id: u.id, email: u.email }, "stripe_erreur", ref, String(e));
  }
  if (!url) redirect(`/${l}/compte/wallet?erreur=generique`);
  redirect(url);
}

export async function simulerPaiementAction(fd: FormData) {
  const l = loc(fd);
  const u = await investisseurValide();
  const depotId = Number(fd.get("depot"));
  const depot = db().prepare("SELECT * FROM depots WHERE id = ? AND utilisateur_id = ? AND methode = 'carte'").get(depotId, u.id) as Depot | undefined;
  if (!depot || stripeConfigure()) redirect(`/${l}/compte/wallet?erreur=generique`);
  confirmerDepot(depotId, { id: u.id, email: u.email }, "Paiement par carte (simulation)");
  revalidatePath(`/${l}/compte`, "layout");
  redirect(`/${l}/compte/wallet?ok=carte`);
}

export async function souscrireAction(fd: FormData) {
  const l = loc(fd);
  const u = await investisseurValide();
  const montant = cents(fd, "montant");
  const err = (c: string) => redirect(`/${l}/compte/souscrire?erreur=${c}`);
  if (!u.adhesion_niveau || !u.adhesion_payee_le || (u.adhesion_expire_le && u.adhesion_expire_le < new Date().toISOString().slice(0, 10))) err("adhesion");
  if (!montantValide(montant)) err("montant");
  const a = adhesion(u.adhesion_niveau as NiveauAdhesion);
  if (a.plafondParOperationCents && montant > a.plafondParOperationCents) err("plafondOp");
  if (a.plafondAnnuelCents && investiCetteAnnee(u.id) + montant > a.plafondAnnuelCents) err("plafondAn");
  if (wallet(u.id).solde_cents < montant) err("solde");
  const calc = calculSouscription(montant, a.id);
  const ref = nouvelleReference("NXT-SOUS");
  const d = db();
  try {
    d.transaction(() => {
      d.prepare("INSERT INTO souscriptions (utilisateur_id, montant_cents, frais_cents, net_cents, tokens_centi, niveau, reference) VALUES (?, ?, ?, ?, ?, ?, ?)").run(u.id, montant, calc.fraisCents, calc.netCents, calc.tokensCenti, a.id, ref);
      mouvement(u.id, "souscription", -montant, calc.tokensCenti, ref, `Souscription NXT (frais de structuration ${a.fraisStructurationPct} %)`);
    })();
  } catch { err("solde"); }
  auditer({ id: u.id, email: u.email }, "souscription", ref, { montant, frais: calc.fraisCents, tokens: calc.tokensCenti });
  journaliserEmail(u.email, "NEXT Capital : attestation de souscription", `Souscription ${ref} : ${montant / 100} € (frais ${calc.fraisCents / 100} €), ${calc.tokensCenti / 100} NXT.`);
  revalidatePath(`/${l}/compte`, "layout");
  redirect(`/${l}/compte/souscrire?ok=1&ref=${ref}`);
}

export async function majProfilAction(fd: FormData) {
  const l = loc(fd);
  const u = await utilisateurCourant();
  if (!u) redirect(`/${l}/connexion`);
  const telephone = String(fd.get("telephone") ?? "").trim().slice(0, 40);
  const langue = String(fd.get("langue") ?? u.langue);
  db().prepare("UPDATE utilisateurs SET telephone = ?, langue = ? WHERE id = ?").run(telephone, estLocale(langue) ? langue : u.langue, u.id);
  auditer({ id: u.id, email: u.email }, "profil_modifie");
  revalidatePath(`/${l}/compte/profil`);
  redirect(`/${estLocale(langue) ? langue : l}/compte/profil?ok=1`);
}

export async function changerMotDePasseAction(fd: FormData) {
  const l = loc(fd);
  const u = await utilisateurCourant();
  if (!u) redirect(`/${l}/connexion`);
  const actuel = String(fd.get("actuel") ?? "");
  const nouveau = String(fd.get("nouveau") ?? "");
  if (!bcrypt.compareSync(actuel, u.mot_de_passe_hash) || nouveau.length < 8) redirect(`/${l}/compte/profil?erreur=mdp`);
  db().prepare("UPDATE utilisateurs SET mot_de_passe_hash = ? WHERE id = ?").run(hacher(nouveau), u.id);
  auditer({ id: u.id, email: u.email }, "mot_de_passe_modifie");
  redirect(`/${l}/compte/profil?ok=1`);
}
