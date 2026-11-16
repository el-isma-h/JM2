import { pageLocale } from "@/lib/locale";
import { PageEnTete, Section } from "@/components/Sections";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "risques", "/risques");
}

export default async function Risques({ params }: { params: Promise<{ locale: string }> }) {
  const { t } = await pageLocale(params);
  return (
    <>
      <PageEnTete sur={t.nav.risques} titre={t.risques.titre} numero="!" />
      <Section>
        <ol className="border-t border-encre/15">
          {t.risques.paragraphes.map((p, i) => <li key={i} className="grid gap-4 border-b border-encre/15 py-8 md:grid-cols-[120px_1fr]"><span className="font-display text-4xl font-semibold tracking-tight text-rouge">0{i + 1}</span><p className="max-w-3xl text-lg leading-relaxed text-encre/85">{p}</p></li>)}
        </ol>
      </Section>
    </>
  );
}
