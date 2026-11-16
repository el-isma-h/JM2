import { redirect } from "next/navigation";
import { estEquipe, lireSession } from "@/serveur/lib/securite/session";

export default async function Accueil() {
  const s = await lireSession();
  if (!s) redirect("/connexion");
  if (s.aDeuxiemeFacteur && !s.deuxiemeFacteurValide) redirect("/connexion/verification");
  if (estEquipe(s.compte.role)) redirect("/admin");
  redirect(s.compte.onboardingEtape === 99 ? "/espace" : "/onboarding");
}
