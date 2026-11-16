"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, reinitialiserBase } from "@/lib/db";
import { utilisateurCourant } from "@/lib/auth";
import { auditer, journaliserEmail } from "@/lib/journal";
import { confirmerDepot, rejeterDepot } from "@/lib/depots";
import { estLocale, type Locale } from "@/i18n/config";
import { THESES } from "@/config/fonds";
import type { Utilisateur } from "@/lib/types";

function loc(fd: FormData): Locale { const l = String(fd.get("locale") ?? "fr"); return estLocale(l) ? l : "fr"; }

async function admin(): Promise<Utilisateur> {
  const u = await utilisateurCourant();
  if (!u || u.role !== "admin") redirect("/fr/connexion");
  return u;
}

export async function deciderKycAction(fd: FormData) {
  const l = loc(fd);
  const a = await admin();
  const kycId = Number(fd.get("kyc"));
  const decision = String(fd.get("decision"));
  const commentaire = String(fd.get("commentaire") ?? "").trim().slice(0, 1000);
  if (!["valide", "refuse", "incomplet"].includes(decision)) redirect(`/${l}/admin/kyc`);
  const d = db();
  const kyc = d.prepare("SELECT utilisateur_id FROM kyc WHERE id = ?").get(kycId) as { utilisateur_id: number } | undefined;
  if (!kyc) redirect(`/${l}/admin/kyc`);
  d.transaction(() => {
    d.prepare("UPDATE kyc SET decision = ?, decide_le = datetime('now'), decide_par = ?, commentaire = ? WHERE id = ?").run(decision, a.id, commentaire, kycId);
    d.prepare("UPDATE utilisateurs SET statut_kyc = ? WHERE id = ?").run(decision === "valide" ? "valide" : decision === "refuse" ? "refuse" : "incomplet", kyc.utilisateur_id);
  })();
  const u = d.prepare("SELECT email, prenom FROM utilisateurs WHERE id = ?").get(kyc.utilisateur_id) as { email: string; prenom: string };
  auditer({ id: a.id, email: a.email }, `kyc_${decision}`, `utilisateur:${kyc.utilisateur_id}`, { commentaire });
  journaliserEmail(u.email, `NEXT Capital : votre dossier (${decision})`, decision === "valide" ? `Bonjour ${u.prenom}, votre compte est ouvert. Vous pouvez régler votre adhésion et déposer des fonds.` : decision === "refuse" ? `Bonjour ${u.prenom}, votre dossier n'a pas pu être validé. ${commentaire}` : `Bonjour ${u.prenom}, votre dossier nécessite un complément : ${commentaire}`);
  revalidatePath(`/${l}/admin`, "layout");
  redirect(`/${l}/admin/kyc`);
}

export async function deciderDepotAction(fd: FormData) {
  const l = loc(fd);
  const a = await admin();
  const id = Number(fd.get("depot"));
  const decision = String(fd.get("decision"));
  if (decision === "confirmer") confirmerDepot(id, { id: a.id, email: a.email }, `Dépôt confirmé par ${a.email}`);
  else if (decision === "rejeter") rejeterDepot(id, { id: a.id, email: a.email }, String(fd.get("motif") ?? ""));
  revalidatePath(`/${l}/admin`, "layout");
  redirect(`/${l}/admin/depots`);
}

export async function enregistrerDealAction(fd: FormData) {
  const l = loc(fd);
  const a = await admin();
  const id = Number(fd.get("id") || 0);
  const slug = String(fd.get("slug") ?? "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
  const nom = String(fd.get("nom") ?? "").trim().slice(0, 120);
  const these = String(fd.get("these") ?? "ia");
  const stade = String(fd.get("stade") ?? "").trim().slice(0, 60);
  const pays = String(fd.get("pays") ?? "").trim().slice(0, 60);
  const canal = String(fd.get("canal") ?? "europe");
  const objectif = Math.round(Number(fd.get("objectif") || 0) * 100);
  const alloue = Math.round(Number(fd.get("alloue") || 0) * 100);
  const statut = String(fd.get("statut") ?? "a_venir");
  const exemple = fd.get("exemple") ? 1 : 0;
  const resume_fr = String(fd.get("resume_fr") ?? "").trim().slice(0, 600);
  const resume_en = String(fd.get("resume_en") ?? "").trim().slice(0, 600);
  if (!slug || !nom || !THESES.some((t) => t.id === these) || objectif <= 0 || !["ouvert", "a_venir", "cloture"].includes(statut)) redirect(`/${l}/admin/deals?erreur=1`);
  const d = db();
  if (id) {
    d.prepare("UPDATE deals SET slug=?, nom=?, these=?, stade=?, pays=?, canal=?, objectif_cents=?, alloue_cents=?, statut=?, exemple=?, resume_fr=?, resume_en=? WHERE id=?").run(slug, nom, these, stade, pays, canal, objectif, alloue, statut, exemple, resume_fr, resume_en, id);
  } else {
    d.prepare("INSERT INTO deals (slug, nom, these, stade, pays, canal, objectif_cents, alloue_cents, statut, exemple, resume_fr, resume_en) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)").run(slug, nom, these, stade, pays, canal, objectif, alloue, statut, exemple, resume_fr, resume_en);
  }
  auditer({ id: a.id, email: a.email }, id ? "deal_modifie" : "deal_cree", slug);
  revalidatePath(`/${l}/deals`);
  redirect(`/${l}/admin/deals`);
}

export async function supprimerDealAction(fd: FormData) {
  const l = loc(fd);
  const a = await admin();
  const id = Number(fd.get("id"));
  const deal = db().prepare("SELECT slug FROM deals WHERE id = ?").get(id) as { slug: string } | undefined;
  if (deal) { db().prepare("DELETE FROM deals WHERE id = ?").run(id); auditer({ id: a.id, email: a.email }, "deal_supprime", deal.slug); }
  revalidatePath(`/${l}/deals`);
  redirect(`/${l}/admin/deals`);
}

export async function reinitialiserAction(fd: FormData) {
  const l = loc(fd);
  const a = await admin();
  auditer({ id: a.id, email: a.email }, "reinitialisation_demandee");
  reinitialiserBase();
  revalidatePath("/", "layout");
  redirect(`/${l}/connexion`);
}
