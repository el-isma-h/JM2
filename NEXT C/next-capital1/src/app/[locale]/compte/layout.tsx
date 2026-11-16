import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { metaPrivee } from "@/lib/seo";
import { pageLocale } from "@/lib/locale";
import { utilisateurCourant } from "@/lib/auth";
import { deconnecterAction } from "@/lib/actions/auth";
import { NavCompte } from "@/components/NavCompte";

export const dynamic = "force-dynamic";

/** Espace privé : toujours noindex, quelle que soit NEXT_PUBLIC_ALLOW_INDEXING (hérité par toutes les sous-pages). */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaPrivee(locale, "compte");
}

export default async function CompteLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale, t } = await pageLocale(params);
  const u = await utilisateurCourant();
  if (!u) redirect(`/${locale}/connexion`);
  if (u.role === "admin") redirect(`/${locale}/admin`);
  const valide = u.statut_kyc === "valide";
  const liens: [string, string, boolean][] = [
    ["", t.compte.tableau, true], ["wallet", t.compte.wallet, valide], ["souscrire", t.compte.souscrire, valide], ["historique", t.compte.historique, valide],
    ["portefeuille", t.compte.portefeuille, valide], ["documents", t.compte.documents, true], ["statut", t.compte.statut, valide], ["profil", t.compte.profil, true],
  ];
  return (
    <div className="bg-os-2">
      <div className="conteneur grid gap-8 py-10 lg:grid-cols-[230px_1fr]">
        <aside>
          <p className="etiquette">{t.commun.monEspace}</p>
          <p className="mt-2 font-display font-semibold tracking-tight text-2xl">{u.prenom} {u.nom}</p>
          <p className="mt-1 text-xs text-pierre">{u.email}</p>
          <NavCompte base={`/${locale}/compte`} liens={liens.filter((l) => l[2]).map(([s, l]) => [s, l])} />
          <form action={deconnecterAction} className="mt-6"><input type="hidden" name="locale" value={locale} /><button className="text-xs text-pierre underline-offset-4 hover:underline">{t.commun.deconnexion}</button></form>
          <p className="mt-3"><Link href={`/${locale}`} className="text-xs text-pierre underline-offset-4 hover:underline">← NEXT Capital</Link></p>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
