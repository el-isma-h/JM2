import Link from "next/link";
import type { Deal } from "@/lib/types";
import type { Dict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { formatEuros, type TheseId } from "@/config/fonds";
import { COULEUR_THESE } from "@/config/couleurs";

export function DealCarte({ d, t, locale, intl }: { d: Deal; t: Dict; locale: Locale; intl: string }) {
  const pct = Math.min(100, Math.round((d.alloue_cents / d.objectif_cents) * 100));
  const statutClasse = d.statut === "ouvert" ? "pastille-vert" : d.statut === "a_venir" ? "pastille-azur" : "pastille-gris";
  const resume = locale === "fr" ? d.resume_fr : d.resume_en;
  const c = COULEUR_THESE[d.these as TheseId] ?? "#19E07A";
  return (
    <Link href={`/${locale}/deals/${d.slug}`} className="group flex flex-col border-b border-e border-encre/15 p-7 transition-colors hover:bg-encre hover:text-os">
      <div className="flex items-center justify-between gap-3">
        <span className={statutClasse}>{t.deals[d.statut]}</span>
        {d.exemple === 1 && <span className="pastille-or">{t.commun.exemple}</span>}
      </div>
      <h3 className="mt-6 text-3xl uppercase">{d.nom}</h3>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: c }}>{t.theses[d.these as TheseId].nom} · {d.stade} · {d.pays}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-graphite group-hover:text-os/60">{resume}</p>
      <div className="mt-6">
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-pierre"><span>{t.deals.alloue} {formatEuros(d.alloue_cents, intl)}</span><span>{pct}%</span></div>
        <div className="mt-2 h-[3px] bg-current/10"><div className="h-full" style={{ width: `${pct}%`, background: c }} /></div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-pierre">{t.deals.objectif} {formatEuros(d.objectif_cents, intl)}</p>
      </div>
    </Link>
  );
}
