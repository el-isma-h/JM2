import Link from "next/link";
import { redirect } from "next/navigation";
import { pageLocale } from "@/lib/locale";
import { utilisateurCourant } from "@/lib/auth";
import { connecterAction } from "@/lib/actions/auth";
import { COMPTES_DEMO } from "@/lib/seed";
import { Logo } from "@/components/Logo";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "connexion", "/connexion", { indexable: false });
}

export default async function Connexion({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ erreur?: string }> }) {
  const { locale, t } = await pageLocale(params);
  const u = await utilisateurCourant();
  if (u) redirect(`/${locale}/${u.role === "admin" ? "admin" : "compte"}`);
  const { erreur } = await searchParams;
  const c = t.connexion;
  return (
    <section className="bg-os-2">
      <div className="conteneur grid min-h-[70vh] items-center gap-10 py-16 lg:grid-cols-[1fr_1fr]">
        <div className="max-w-md">
          <Logo taille={34} />
          <h1 className="mt-8 text-5xl uppercase">{c.titre}</h1>
          <form action={connecterAction} className="mt-8 space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <div><label className="champ-label" htmlFor="email">{c.email}</label><input id="email" name="email" type="email" required autoComplete="email" className="champ" /></div>
            <div><label className="champ-label" htmlFor="mdp">{c.motDePasse}</label><input id="mdp" name="motDePasse" type="password" required autoComplete="current-password" className="champ" /></div>
            {erreur && <p className="pastille-rouge">{c.erreur}</p>}
            <button type="submit" className="bouton-primaire w-full">{c.bouton}</button>
          </form>
          <p className="mt-6 text-sm text-pierre">{c.pasDeCompte} <Link href={`/${locale}/candidature`} className="font-medium text-encre underline-offset-4 hover:underline">{c.candidater}</Link></p>
        </div>
        <div className="carte p-7">
          <p className="etiquette">{t.commun.demoCourt}</p>
          <h2 className="mt-3 text-2xl uppercase">{c.demoTitre}</h2>
          <ul className="mt-4 space-y-2 font-mono text-sm">
            <li><span className="text-pierre">admin · </span>{COMPTES_DEMO.admin}</li>
            <li><span className="text-pierre">investisseur (KYC validé) · </span>{COMPTES_DEMO.investisseur}</li>
            <li><span className="text-pierre">candidat (KYC en attente) · </span>{COMPTES_DEMO.candidat}</li>
          </ul>
          <p className="mt-4 text-sm text-pierre">{c.demoTexte}</p>
        </div>
      </div>
    </section>
  );
}
