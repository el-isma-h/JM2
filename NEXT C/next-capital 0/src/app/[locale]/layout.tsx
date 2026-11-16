import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LANGUES, estLocale } from "@/i18n/config";
import { dict } from "@/i18n";
import { pageLocale } from "@/lib/locale";
import { utilisateurCourant } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BandeauDemo } from "@/components/BandeauDemo";
import { Chatbot } from "@/components/Chatbot";
import { robotsMeta, urlSite } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = dict(estLocale(locale) ? locale : "fr");
  return {
    metadataBase: new URL(urlSite()),
    title: { default: t.meta.titre, template: `%s · NEXT Capital` },
    description: t.meta.description,
    applicationName: "NEXT Capital",
    // Noindex global tant que NEXT_PUBLIC_ALLOW_INDEXING !== "true" ; chaque page publique précise ensuite la sienne.
    robots: robotsMeta(true),
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale, t } = await pageLocale(params);
  const u = await utilisateurCourant();
  return (
    <html lang={locale} dir={LANGUES[locale].dir}>
      <body className="flex min-h-screen flex-col">
        <BandeauDemo texte={t.commun.demo} />
        <Header locale={locale} t={t} session={u ? { prenom: u.prenom, role: u.role } : null} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} t={t} />
        <Chatbot locale={locale} t={t.chatbot} />
      </body>
    </html>
  );
}
