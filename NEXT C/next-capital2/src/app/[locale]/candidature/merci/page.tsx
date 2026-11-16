import Link from "next/link";
import { pageLocale } from "@/lib/locale";
import { Section } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "merci", "/candidature/merci", { indexable: false });
}

export default async function Merci({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t } = await pageLocale(params);
  return (
    <Section clair2>
      <Reveal className="mx-auto max-w-xl text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center border border-signal-2 font-mono text-2xl text-signal-2">✓</span>
        <h1 className="mt-8 text-5xl uppercase">{t.candidature.merciTitre}</h1>
        <p className="mt-5 leading-relaxed text-graphite">{t.candidature.merciTexte}</p>
        <Link href={`/${locale}/compte`} className="bouton-primaire mt-8">{t.commun.monEspace}</Link>
      </Reveal>
    </Section>
  );
}
