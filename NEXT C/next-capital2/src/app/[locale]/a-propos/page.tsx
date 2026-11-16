import { pageLocale } from "@/lib/locale";
import { PageEnTete, Section, EnTete, Carte } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "apropos", "/a-propos");
}

export default async function APropos({ params }: { params: Promise<{ locale: string }> }) {
  const { t } = await pageLocale(params);
  return (
    <>
      <PageEnTete sur={t.nav.apropos} titre={t.apropos.titre} texte={t.apropos.intro} numero="07" />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <Reveal><p className="font-serif text-3xl italic text-encre/80">{t.pied.accroche}</p></Reveal>
          <div className="space-y-6 text-lg leading-relaxed text-graphite">
            {t.apropos.paragraphes.map((p, i) => <Reveal key={i} delai={i * 0.06}><p>{p}</p></Reveal>)}
          </div>
        </div>
      </Section>
      <Section sombre>
        <EnTete titre={t.apropos.valeursTitre} sombre />
        <div className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-3">{t.apropos.valeurs.map((v, i) => <Carte key={v.t} numero={`0${i + 1}`} titre={v.t} texte={v.d} delai={i * 0.08} sombre />)}</div>
      </Section>
    </>
  );
}
