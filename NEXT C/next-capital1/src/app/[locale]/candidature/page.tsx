import { pageLocale } from "@/lib/locale";
import { PageEnTete, Section } from "@/components/Sections";
import { FormulaireCandidature } from "@/components/FormulaireCandidature";
import { soumettreCandidature } from "@/lib/actions/candidature";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "candidature", "/candidature");
}

export default async function Candidature({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ erreur?: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const { erreur } = await searchParams;
  return (
    <>
      <PageEnTete sur={t.commun.candidater} titre={t.candidature.titre} texte={t.candidature.intro} numero="→" />
      <Section clair2>
        <div className="mx-auto max-w-4xl">
          <FormulaireCandidature locale={locale} t={t.candidature} adhesionT={t.adhesion} thesesT={t.theses} intl={intl} action={soumettreCandidature} erreur={erreur} />
        </div>
      </Section>
    </>
  );
}
