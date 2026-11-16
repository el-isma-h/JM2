import Link from "next/link";
import { pageLocale } from "@/lib/locale";
import { PageEnTete, Section, EnTete } from "@/components/Sections";
import { GrilleAdhesions, GrilleStatuts } from "@/components/GrilleAdhesions";
import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "adhesion", "/adhesion");
}

export default async function Adhesion({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  return (
    <>
      <PageEnTete sur={t.nav.adhesion} titre={t.adhesion.titre} texte={t.adhesion.intro} numero="05" />
      <Section>
        <EnTete titre={t.adhesion.niveauxTitre} />
        <div className="mt-14"><GrilleAdhesions t={t} intl={intl} /></div>
        <Reveal className="mt-12 grid gap-10 md:grid-cols-3">
          {t.fonds.frais.map((x) => (
            <div key={x.t} className="border-t border-encre/15 pt-5"><p className="font-display text-4xl font-semibold tracking-tight text-signal-2">{x.v}</p><p className="mt-3 text-sm font-medium uppercase">{x.t}</p><p className="mt-1 text-xs text-graphite">{x.d}</p></div>
          ))}
        </Reveal>
      </Section>
      <Section sombre>
        <EnTete titre={t.adhesion.statutsTitre} sombre />
        <div className="mt-14"><GrilleStatuts t={t} intl={intl} /></div>
        <Reveal className="mt-12"><Link href={`/${locale}/candidature`} className="bouton-or">{t.commun.candidater}</Link></Reveal>
      </Section>
    </>
  );
}
