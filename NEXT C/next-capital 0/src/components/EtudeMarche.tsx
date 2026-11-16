import Link from "next/link";
import type { EtudeMarche as Donnees, Banque } from "@/config/marches";
import type { Dict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { Reveal } from "./Reveal";

const LOGOS: Record<Banque, string> = { BlackRock: "BLK", "J.P. Morgan": "JPM", "Morgan Stanley": "MS", "Goldman Sachs": "GS" };

function txt(b: { fr: string; en: string }, locale: Locale) { return locale === "fr" ? b.fr : b.en; }

function formatDate(d: string, intl: string) {
  const [a, m, j] = d.split("-");
  if (!m) return a;
  const date = new Date(Number(a), Number(m) - 1, Number(j ?? 1));
  return new Intl.DateTimeFormat(intl, j ? { year: "numeric", month: "short", day: "numeric" } : { year: "numeric", month: "short" }).format(date);
}

export function Sceau({ banque, sombre = false }: { banque: Banque; sombre?: boolean }) {
  return <span className={`inline-flex items-center gap-2 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] ${sombre ? "border-os/25 text-os/80" : "border-encre/25 text-encre/80"}`}><span className="font-semibold">{LOGOS[banque]}</span>{banque}</span>;
}

/** Bloc complet d'une étude de marché : synthèse, chiffres clés sourcés, publications, lecture NEXT. */
export function EtudeMarche({ d, t, locale, intl, couleur, sombre = false, compact = false }: { d: Donnees; t: Dict; locale: Locale; intl: string; couleur: string; sombre?: boolean; compact?: boolean }) {
  const m = t.marches;
  const txtSec = sombre ? "text-os/65" : "text-graphite";
  const bord = sombre ? "border-os/15" : "border-encre/15";
  return (
    <div>
      <Reveal><p className={`max-w-3xl leading-relaxed ${sombre ? "text-os/80" : "text-encre/85"}`}>{txt(d.synthese, locale)}</p></Reveal>

      <p className="etiquette mt-12">{m.chiffresCles}</p>
      <div className={`mt-5 grid border-t border-s ${bord} sm:grid-cols-2 lg:grid-cols-3`}>
        {d.chiffres.map((c, i) => (
          <Reveal key={i} delai={i * 0.04} className={`border-b border-e ${bord} p-5`}>
            <p className="font-display text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: couleur }}>{c.valeur}</p>
            <p className={`mt-3 text-sm leading-snug ${txtSec}`}>{txt(c.libelle, locale)}</p>
            <a href={c.url} target="_blank" rel="noreferrer noopener" className="mt-4 flex flex-wrap items-center gap-2 hover:underline underline-offset-4"><Sceau banque={c.banque} sombre={sombre} /><span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">{formatDate(c.date, intl)}</span></a>
          </Reveal>
        ))}
      </div>

      {!compact && (
        <>
          <p className="etiquette mt-12">{m.publications}</p>
          <ol className={`mt-5 border-t ${bord}`}>
            {d.etudes.map((e, i) => (
              <Reveal key={i} delai={i * 0.03}>
                <li className={`grid gap-3 border-b ${bord} py-5 md:grid-cols-[180px_1fr_auto] md:items-start`}>
                  <div className="flex flex-col items-start gap-2"><Sceau banque={e.banque} sombre={sombre} /><span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">{m.publie} {formatDate(e.date, intl)}</span></div>
                  <div>
                    <p className="font-medium">{e.titre}</p>
                    <ul className={`mt-2 space-y-1.5 text-sm leading-relaxed ${txtSec}`}>{e.points.map((p, k) => <li key={k} className="flex gap-3"><span className="mt-2.5 h-px w-3 shrink-0" style={{ background: couleur }} />{txt(p, locale)}</li>)}</ul>
                  </div>
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span className={e.chiffree ? "pastille-vert" : "pastille-gris"}>{e.chiffree ? m.chiffree : m.qualitatif}</span>
                    <a href={e.url} target="_blank" rel="noreferrer noopener" className="lien-nav whitespace-nowrap">{m.lire} ↗</a>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </>
      )}

      <Reveal className={`mt-10 border-s-2 ps-5`} >
        <div style={{ borderColor: couleur }} className="-ms-5 border-s-2 ps-5">
          <p className="etiquette">{m.lecture}</p>
          <p className={`mt-3 max-w-3xl leading-relaxed ${sombre ? "text-os/80" : "text-encre/85"}`}>{txt(d.lecture, locale)}</p>
        </div>
      </Reveal>
      {compact && <Link href={`/${locale}/marches#${d.these}`} className={`${sombre ? "bouton-contour" : "bouton-contour"} mt-8`}>{m.voirEtude}</Link>}
    </div>
  );
}
