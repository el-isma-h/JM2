import { pageLocale } from "@/lib/locale";
import { PageEnTete, Avertissement } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import { TitreGeant } from "@/components/TitreGeant";
import { THESES } from "@/config/fonds";
import { COULEUR_THESE } from "@/config/couleurs";
import { EtudeMarche } from "@/components/EtudeMarche";
import { etudePour } from "@/config/marches";
import type { Metadata } from "next";
import { metaSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await pageLocale(params);
  return metaSeo(locale, "theses", "/theses");
}

export default async function Theses({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  return (
    <>
      <PageEnTete sur={t.nav.theses} titre={t.theses.titre} texte={t.theses.intro} numero="04" />
      {THESES.map((th, i) => {
        const d = t.theses[th.id];
        const c = COULEUR_THESE[th.id];
        const sombre = i % 2 === 0;
        return (
          <section key={th.id} id={th.id} className={`relative overflow-hidden border-t ${sombre ? "sombre border-os/10 bg-encre text-os" : "border-encre/15 bg-os text-encre"}`}>
            <span className="filigrane absolute -top-6 end-2 text-[36vw] sm:text-[22vw]" aria-hidden="true">0{i + 1}</span>
            <div className="conteneur relative grid min-h-[80svh] gap-10 py-20 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-50">0{i + 1} / 0{THESES.length} — {d.accroche}</p>
                <div className="mt-6"><TitreGeant lignes={[d.nom]} className="text-[10vw] lg:text-[120px]" /></div>
                <p className="mt-8 font-serif text-2xl italic" style={{ color: c }}>{d.points.join(" · ")}</p>
                <div className="mt-10 h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${c} ${th.allocationCiblePct}%, ${sombre ? "rgba(243,240,232,.12)" : "rgba(10,11,13,.12)"} ${th.allocationCiblePct}%)` }} />
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">{t.theses.allocation} · {th.allocationCiblePct} %</p>
              </div>
              <Reveal>
                <p className={`leading-relaxed ${sombre ? "text-os/70" : "text-graphite"}`}>{d.d}</p>
                <ul className="mt-6 space-y-2">
                  {d.points.map((p) => <li key={p} className="flex items-start gap-3 text-sm"><span className="mt-2 h-px w-4 shrink-0" style={{ background: c }} />{p}</li>)}
                </ul>
                <dl className={`mt-8 grid grid-cols-3 gap-3 border-t pt-5 font-mono text-[10px] uppercase tracking-[0.18em] ${sombre ? "border-os/15" : "border-encre/15"}`}>
                  <div><dt className="opacity-50">{t.theses.stades}</dt><dd className="mt-1">{th.stades}</dd></div>
                  <div><dt className="opacity-50">{t.theses.horizon}</dt><dd className="mt-1">{th.horizonAnnees} {t.theses.ans}</dd></div>
                  <div><dt className="opacity-50">{t.theses.perf}</dt><dd className="mt-1">{th.performanceCible}</dd></div>
                </dl>
              </Reveal>
            </div>
            <div className="conteneur relative pb-20">
              <div className={`border-t pt-12 ${sombre ? "border-os/15" : "border-encre/15"}`}>
                <p className="etiquette">{t.marches.titre}</p>
                <div className="mt-6"><EtudeMarche d={etudePour(th.id)} t={t} locale={locale} intl={intl} couleur={c} sombre={sombre} compact /></div>
              </div>
            </div>
          </section>
        );
      })}
      <div className="conteneur border-t border-encre/15 pb-16"><Avertissement texte={t.accueil.disclaimerPerf} /></div>
    </>
  );
}
