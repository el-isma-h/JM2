import { pageLocale } from "@/lib/locale";
import { PageEnTete, Section } from "@/components/Sections";
import { DealCarte } from "@/components/DealCarte";
import { db } from "@/lib/db";
import type { Deal } from "@/lib/types";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "deals", "/deals");
}

export default async function Deals({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const deals = db().prepare("SELECT * FROM deals ORDER BY CASE statut WHEN 'ouvert' THEN 0 WHEN 'a_venir' THEN 1 ELSE 2 END, id").all() as Deal[];
  return (
    <>
      <PageEnTete sur={t.nav.deals} titre={t.deals.titre} texte={t.deals.intro} numero="08" />
      <Section>
        <div className="grid border-t border-s border-encre/15 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((d) => <DealCarte key={d.id} d={d} t={t} locale={locale} intl={intl} />)}
        </div>
      </Section>
    </>
  );
}
