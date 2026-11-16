import { pageLocale } from "@/lib/locale";
import { PageEnTete, Section } from "@/components/Sections";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "cookies", "/cookies");
}

export default async function Cookies({ params }: { params: Promise<{ locale: string }> }) {
  const { t } = await pageLocale(params);
  return (
    <>
      <PageEnTete titre={t.legal.cookiesTitre} />
      <Section><p className="mx-auto max-w-3xl text-lg leading-relaxed text-encre/85">{t.legal.cookiesTexte}</p></Section>
    </>
  );
}
