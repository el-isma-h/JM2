import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { metaPrivee } from "@/lib/seo";
import { pageLocale } from "@/lib/locale";
import { exigerAdmin } from "@/lib/garde";
import { deconnecterAction } from "@/lib/actions/auth";
import { NavCompte } from "@/components/NavCompte";

export const dynamic = "force-dynamic";

/** Espace privé : toujours noindex, quelle que soit NEXT_PUBLIC_ALLOW_INDEXING (hérité par toutes les sous-pages). */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaPrivee(locale, "admin");
}

export default async function AdminLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale, t } = await pageLocale(params);
  const u = await exigerAdmin(locale);
  const a = t.admin;
  const liens: [string, string][] = [["", a.tableau], ["kyc", a.kyc], ["depots", a.depots], ["souscriptions", a.souscriptions], ["deals", a.deals], ["journal", a.journal], ["emails", a.emails], ["export", a.export], ["parametres", a.parametres]];
  return (
    <div className="bg-os-2">
      <div className="conteneur grid gap-8 py-10 lg:grid-cols-[230px_1fr]">
        <aside>
          <p className="etiquette">{a.titre}</p>
          <p className="mt-2 font-display font-semibold tracking-tight text-2xl">{u.prenom} {u.nom}</p>
          <p className="mt-1 text-xs text-pierre">{u.email}</p>
          <NavCompte base={`/${locale}/admin`} liens={liens} />
          <form action={deconnecterAction} className="mt-6"><input type="hidden" name="locale" value={locale} /><button className="text-xs text-pierre underline-offset-4 hover:underline">{t.commun.deconnexion}</button></form>
          <p className="mt-3"><Link href={`/${locale}`} className="text-xs text-pierre underline-offset-4 hover:underline">← NEXT Capital</Link></p>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
