import { pageLocale } from "@/lib/locale";
import { PageEnTete, Section, EnTete, Carte } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "fonds", "/fonds");
}

export default async function Fonds({ params }: { params: Promise<{ locale: string }> }) {
  const { t } = await pageLocale(params);
  const f = t.fonds;
  return (
    <>
      <PageEnTete sur={t.nav.fonds} titre={f.titre} texte={f.intro} numero="01" />
      <Section>
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          {f.blocs.map((b, i) => <Carte key={b.t} numero={`0${i + 1} / 04`} titre={b.t} texte={b.d} delai={i * 0.08} />)}
        </div>
      </Section>
      <Section sombre>
        <EnTete sur={f.modeleSur} titre={f.modeleTitre} sombre />
        <div className="mt-14 grid border-t border-s border-os/15 md:grid-cols-3">
          {f.frais.map((x, i) => (
            <Reveal key={x.t} delai={i * 0.08} className="border-b border-e border-os/15 p-8">
              <p className="font-display text-5xl font-semibold tracking-tight text-signal sm:text-6xl">{x.v}</p>
              <h3 className="mt-6 text-2xl uppercase text-os">{x.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-os/60">{x.d}</p>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section clair2>
        <EnTete sur={f.equipeSur} titre={f.equipeTitre} />
        <div className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {f.equipe.map((x, i) => <Carte key={x.t} numero={`0${i + 1}`} titre={x.t} texte={x.d} delai={i * 0.08} />)}
        </div>
      </Section>
    </>
  );
}
