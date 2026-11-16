"use server";

import { redirect } from "next/navigation";
import { connecter, deconnecter, utilisateurCourant } from "@/lib/auth";
import { auditer } from "@/lib/journal";
import { estLocale } from "@/i18n/config";

export async function connecterAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "fr");
  const l = estLocale(locale) ? locale : "fr";
  const email = String(formData.get("email") ?? "");
  const mdp = String(formData.get("motDePasse") ?? "");
  const u = await connecter(email, mdp);
  if (!u) {
    auditer({ id: null, email }, "connexion_echec");
    redirect(`/${l}/connexion?erreur=1`);
  }
  auditer({ id: u.id, email: u.email }, "connexion");
  redirect(`/${l}/${u.role === "admin" ? "admin" : "compte"}`);
}

export async function deconnecterAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "fr");
  const u = await utilisateurCourant();
  if (u) auditer({ id: u.id, email: u.email }, "deconnexion");
  await deconnecter();
  redirect(`/${estLocale(locale) ? locale : "fr"}`);
}
