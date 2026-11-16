import { pageLocale } from "@/lib/locale";
import { Section, Carte } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import { TitreGeant } from "@/components/TitreGeant";
import { FiletMarque } from "@/components/Logo";
import { FONDS, formatEuros } from "@/config/fonds";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "token", "/token");
}

export default async function Token({ params }: { params: Promise<{ locale: string }> }) {
  const { t, intl } = await pageLocale(params);
  const k = t.token;
  const fiche: [string, string][] = [
    [k.prix, `1 ${FONDS.token.symbole} = ${formatEuros(FONDS.token.prixEmissionCents, intl)}`],
    [k.standard, FONDS.token.standardPrevu],
    [k.registre, k.registreV],
    [k.liquidite, k.liquiditeV],
  ];
  return (
    <>
      <section className="sombre relative overflow-hidden bg-encre text-os">
        <div className="conteneur relative py-20 sm:py-28">
          <Reveal><p className="etiquette">{t.nav.token}</p></Reveal>
          <div className="mt-8"><TitreGeant lignes={[FONDS.token.symbole]} className="text-[28vw] leading-[0.9] text-signal sm:text-[22vw] lg:text-[260px]" /></div>
          <Reveal className="mt-6 flex flex-wrap items-center justify-between gap-6">
            <h1 className="text-3xl uppercase sm:text-5xl">{k.titre}</h1>
            <FiletMarque />
          </Reveal>
          <Reveal delai={0.1}><p className="mt-8 max-w-2xl text-lg leading-relaxed text-os/65">{k.intro}</p></Reveal>
          <dl className="mt-14 grid border-t border-s border-os/15 sm:grid-cols-2 lg:grid-cols-4">
            {fiche.map(([l, v]) => (
              <div key={l} className="border-b border-e border-os/15 p-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-os/45">{l}</dt>
                <dd className="mt-3 text-sm text-os">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <Section>
        <Reveal><p className="etiquette">{t.nav.token}</p><h2 className="mt-5 text-4xl uppercase sm:text-6xl">{k.comment}</h2></Reveal>
        <ol className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
          {k.etapes.map((e, i) => <Carte key={e.t} numero={`0${i + 1} / 04`} titre={e.t} texte={e.d} delai={i * 0.08} />)}
        </ol>
      </Section>
      <Section clair2>
        <Reveal><h2 className="text-4xl uppercase sm:text-6xl">{k.pourquoiTitre}</h2></Reveal>
        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {k.pourquoi.map((p, i) => <Carte key={p.t} numero={`0${i + 1}`} titre={p.t} texte={p.d} delai={i * 0.08} />)}
        </div>
      </Section>
    </>
  );
}
