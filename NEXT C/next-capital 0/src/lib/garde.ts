import { redirect } from "next/navigation";
import { utilisateurCourant } from "./auth";
import type { Utilisateur } from "./types";

export async function exigerInvestisseurValide(locale: string): Promise<Utilisateur> {
  const u = await utilisateurCourant();
  if (!u) redirect(`/${locale}/connexion`);
  if (u.role === "admin") redirect(`/${locale}/admin`);
  if (u.statut_kyc !== "valide") redirect(`/${locale}/compte`);
  return u;
}

export async function exigerAdmin(locale: string): Promise<Utilisateur> {
  const u = await utilisateurCourant();
  if (!u) redirect(`/${locale}/connexion`);
  if (u.role !== "admin") redirect(`/${locale}/compte`);
  return u;
}
