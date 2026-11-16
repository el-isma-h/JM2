import { redirect } from "next/navigation";
import { LogoHpt } from "@/interface/ui/Logo";
import { Onboarding } from "@/interface/onboarding/Onboarding";
import { listerPlans } from "@/serveur/lib/abonnement";
import { config } from "@/serveur/lib/config";
import { lireReponses } from "@/serveur/lib/profil";
import { exiger } from "@/serveur/lib/securite/session";
import { stripeActif } from "@/serveur/lib/stripe";
import { PRODUITS_NEXT } from "@/contenu/next";
import { deconnexion } from "@/app/(acces)/actions";

export const metadata = { title: "Bienvenue" };

export default async function PageOnboarding() {
  const s = await exiger({ equipe: false, onboarding: false });
  if (s.compte.onboardingEtape === 99) redirect("/espace");
  const [reponses, plans] = await Promise.all([lireReponses(s.compte), listerPlans()]);
  return (
    <main className="min-h-[100dvh]">
      <header className="flex items-center justify-between h-16 px-4 sm:px-8 border-b border-filet">
        <div className="flex items-center gap-3">
          <LogoHpt className="h-8 w-auto" />
          <span className="text-sm text-texte-3">Coffre-fort</span>
        </div>
        <form action={deconnexion}>
          <button className="text-sm text-texte-2 hover:text-texte">Se déconnecter</button>
        </form>
      </header>
      <Onboarding
        etapeInitiale={Math.min(Math.max(s.compte.onboardingEtape, 1), 5)}
        reponses={reponses}
        email={s.compte.email}
        plans={plans.map((p) => ({ id: p.id, nom: p.nom, prixCentimes: p.prixCentimes, quotaOctets: p.quotaOctets, avantages: p.avantages }))}
        produitsNext={PRODUITS_NEXT.map(({ slug, nom, couleur, forme, description }) => ({ slug, nom, couleur, forme, description }))}
        paiement={stripeActif() ? "stripe" : config.modeDemo ? "demo" : "aucun"}
      />
    </main>
  );
}
