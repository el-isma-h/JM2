import { pageLocale } from "@/lib/locale";
import { PageEnTete, Section } from "@/components/Sections";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "confidentialite", "/confidentialite");
}

export default async function Confidentialite({ params }: { params: Promise<{ locale: string }> }) {
  const { t } = await pageLocale(params);
  return (
    <>
      <PageEnTete titre={t.legal.confTitre} />
      <Section><div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-encre/85"><p>{t.legal.confTexte}</p><p className="border border-dashed border-encre/40 p-6 text-sm">{t.legal.aCompleter}</p></div></Section>
    </>
  );
}
