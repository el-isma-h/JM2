import Link from "next/link";
import { pageLocale } from "@/lib/locale";
import { Reveal } from "@/components/Reveal";
import { FondAmbiant } from "@/components/FondAmbiant";
import { Cercles } from "@/components/Cercles";
import { ThesesEpinglees, type PanneauThese } from "@/components/ThesesEpinglees";
import { BandeauDefilant, type ElementDefilant } from "@/components/BandeauDefilant";
import { Section, Avertissement } from "@/components/Sections";
import { FiletMarque } from "@/components/Logo";
import { CANAUX, FONDS, THESES, formatEuros } from "@/config/fonds";
import { COULEURS, COULEUR_THESE } from "@/config/couleurs";
import type { Metadata } from "next";
import { metaSeo, urlSite } from "@/lib/seo";
import { SEO } from "@/i18n/seo";
import { JsonLd } from "@/components/JsonLd";

/* V4 : écrin encre + taupe (sobre, uni) contre blocs très colorés (bandeaux, chiffres, thèses, canaux, appel final). */
const PALETTE = [COULEURS.signal, COULEUR_THESE.ia, COULEUR_THESE.quantique, COULEUR_THESE.agroalimentaire, COULEUR_THESE.sport, COULEURS.lime];
const estClair = (c: string) => c !== COULEUR_THESE.quantique; // texte encre partout sauf sur le violet

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "accueil", "");
}

export default async function Accueil({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const a = t.accueil;
  const panneaux: PanneauThese[] = THESES.map((th, i) => {
    const d = t.theses[th.id];
    const c = COULEUR_THESE[th.id];
    return {
      id: th.id, couleur: c, fond: c, clair: estClair(c), numero: `0${i + 1} / 0${THESES.length}`, accroche: d.accroche, nom: d.nom, texte: d.d, points: d.points,
      stats: [[t.theses.allocation, `${th.allocationCiblePct} %`], [t.theses.stades, th.stades], [t.theses.horizon, `${th.horizonAnnees} ${t.theses.ans}`], [t.theses.perf, th.performanceCible]],
      href: `/${locale}/theses#${th.id}`,
    };
  });

  // Bandeau 1 : thèses + ticket + token + siège. Bandeau 2 : canaux + chiffres clés.
  const bandeau1: ElementDefilant[] = [
    ...THESES.map((th) => ({ texte: `${t.theses[th.id].nom} · ${th.allocationCiblePct} %`, fond: COULEUR_THESE[th.id], clair: !estClair(COULEUR_THESE[th.id]) })),
    { texte: `${a.des} ${formatEuros(FONDS.ticketMinimumCents, intl)} ${a.parInvestissement}`, fond: COULEURS.signal },
    { texte: `${FONDS.token.symbole} · 1 ${FONDS.token.symbole} = ${formatEuros(FONDS.token.prixEmissionCents, intl)}`, fond: COULEURS.lime },
    { texte: `${FONDS.siege} · Miami`, fond: COULEURS.taupe },
  ];
  const bandeau2: ElementDefilant[] = [
    ...CANAUX.map((c, i) => ({ texte: a.canaux[c].t, fond: PALETTE[i % PALETTE.length], clair: !estClair(PALETTE[i % PALETTE.length]) })),
    ...a.chiffres.map((c, i) => ({ texte: `${c.v} ${c.l}`, fond: PALETTE[(i + 2) % PALETTE.length], clair: !estClair(PALETTE[(i + 2) % PALETTE.length]) })),
  ];

  const base = urlSite();
  // Données structurées limitées à ce qui est établi (aucune adresse, aucun agrément, aucun chiffre).
  const donneesStructurees = [
    { "@context": "https://schema.org", "@type": "Organization", "@id": `${base}/#organisation`, name: "NEXT Capital", url: `${base}/${locale}`, description: SEO[locale].accueil.d },
    { "@context": "https://schema.org", "@type": "WebSite", "@id": `${base}/#site`, name: "NEXT Capital", url: `${base}/${locale}`, inLanguage: locale, publisher: { "@id": `${base}/#organisation` } },
  ];

  return (
    <>
      <JsonLd data={donneesStructurees} />
      {/* ÉCRAN D'ENTRÉE : encre + taupe, fond ambiant taupe, une phrase, un bouton */}
      <section className="sombre relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden bg-encre text-os lg:mt-0">
        <FondAmbiant couleurs={[COULEURS.taupe, "#8A5B50", COULEURS.taupe, "#3A2520"]} intensite={0.5} />
        <div className="absolute inset-0 bg-gradient-to-b from-encre/30 via-transparent to-encre/70" aria-hidden="true" />
        <div className="conteneur relative flex flex-1 flex-col items-center justify-center pt-16 text-center lg:pt-0">
          <Reveal><p className="etiquette justify-center !text-taupe/80">{a.sur} — {FONDS.siege}</p></Reveal>
          <Reveal delai={0.1}>
            <h1 className="mt-8 font-display text-[11vw] font-light uppercase leading-[0.95] tracking-[0.06em] sm:text-7xl lg:text-[96px]">
              {a.titre1}<br /><span className="text-taupe">{a.titre2}</span>
            </h1>
          </Reveal>
          <Reveal delai={0.2}><p className="mx-auto mt-10 max-w-2xl font-serif text-xl leading-relaxed text-os/75 sm:text-2xl">{a.accroche}</p></Reveal>
        </div>
        <Reveal delai={0.35} className="conteneur relative flex flex-col items-center gap-8 pb-12">
          <a href="#decouvrir" className="bouton-taupe !px-8 backdrop-blur">{t.commun.decouvrir}</a>
          <div className="flex w-full flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-taupe/70">
            <span>{a.des} {formatEuros(FONDS.ticketMinimumCents, intl)} {a.parInvestissement}</span>
            <span>{FONDS.token.symbole} · {FONDS.token.standardPrevu}</span>
          </div>
        </Reveal>
      </section>

      {/* BANDEAU DÉFILANT 1 : blocs de couleur pleine */}
      <BandeauDefilant elements={bandeau1} duree={44} />

      {/* INTRODUCTION centrée, serif, cercles filaires taupe sur encre */}
      <section id="decouvrir" className="sombre relative overflow-hidden border-b border-os/10 bg-encre text-os">
        <Cercles className="pointer-events-none absolute -top-[30%] left-1/2 h-[160%] w-auto -translate-x-1/2" opacite={0.35} couleur={COULEURS.taupe} />
        <div className="conteneur relative py-28 text-center sm:py-40">
          <Reveal><p className="etiquette justify-center !text-taupe/80">{a.piliersSur}</p></Reveal>
          <Reveal delai={0.08}><h2 className="mx-auto mt-8 max-w-4xl font-display text-4xl font-light uppercase leading-[1.05] tracking-[0.06em] sm:text-6xl">{a.piliersTitre}</h2></Reveal>
          <Reveal delai={0.16}><p className="mx-auto mt-10 max-w-2xl font-serif text-xl leading-relaxed text-taupe sm:text-2xl">{t.fonds.intro}</p></Reveal>
          <div className="mx-auto mt-20 grid max-w-6xl gap-x-10 gap-y-12 text-start sm:grid-cols-2 lg:grid-cols-4">
            {a.piliers.map((p, i) => (
              <Reveal key={p.t} delai={i * 0.08} className="border-t border-taupe/30 pt-6">
                <span className="font-mono text-[10px] tracking-[0.24em] text-taupe">0{i + 1}</span>
                <h3 className="mt-4 font-display text-lg font-medium uppercase tracking-[0.06em]">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-os/60">{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CHIFFRES : quatre aplats de couleur */}
      <section className="grid grid-cols-2 md:grid-cols-4">
        {a.chiffres.map((c, i) => {
          const fond = PALETTE[(i + 1) % PALETTE.length];
          const clair = estClair(fond);
          return (
            <Reveal key={c.l} delai={i * 0.06} className={`px-6 py-12 sm:px-8 ${clair ? "text-encre" : "text-os"}`} style={{ background: fond }}>
              <p className="font-display text-4xl font-light tracking-[0.02em] sm:text-5xl">{c.v}</p>
              <p className={`mt-3 font-mono text-[10px] uppercase tracking-[0.2em] ${clair ? "text-encre/60" : "text-os/60"}`}>{c.l}</p>
            </Reveal>
          );
        })}
      </section>

      {/* THÈSES ÉPINGLÉES : en-tête encre, panneaux en aplats pleins */}
      <section className="sombre bg-encre text-os">
        <div className="conteneur flex flex-wrap items-end justify-between gap-6 py-20">
          <Reveal><p className="etiquette !text-taupe/80">{a.thesesSur}</p><h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.06em] sm:text-6xl">{a.thesesTitre}</h2></Reveal>
          <Reveal className="flex flex-col items-end gap-4"><FiletMarque /><Link href={`/${locale}/marches`} className="lien-nav hover:!text-taupe">{t.marches.titre} ↗</Link></Reveal>
        </div>
        <ThesesEpinglees panneaux={panneaux} libelles={{ allocation: t.theses.allocation, decouvrir: t.commun.decouvrir }} />
        <div className="conteneur py-10"><Avertissement texte={a.disclaimerPerf} /></div>
      </section>

      {/* CANAUX : grille d'aplats colorés sur encre */}
      <Section sombre>
        <Reveal className="text-center"><p className="etiquette justify-center !text-taupe/80">{a.canauxSur}</p><h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.06em] sm:text-6xl">{a.canauxTitre}</h2></Reveal>
        <div className="mt-16 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
          {CANAUX.map((c, i) => {
            const fond = PALETTE[i % PALETTE.length];
            const clair = estClair(fond);
            return (
              <Reveal key={c} delai={i * 0.05} className={`group relative flex min-h-[280px] flex-col justify-between overflow-hidden p-7 transition-colors duration-500 hover:bg-encre ${clair ? "text-encre" : "text-os"}`} style={{ background: fond }}>
                <span className="font-mono text-[10px] tracking-[0.24em] opacity-70 transition-colors duration-500 group-hover:text-os">0{i + 1}</span>
                <div className="transition-colors duration-500 group-hover:text-os">
                  <h3 className="font-display text-xl font-medium uppercase tracking-[0.06em] transition-colors duration-500" style={{ ["--c" as string]: fond }}>
                    <span className="group-hover:text-[var(--c)]">{a.canaux[c].t}</span>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed opacity-80 transition-opacity duration-500 group-hover:opacity-70">{a.canaux[c].d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* PARCOURS : encre + taupe */}
      <Section sombre className="border-t border-os/10">
        <Reveal className="text-center"><p className="etiquette justify-center !text-taupe/80">{a.parcoursSur}</p><h2 className="mt-5 font-display text-4xl font-light uppercase tracking-[0.06em] sm:text-6xl">{a.parcoursTitre}</h2></Reveal>
        <ol className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {t.parcours.etapes.map((e, i) => (
            <Reveal key={e.t} delai={i * 0.06} className="border-t border-taupe/30 pt-5">
              <span className="font-mono text-[10px] tracking-[0.24em] text-taupe">0{i + 1} / 06</span>
              <h3 className="mt-4 font-display text-lg font-medium uppercase tracking-[0.06em]">{e.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-os/60">{e.d}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* BANDEAU DÉFILANT 2 : sens inverse */}
      <BandeauDefilant elements={bandeau2} duree={56} inverse />

      {/* APPEL FINAL : carte arrondie en dégradé des couleurs de thèses, fond ambiant par-dessus */}
      <section className="bg-encre px-4 py-6 sm:px-6">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] text-encre" style={{ background: `linear-gradient(135deg, ${COULEURS.signal} 0%, ${COULEUR_THESE.ia} 30%, ${COULEUR_THESE.agroalimentaire} 55%, ${COULEURS.lime} 78%, ${COULEUR_THESE.sport} 100%)` }}>
          <FondAmbiant couleurs={[COULEUR_THESE.ia, COULEURS.lime, COULEUR_THESE.sport, COULEURS.signal, COULEUR_THESE.agroalimentaire]} intensite={0.9} fond="transparent" />
          <div className="relative px-6 py-24 sm:px-16 sm:py-32">
            <Reveal className="max-w-2xl">
              <p className="etiquette !text-encre/70">{t.commun.candidater}</p>
              <h2 className="mt-6 font-display text-4xl font-light uppercase leading-[1.05] tracking-[0.06em] sm:text-6xl">{a.ctaFinalTitre}</h2>
              <p className="mt-6 font-serif text-xl text-encre/80 sm:text-2xl">{a.ctaFinalTexte}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={`/${locale}/candidature`} className="bouton-primaire !px-8 hover:!border-os hover:!bg-os hover:!text-encre">{t.commun.candidater}</Link>
                <Link href={`/${locale}/adhesion`} className="bouton-contour !border-encre/40 !text-encre hover:!bg-encre hover:!text-os">{t.nav.adhesion}</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
