import Link from "next/link";
import type { CSSProperties } from "react";
import { pageLocale } from "@/lib/locale";
import { Reveal } from "@/components/Reveal";
import { HeroVisuel } from "@/components/HeroVisuel";
import { Intro } from "@/components/Intro";
import { TitreGeant } from "@/components/TitreGeant";
import { Section, Avertissement } from "@/components/Sections";
import { FiletMarque } from "@/components/Logo";
import { CANAUX, FONDS, THESES, formatEuros } from "@/config/fonds";
import { COULEUR_THESE } from "@/config/couleurs";
import type { Metadata } from "next";
import { metaSeo, urlSite } from "@/lib/seo";
import { SEO } from "@/i18n/seo";
import { JsonLd } from "@/components/JsonLd";

/** Coupe un titre en deux lignes équilibrées (sur un espace). */
function couperEnDeux(texte: string): string[] {
  const mots = texte.split(" ");
  if (mots.length < 3) return [texte];
  const milieu = Math.ceil(mots.length / 2);
  return [mots.slice(0, milieu).join(" "), mots.slice(milieu).join(" ")];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "accueil", "");
}

export default async function Accueil({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const a = t.accueil;
  const base = urlSite();
  // Données structurées limitées à ce qui est établi (aucune adresse, aucun agrément, aucun chiffre).
  const donneesStructurees = [
    { "@context": "https://schema.org", "@type": "Organization", "@id": `${base}/#organisation`, name: "NEXT Capital", url: `${base}/${locale}`, description: SEO[locale].accueil.d },
    { "@context": "https://schema.org", "@type": "WebSite", "@id": `${base}/#site`, name: "NEXT Capital", url: `${base}/${locale}`, inLanguage: locale, publisher: { "@id": `${base}/#organisation` } },
  ];

  return (
    <>
      <JsonLd data={donneesStructurees} />
      <Intro accroche={a.sur} />

      {/* HERO */}
      <section className="sombre bg-encre text-os">
        <div className="conteneur grid min-h-[calc(100svh-3.5rem)] gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-0">
          <div className="flex flex-col justify-center">
            <Reveal><p className="etiquette">{a.sur} — {FONDS.siege}</p></Reveal>
            <Reveal delai={0.08}>
              <h1 className="titre-geant mt-8 text-[15vw] sm:text-[11vw] lg:text-[8.2vw] xl:text-[128px]">
                {a.titre1}<br /><span className="text-signal">{a.titre2}</span>
              </h1>
            </Reveal>
            <Reveal delai={0.18}><p className="mt-10 max-w-xl text-base leading-relaxed text-os/65 sm:text-lg">{a.accroche}</p></Reveal>
            <Reveal delai={0.26} className="mt-10 flex flex-wrap items-center gap-3">
              <Link href={`/${locale}/candidature`} className="bouton-or">{a.cta}</Link>
              <Link href={`/${locale}/token`} className="bouton-contour">{a.cta2}</Link>
              <span className="ms-2 font-mono text-[10px] uppercase tracking-[0.2em] text-os/50">{a.des} <strong className="text-os">{formatEuros(FONDS.ticketMinimumCents, intl)}</strong> {a.parInvestissement}</span>
            </Reveal>
          </div>
          <HeroVisuel />
        </div>
        <div className="border-t border-os/10">
          <div className="conteneur grid grid-cols-2 md:grid-cols-4">
            {a.chiffres.map((c, i) => (
              <Reveal key={c.l} delai={i * 0.06} className={`py-8 pe-6 ${i > 0 ? "md:border-s md:border-os/10 md:ps-6" : ""}`}>
                <p className="font-display text-4xl font-semibold tracking-tight text-os sm:text-5xl">{c.v}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-os/45">{c.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTE COURT */}
      <section className="border-b border-encre/15 bg-os text-encre">
        <div className="conteneur py-24 sm:py-32">
          <Reveal><p className="etiquette">{a.piliersSur}</p></Reveal>
          <div className="mt-8"><TitreGeant lignes={a.piliersTitre.includes(", ") ? a.piliersTitre.split(", ") : couperEnDeux(a.piliersTitre)} className="text-[11vw] sm:text-[8vw] lg:text-[96px]" /></div>
          <div className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 xl:grid-cols-4">
            {a.piliers.map((p, i) => (
              <Reveal key={p.t} delai={i * 0.08} className="border-t border-encre/15 pt-6">
                <span className="font-mono text-[11px] tracking-[0.2em] text-pierre">0{i + 1}</span>
                <h3 className="mt-4 text-2xl uppercase">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite">{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* THÈSES : une section pleine hauteur par thèse */}
      <section className="sombre bg-encre text-os">
        <div className="conteneur py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div><p className="etiquette">{a.thesesSur}</p><h2 className="mt-5 text-4xl uppercase sm:text-6xl">{a.thesesTitre}</h2></div>
            <div className="flex flex-col items-end gap-4"><FiletMarque /><Link href={`/${locale}/marches`} className="lien-nav">{t.marches.titre} ↗</Link></div>
          </Reveal>
        </div>
        {THESES.map((th, i) => {
          const d = t.theses[th.id];
          const c = COULEUR_THESE[th.id];
          return (
            <Link key={th.id} href={`/${locale}/theses#${th.id}`} className="group relative block overflow-hidden border-t border-os/10" style={{ "--c": c } as CSSProperties}>
              <span className="filigrane absolute -top-4 end-2 text-[40vw] text-os sm:text-[26vw]" aria-hidden="true">0{i + 1}</span>
              <div className="conteneur relative flex min-h-[70svh] flex-col justify-end py-16">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-os/45">0{i + 1} / 0{THESES.length} — {d.accroche}</p>
                <div className="mt-6"><TitreGeant lignes={d.nom.split(" ").length > 2 ? [d.nom.split(" ").slice(0, 1).join(" "), d.nom.split(" ").slice(1).join(" ")] : [d.nom]} className="text-[10vw] text-os transition-colors duration-500 group-hover:text-[var(--c)] sm:text-[9vw] lg:text-[150px]" /></div>
                <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-end">
                  <p className="font-serif text-2xl italic" style={{ color: c }}>{d.points.join(" · ")}</p>
                  <div>
                    <p className="max-w-xl text-sm leading-relaxed text-os/65">{d.d}</p>
                    <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                      <div><dt className="text-os/40">{t.theses.allocation}</dt><dd className="mt-1 text-os">{th.allocationCiblePct} %</dd></div>
                      <div><dt className="text-os/40">{t.theses.stades}</dt><dd className="mt-1 text-os">{th.stades}</dd></div>
                      <div><dt className="text-os/40">{t.theses.horizon}</dt><dd className="mt-1 text-os">{th.horizonAnnees} {t.theses.ans}</dd></div>
                      <div><dt className="text-os/40">{t.theses.perf}</dt><dd className="mt-1 text-os">{th.performanceCible}</dd></div>
                    </dl>
                  </div>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: c }} />
              </div>
            </Link>
          );
        })}
        <div className="conteneur pb-10"><Avertissement texte={a.disclaimerPerf} /></div>
      </section>

      {/* CANAUX */}
      <Section>
        <Reveal><p className="etiquette">{a.canauxSur}</p><h2 className="mt-5 text-4xl uppercase sm:text-6xl">{a.canauxTitre}</h2></Reveal>
        <div className="mt-14 grid border-t border-s border-encre/15 sm:grid-cols-2 lg:grid-cols-3">
          {CANAUX.map((c, i) => (
            <Reveal key={c} delai={i * 0.05} className="group border-b border-e border-encre/15 p-8 transition-colors hover:bg-encre hover:text-os">
              <span className="font-mono text-[11px] tracking-[0.2em] text-pierre">0{i + 1}</span>
              <h3 className="mt-6 text-3xl uppercase">{a.canaux[c].t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-graphite group-hover:text-os/60">{a.canaux[c].d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* PARCOURS */}
      <Section clair2>
        <Reveal><p className="etiquette">{a.parcoursSur}</p><h2 className="mt-5 text-4xl uppercase sm:text-6xl">{a.parcoursTitre}</h2></Reveal>
        <ol className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {t.parcours.etapes.map((e, i) => (
            <Reveal key={e.t} delai={i * 0.06} className="border-t border-encre/15 pt-5">
              <span className="font-mono text-[11px] tracking-[0.2em] text-pierre">0{i + 1} / 06</span>
              <h3 className="mt-4 text-2xl uppercase">{e.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-graphite">{e.d}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* MANIFESTE LIME */}
      <section className="relative overflow-hidden bg-lime text-encre">
        <span className="filigrane absolute -top-10 end-0 text-[30vw]" aria-hidden="true">{FONDS.token.symbole}</span>
        <div className="conteneur relative py-28 sm:py-40">
          <TitreGeant lignes={couperEnDeux(a.ctaFinalTitre)} className="text-[13vw] sm:text-[10vw] lg:text-[140px]" />
          <div className="mt-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-xl text-base leading-relaxed sm:text-lg">{a.ctaFinalTexte}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/${locale}/candidature`} className="bouton-primaire">{t.commun.candidater}</Link>
              <Link href={`/${locale}/adhesion`} className="bouton-contour">{t.nav.adhesion}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
