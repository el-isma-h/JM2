import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { demoEnabled, getSession } from "@/server/auth";
import { safeNextPath } from "@/lib/utils";
import { LoginForm } from "@/components/auth/login-form";
import { DemoButton } from "@/components/auth/demo-button";
import { Notice } from "@/components/ui/surface";

export const metadata: Metadata = { title: "Connexion" };

const ERRORS: Record<string, string> = {
  demo: "Le compte démo n'est pas disponible pour le moment.",
  trop: "Trop de tentatives. Réessayez dans une minute.",
  origine: "Requête refusée. Rechargez la page puis réessayez.",
};

export default async function ConnexionPage({ searchParams }: { searchParams: Promise<{ suite?: string; erreur?: string }> }) {
  const { suite, erreur } = await searchParams;
  if (await getSession()) redirect(safeNextPath(suite));
  return (
    <div>
      <p className="etiquette">Espace apprenant</p>
      <h1 className="mt-4 text-[30px] text-ink">Connexion</h1>
      <p className="mt-3 text-[13.5px] text-ink-2">Accès sur invitation. Utilisez l&apos;adresse e-mail à laquelle vous avez reçu votre lien d&apos;activation.</p>
      {erreur && ERRORS[erreur] ? (
        <Notice tone="danger" className="mt-6">
          {ERRORS[erreur]}
        </Notice>
      ) : null}
      <div className="mt-8">
        <LoginForm suite={safeNextPath(suite, "")} />
      </div>
      {demoEnabled() ? (
        <div className="mt-10 border-t border-line pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">Découvrir sans compte</p>
          <p className="mt-2 text-[13px] text-ink-2">Un parcours déjà avancé : niveau 1 certifié, niveau 2 en cours.</p>
          <DemoButton className="mt-4 w-full" />
        </div>
      ) : null}
    </div>
  );
}
