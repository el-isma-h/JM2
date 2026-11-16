import { pageLocale } from "@/lib/locale";
import { PageEnTete, Avertissement } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import { TitreGeant } from "@/components/TitreGeant";
import { EtudeMarche, Sceau } from "@/components/EtudeMarche";
import { THESES } from "@/config/fonds";
import { COULEUR_THESE } from "@/config/couleurs";
import { BANQUES, etudePour } from "@/config/marches";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "marches", "/marches");
}

export default async function Marches({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  return (
    <>
      <PageEnTete sur={t.nav.marches} titre={t.marches.titre} texte={t.marches.intro} numero="04" />
      <section className="border-b border-encre/15 bg-os">
        <div className="conteneur flex flex-wrap items-center gap-3 py-5">
          <span className="etiquette">{t.marches.sources}</span>
          {BANQUES.map((b) => <Sceau key={b} banque={b} />)}
          <span className="ms-auto font-mono text-[10px] uppercase tracking-[0.16em] text-pierre">{t.marches.maj} · 16/10/2026</span>
        </div>
      </section>
      <nav className="sticky top-14 z-30 border-b border-encre/15 bg-os/90 backdrop-blur" aria-label={t.nav.theses}>
        <div className="conteneur flex gap-6 overflow-x-auto py-3">
          {THESES.map((th, i) => <a key={th.id} href={`#${th.id}`} className="lien-nav flex items-center gap-2 whitespace-nowrap"><span className="h-2 w-2" style={{ background: COULEUR_THESE[th.id] }} />0{i + 1} {t.theses[th.id].nom}</a>)}
        </div>
      </nav>
      {THESES.map((th, i) => {
        const sombre = i % 2 === 1;
        const c = COULEUR_THESE[th.id];
        return (
          <section key={th.id} id={th.id} className={`relative scroll-mt-28 overflow-hidden border-t ${sombre ? "sombre border-os/10 bg-encre text-os" : "border-encre/15 bg-os text-encre"}`}>
            <span className="filigrane absolute -top-6 end-2 text-[30vw] sm:text-[16vw]" aria-hidden="true">0{i + 1}</span>
            <div className="conteneur relative py-20 sm:py-24">
              <Reveal><p className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-50">0{i + 1} / 04 — {t.theses[th.id].accroche}</p></Reveal>
              <div className="mt-6"><TitreGeant lignes={[t.theses[th.id].nom]} className="text-[10vw] lg:text-[96px]" couleur={c} /></div>
              <div className="mt-12"><EtudeMarche d={etudePour(th.id)} t={t} locale={locale} intl={intl} couleur={c} sombre={sombre} /></div>
            </div>
          </section>
        );
      })}
      <div className="conteneur border-t border-encre/15 pb-16"><Avertissement texte={t.marches.avertissement} /><Avertissement texte={t.accueil.disclaimerPerf} /></div>
    </>
  );
}
