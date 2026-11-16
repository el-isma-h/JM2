import Link from "next/link";
import { pageLocale } from "@/lib/locale";
import { Reveal } from "@/components/Reveal";
import { FondAmbiant } from "@/components/FondAmbiant";
import { Cercles } from "@/components/Cercles";
import { ThesesEpinglees, type PanneauThese } from "@/components/ThesesEpinglees";
import { Section, Avertissement } from "@/components/Sections";
import { FiletMarque } from "@/components/Logo";
import { CANAUX, FONDS, THESES, formatEuros } from "@/config/fonds";
import { COULEUR_THESE, FOND_THESE } from "@/config/couleurs";
import type { Metadata } from "next";
import { metaSeo, urlSite } from "@/lib/seo";
import { SEO } from "@/i18n/seo";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "accueil", "");
}

export default async function Accueil({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const a = t.accueil;
  const panneaux: PanneauThese[] = THESES.map((th, i) => {
    const d = t.theses[th.id];
    return {
      id: th.id, couleur: COULEUR_THESE[th.id], fond: FOND_THESE[th.id], numero: `0${i + 1} / 0${THESES.length}`, accroche: d.accroche, nom: d.nom, texte: d.d, points: d.points,
      stats: [[t.theses.allocation, `${th.allocationCiblePct} %`], [t.theses.stades, th.stades], [t.theses.horizon, `${th.horizonAnnees} ${t.theses.ans}`], [t.theses.perf, th.performanceCible]],
      href: `/${locale}/theses#${th.id}`,
    };
  });

  const base = urlSite();
  // Données structurées limitées à ce qui est établi (aucune adresse, aucun agrément, aucun chiffre).
  const donneesStructurees = [
    { "@context": "https://schema.org", "@type": "Organization", "@id": `${base}/#organisation`, name: "NEXT Capital", url: `${base}/${locale}`, description: SEO[locale].accueil.d },
    { "@context": "https://schema.org", "@type": "WebSite", "@id": `${base}/#site`, name: "NEXT Capital", url: `${base}/${locale}`, inLanguage: locale, publisher: { "@id": `${base}/#organisation` } },
  ];

  return (
    <>
      <JsonLd data={donneesStructurees} />
      {/* ÉCRAN D'ENTRÉE : fond ambiant, une phrase, un bouton */}
      <section className="sombre relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden bg-encre text-os">
        <FondAmbiant />
        <div className="absolute inset-0 bg-gradient-to-b from-encre/30 via-transparent to-encre/70" aria-hidden="true" />
        <div className="conteneur relative flex flex-1 flex-col items-center justify-center pt-16 text-center">
          <Reveal><p className="etiquette justify-center !text-os/60">{a.sur} — {FONDS.siege}</p></Reveal>
          <Reveal delai={0.1}>
            <h1 className="mt-8 font-display text-[11vw] font-light uppercase leading-[0.95] tracking-[0.06em] sm:text-7xl lg:text-[96px]">
              {a.titre1}<br /><span className="text-signal">{a.titre2}</span>
            </h1>
          </Reveal>
          <Reveal delai={0.2}><p className="mx-auto mt-10 max-w-2xl font-serif text-xl leading-relaxed text-os/75 sm:text-2xl">{a.accroche}</p></Reveal>
        </div>
        <Reveal delai={0.35} className="conteneur relative flex flex-col items-center gap-8 pb-12">
          <a href="#decouvrir" className="bouton-contour !border-os/40 !px-8 !text-os backdrop-blur hover:!bg-os hover:!text-encre">{t.commun.decouvrir}</a>
          <div className="flex w-full flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-os/45">
            <span>{a.des} {formatEuros(FONDS.ticketMinimumCents, intl)} {a.parInvestissement}</span>
            <span>{FONDS.token.symbole} · {FONDS.token.standardPrevu}</span>
          </div>
        </Reveal>
      </section>

      {/* INTRODUCTION centrée, serif, cercles filaires */}
      <section id="decouvrir" className="relative overflow-hidden border-b border-encre/10 bg-os text-encre">
        <Cercles className="pointer-events-none absolute -top-[30%] left-1/2 h-[160%] w-auto -translate-x-1/2" opacite={0.12} />
        <div className="conteneur relative py-28 text-center sm:py-40">
          <Reveal><p className="etiquette justify-center">{a.piliersSur}</p></Reveal>
          <Reveal delai={0.08}><h2 className="mx-auto mt-8 max-w-4xl font-display text-4xl font-light uppercase leading-[1.05] tracking-[0.06em] sm:text-6xl">{a.piliersTitre}</h2></Reveal>
          <Reveal delai={0.16}><p className="mx-auto mt-10 max-w-2xl font-serif text-xl leading-relaxed text-graphite sm:text-2xl">{t.fonds.intro}</p></Reveal>
          <div className="mx-auto mt-20 grid max-w-6xl gap-x-10 gap-y-12 text-start sm:grid-cols-2 lg:grid-cols-4">
            {a.piliers.map((p, i) => (
              <Reveal key={p.t} delai={i * 0.08} className="border-t border-encre/15 pt-6">
                <span className="font-mono text-[10px] tracking-[0.24em] text-pierre">0{i + 1}</span>
                <h3 className="mt-4 font-display text-lg font-medium uppercase tracking-[0.06em]">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite">{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CHIFFRES */}
      <section className="sombre border-b border-os/10 bg-encre text-os">
        <div className="conteneur grid grid-cols-2 md:grid-cols-4">
          {a.chiffres.map((c, i) => (
            <Reveal key={c.l} delai={i * 0.06} className={`py-12 pe-6 ${i > 0 ? "md:border-s md:border-os/10 md:ps-8" : ""}`}>
              <p className="font-display text-4xl font-light tracking-[0.02em] text-signal sm:text-5xl">{c.v}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-os/45">{c.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* THÈSES ÉPINGLÉES */}
      <section className="sombre bg-encre text-os">
        <div className="conteneur flex flex-wrap items-end justify-between gap-6 py-20">
          <Reveal><p className="etiquette">{a.thesesSur}</p><h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.06em] sm:text-6xl">{a.thesesTitre}</h2></Reveal>
          <Reveal className="flex flex-col items-end gap-4"><FiletMarque /><Link href={`/${locale}/marches`} className="lien-nav">{t.marches.titre} ↗</Link></Reveal>
        </div>
        <ThesesEpinglees panneaux={panneaux} libelles={{ allocation: t.theses.allocation, decouvrir: t.commun.decouvrir }} />
        <div className="conteneur py-10"><Avertissement texte={a.disclaimerPerf} /></div>
      </section>

      {/* CANAUX */}
      <Section>
        <Reveal className="text-center"><p className="etiquette justify-center">{a.canauxSur}</p><h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.06em] sm:text-6xl">{a.canauxTitre}</h2></Reveal>
        <div className="mt-16 grid border-t border-s border-encre/12 sm:grid-cols-2 lg:grid-cols-3">
          {CANAUX.map((c, i) => (
            <Reveal key={c} delai={i * 0.05} className="group border-b border-e border-encre/12 p-8 transition-colors duration-500 hover:bg-encre hover:text-os">
              <span className="font-mono text-[10px] tracking-[0.24em] text-pierre">0{i + 1}</span>
              <h3 className="mt-6 font-display text-xl font-medium uppercase tracking-[0.06em]">{a.canaux[c].t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-graphite transition-colors duration-500 group-hover:text-os/60">{a.canaux[c].d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* PARCOURS */}
      <Section clair2>
        <Reveal className="text-center"><p className="etiquette justify-center">{a.parcoursSur}</p><h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.06em] sm:text-6xl">{a.parcoursTitre}</h2></Reveal>
        <ol className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {t.parcours.etapes.map((e, i) => (
            <Reveal key={e.t} delai={i * 0.06} className="border-t border-encre/15 pt-5">
              <span className="font-mono text-[10px] tracking-[0.24em] text-pierre">0{i + 1} / 06</span>
              <h3 className="mt-4 font-display text-lg font-medium uppercase tracking-[0.06em]">{e.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-graphite">{e.d}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* APPEL FINAL : carte arrondie à fond ambiant */}
      <section className="bg-os-2 px-4 py-6 sm:px-6">
        <div className="sombre relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] bg-encre text-os">
          <FondAmbiant couleurs={["#19E07A", "#00D1FF", "#7A3BFF"]} intensite={0.5} />
          <div className="relative px-6 py-24 sm:px-16 sm:py-32">
            <Reveal className="max-w-2xl">
              <p className="etiquette !text-os/60">{t.commun.candidater}</p>
              <h2 className="mt-6 font-display text-4xl font-light uppercase leading-[1.05] tracking-[0.06em] sm:text-6xl">{a.ctaFinalTitre}</h2>
              <p className="mt-6 font-serif text-xl text-os/80 sm:text-2xl">{a.ctaFinalTexte}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={`/${locale}/candidature`} className="bouton-clair !px-8">{t.commun.candidater}</Link>
                <Link href={`/${locale}/adhesion`} className="bouton-contour !border-os/40 !text-os hover:!bg-os hover:!text-encre">{t.nav.adhesion}</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
