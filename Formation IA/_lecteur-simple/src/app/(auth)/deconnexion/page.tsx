import type { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "@/server/actions/auth";
import { getSession } from "@/server/auth";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Déconnexion" };

/** La déconnexion passe par un POST (server action) : un simple lien ou un préchargement ne déconnecte jamais. */
export default async function DeconnexionPage() {
  const user = await getSession();
  return (
    <div>
      <p className="etiquette">Session</p>
      <h1 className="mt-4 text-[30px] text-ink">Déconnexion</h1>
      {user ? (
        <>
          <p className="mt-3 text-[13.5px] text-ink-2">
            Vous êtes connecté en tant que <strong className="text-ink">{user.email}</strong>.
          </p>
          <form action={logoutAction} className="mt-8 flex flex-wrap gap-3">
            <Button type="submit" size="lg">
              Se déconnecter
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/">Annuler</Link>
            </Button>
          </form>
        </>
      ) : (
        <>
          <p className="mt-3 text-[13.5px] text-ink-2">Vous n&apos;êtes pas connecté.</p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/connexion">Se connecter</Link>
          </Button>
        </>
      )}
    </div>
  );
}
