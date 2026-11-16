import Link from "next/link";
import { pageLocale } from "@/lib/locale";
import { PageEnTete, Section } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "parcours", "/parcours");
}

export default async function Parcours({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t } = await pageLocale(params);
  return (
    <>
      <PageEnTete sur={t.nav.parcours} titre={t.parcours.titre} numero="06" />
      <Section>
        <ol className="border-t border-encre/15">
          {t.parcours.etapes.map((e, i) => (
            <Reveal key={e.t} delai={i * 0.05}>
              <li className="grid gap-4 border-b border-encre/15 py-10 md:grid-cols-[120px_1fr_1.4fr] md:items-start">
                <span className="font-display text-5xl font-semibold tracking-tight text-pierre/60">0{i + 1}</span>
                <h2 className="text-3xl uppercase sm:text-4xl">{e.t}</h2>
                <p className="leading-relaxed text-graphite">{e.d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-14"><Link href={`/${locale}/candidature`} className="bouton-primaire">{t.commun.candidater}</Link></Reveal>
      </Section>
    </>
  );
}
