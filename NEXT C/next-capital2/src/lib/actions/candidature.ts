"use server";

import { redirect } from "next/navigation";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { CHEMIN_UPLOADS, db } from "@/lib/db";
import { hacher, ouvrirSession } from "@/lib/auth";
import { auditer, journaliserEmail } from "@/lib/journal";
import { ADHESIONS } from "@/config/fonds";
import { estLocale } from "@/i18n/config";

const TAILLE_MAX = 8 * 1024 * 1024;
const TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

async function sauverFichier(f: FormDataEntryValue | null, prefixe: string): Promise<string | null> {
  if (!(f instanceof File) || f.size === 0) return null;
  if (f.size > TAILLE_MAX || !TYPES.has(f.type)) throw new Error("fichier");
  const ext = f.type === "application/pdf" ? "pdf" : f.type === "image/png" ? "png" : "jpg";
  const nom = `${prefixe}-${crypto.randomBytes(12).toString("hex")}.${ext}`;
  fs.mkdirSync(CHEMIN_UPLOADS, { recursive: true });
  fs.writeFileSync(path.join(CHEMIN_UPLOADS, nom), Buffer.from(await f.arrayBuffer()));
  return nom;
}

const CHAMPS_TEXTE = ["prenom", "nom", "email", "telephone", "pays", "naissance", "nationalite", "adresse", "situation", "secteur", "revenus", "patrimoine", "origineFonds", "pep", "usPerson", "risque", "rendement", "horizon", "experience", "montantEnvisage", "adhesion"] as const;

export async function soumettreCandidature(formData: FormData) {
  const locale = String(formData.get("locale") ?? "fr");
  const l = estLocale(locale) ? locale : "fr";
  const v: Record<string, string> = {};
  for (const c of CHAMPS_TEXTE) v[c] = String(formData.get(c) ?? "").trim();
  const zones = formData.getAll("zones").map(String);
  const theses = formData.getAll("theses").map(String);
  const motDePasse = String(formData.get("motDePasse") ?? "");
  const erreur = (code: string) => redirect(`/${l}/candidature?erreur=${code}`);

  if (CHAMPS_TEXTE.some((c) => !v[c]) || zones.length === 0 || theses.length === 0 || !formData.get("attestation") || !formData.get("rgpd")) erreur("champs");
  if (motDePasse.length < 8) erreur("motDePasse");
  if (!ADHESIONS.some((a) => a.id === v.adhesion)) erreur("champs");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) erreur("champs");

  const existe = db().prepare("SELECT id FROM utilisateurs WHERE lower(email) = lower(?)").get(v.email);
  if (existe) erreur("emailPris");

  let piece: string | null = null, domicile: string | null = null;
  try {
    piece = await sauverFichier(formData.get("pieceIdentite"), "id");
    domicile = await sauverFichier(formData.get("justificatifDomicile"), "dom");
  } catch { erreur("fichier"); }
  if (!piece || !domicile) erreur("fichier");

  const reponses = { ...v, zones, theses };
  delete (reponses as Record<string, unknown>).email;
  delete (reponses as Record<string, unknown>).prenom;
  delete (reponses as Record<string, unknown>).nom;

  const d = db();
  const tx = d.transaction(() => {
    const r = d.prepare("INSERT INTO utilisateurs (email, mot_de_passe_hash, role, prenom, nom, langue, telephone, pays, statut_kyc, adhesion_niveau) VALUES (?, ?, 'investisseur', ?, ?, ?, ?, ?, 'en_attente', ?)")
      .run(v.email, hacher(motDePasse), v.prenom, v.nom, l, v.telephone, v.pays, v.adhesion);
    const uid = Number(r.lastInsertRowid);
    d.prepare("INSERT INTO kyc (utilisateur_id, reponses, piece_identite, justificatif_domicile) VALUES (?, ?, ?, ?)").run(uid, JSON.stringify(reponses), piece, domicile);
    d.prepare("INSERT INTO wallets (utilisateur_id, solde_cents, tokens_centi) VALUES (?, 0, 0)").run(uid);
    return uid;
  });
  const uid = tx();
  auditer({ id: uid, email: v.email }, "candidature_soumise", `utilisateur:${uid}`, { adhesion: v.adhesion, pays: v.pays });
  journaliserEmail(v.email, "NEXT Capital : candidature reçue", `Bonjour ${v.prenom}, votre dossier est en cours d'examen. Vous serez informé(e) dès l'ouverture de votre compte.`);
  await ouvrirSession(uid);
  redirect(`/${l}/candidature/merci`);
}
