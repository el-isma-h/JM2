import Link from "next/link";
import { notFound } from "next/navigation";
import { pageLocale } from "@/lib/locale";
import { Section } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import { TitreGeant } from "@/components/TitreGeant";
import { db } from "@/lib/db";
import type { Deal } from "@/lib/types";
import { formatEuros, type TheseId } from "@/config/fonds";
import { COULEUR_THESE } from "@/config/couleurs";
import type { Metadata } from "next";
import { metaPage, urlSite } from "@/lib/seo";
import { SEO } from "@/i18n/seo";
import { JsonLd } from "@/components/JsonLd";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";

function dealParSlug(slug: string) {
  return db().prepare("SELECT * FROM deals WHERE slug = ?").get(slug) as Deal | undefined;
}

/** Description 140-160 caractères construite à partir des données du dossier (aucune donnée ajoutée). */
function descriptionDeal(d: Deal, locale: Locale, t: Dict): string {
  const s = SEO[locale];
  const resume = (locale === "fr" ? d.resume_fr : d.resume_en).trim();
  const these = t.theses[d.these as TheseId]?.nom ?? d.these;
  const tete = `${d.exemple === 1 ? `${t.commun.exemple} · ` : ""}${d.nom} (${these}, ${d.stade}, ${d.pays}). `;
  const fin = ` ${s.risqueCourt}`;
  let corps = resume;
  const max = 160 - tete.length - fin.length;
  if (corps.length > max) corps = corps.slice(0, Math.max(0, max - 1)).replace(/\s+\S*$/, "") + "…";
  return `${tete}${corps}${fin}`.trim();
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, t } = await pageLocale(params);
  const { slug } = await params;
  const d = dealParSlug(slug);
  if (!d) return {};
  return metaPage({ locale, sousChemin: `/deals/${d.slug}`, titre: `${d.nom} · ${t.deals.titre}`, description: descriptionDeal(d, locale, t), type: "article" });
}

export const dynamic = "force-dynamic";

export default async function DealPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const { slug } = await params;
  const d = dealParSlug(slug);
  if (!d) notFound();
  const pct = Math.min(100, Math.round((d.alloue_cents / d.objectif_cents) * 100));
  const these = t.theses[d.these as TheseId];
  const c = COULEUR_THESE[d.these as TheseId] ?? "#19E07A";
  const canal = t.accueil.canaux[d.canal as keyof typeof t.accueil.canaux];
  const base = urlSite();
  const filAriane = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SEO[locale].accueilFil, item: `${base}/${locale}` },
      { "@type": "ListItem", position: 2, name: t.deals.titre, item: `${base}/${locale}/deals` },
      { "@type": "ListItem", position: 3, name: d.nom, item: `${base}/${locale}/deals/${d.slug}` },
    ],
  };
  return (
    <>
      <JsonLd data={filAriane} />
      <section className="sombre relative overflow-hidden bg-encre text-os">
        <div className="conteneur relative py-16 sm:py-24">
          <Link href={`/${locale}/deals`} className="lien-nav">← {t.deals.titre}</Link>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className={d.statut === "ouvert" ? "pastille-vert" : d.statut === "a_venir" ? "pastille-azur" : "pastille-gris"}>{t.deals[d.statut]}</span>
            {d.exemple === 1 && <span className="pastille-or">{t.commun.exemple}</span>}
          </div>
          <div className="mt-6"><TitreGeant niveau="h1" lignes={[d.nom]} className="text-[8vw] lg:text-[88px]" /></div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: c }}>{these.nom} · {d.stade} · {d.pays}</p>
          <p className="mt-6 max-w-2xl text-lg text-os/70">{locale === "fr" ? d.resume_fr : d.resume_en}</p>
        </div>
      </section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <dl className="border-t border-encre/15 font-mono text-[11px] uppercase tracking-[0.16em]">
              {[[t.deals.these, these.nom], [t.deals.stade, d.stade], [t.deals.pays, d.pays], [t.deals.canal, canal?.t ?? d.canal]].map(([l, v]) => (
                <div key={l} className="flex justify-between gap-4 border-b border-encre/10 py-3"><dt className="text-pierre">{l}</dt><dd className="text-end text-encre">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-8">
              <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-pierre"><span>{t.deals.alloue}</span><span>{pct}%</span></div>
              <div className="mt-2 h-[3px] bg-encre/10"><div className="h-full" style={{ width: `${pct}%`, background: c }} /></div>
              <div className="mt-3 flex justify-between font-display text-2xl font-semibold tracking-tight"><span>{formatEuros(d.alloue_cents, intl)}</span><span className="text-pierre">{formatEuros(d.objectif_cents, intl)}</span></div>
            </div>
          </Reveal>
          <Reveal delai={0.1}>
            <p className="etiquette">{these.accroche}</p>
            <h2 className="mt-4 text-4xl uppercase">{these.nom}</h2>
            <p className="mt-5 leading-relaxed text-graphite">{these.d}</p>
            <ul className="mt-5 space-y-2">{these.points.map((p) => <li key={p} className="flex items-start gap-3 text-sm"><span className="mt-2 h-px w-4 shrink-0" style={{ background: c }} />{p}</li>)}</ul>
            <p className="mt-8 border-s border-encre/30 ps-4 font-mono text-[11px] leading-relaxed text-pierre">{t.deals.detailNote}</p>
            <Link href={`/${locale}/candidature`} className="bouton-primaire mt-8">{t.commun.candidater}</Link>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
