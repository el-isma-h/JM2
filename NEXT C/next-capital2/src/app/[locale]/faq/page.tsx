import { pageLocale } from "@/lib/locale";
import { PageEnTete, Section } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "faq", "/faq");
}

export default async function Faq({ params }: { params: Promise<{ locale: string }> }) {
  const { t } = await pageLocale(params);
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.r } })),
  };
  return (
    <>
      <JsonLd data={faqPage} />
      <PageEnTete sur={t.nav.faq} titre={t.faq.titre} numero="?" />
      <Section>
        <div className="border-t border-encre/15">
          {t.faq.items.map((f, i) => (
            <Reveal key={f.q} delai={i * 0.04}>
              <details className="group border-b border-encre/15 py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-2xl uppercase font-display font-semibold tracking-tight">
                  <span className="flex gap-6"><span className="font-mono text-[11px] tracking-[0.2em] text-pierre pt-2">0{i + 1}</span>{f.q}</span>
                  <span className="shrink-0 font-mono text-xl text-signal-2 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-3xl ps-12 leading-relaxed text-graphite">{f.r}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
