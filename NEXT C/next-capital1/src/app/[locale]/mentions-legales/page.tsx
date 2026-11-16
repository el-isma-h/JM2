import { pageLocale } from "@/lib/locale";
import { PageEnTete, Section } from "@/components/Sections";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "mentions", "/mentions-legales");
}

export default async function Mentions({ params }: { params: Promise<{ locale: string }> }) {
  const { t } = await pageLocale(params);
  return (
    <>
      <PageEnTete titre={t.legal.mentionsTitre} />
      <Section><div className="mx-auto max-w-3xl border border-dashed border-encre/40 p-8"><p className="pastille-or">{t.commun.aCompleter}</p><p className="mt-4 leading-relaxed text-encre/85">{t.legal.aCompleter}</p></div></Section>
    </>
  );
}
