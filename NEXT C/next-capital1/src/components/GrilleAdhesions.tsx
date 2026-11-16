import { ADHESIONS, STATUTS, formatEuros } from "@/config/fonds";
import type { Dict } from "@/i18n";
import { Reveal } from "./Reveal";

export function GrilleAdhesions({ t, intl, selection, nomChamp }: { t: Dict; intl: string; selection?: string; nomChamp?: string }) {
  const a = t.adhesion;
  return (
    <div className="grid border-t border-s border-encre/15 md:grid-cols-3 lg:grid-cols-5">
      {ADHESIONS.map((n, i) => {
        const actif = selection === n.id;
        const contenu = (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-pierre">0{i + 1} — {a.niveaux[n.id]}</p>
            <p className="mt-4 font-display text-3xl font-semibold tracking-tight">{formatEuros(n.prixAnnuelCents, intl)}<span className="ms-1 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-pierre"> {a.parAn}</span></p>
            <dl className="mt-6 space-y-3 border-t border-encre/10 pt-5 text-xs">
              <div><dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-pierre">{a.plafondAn}</dt><dd className="mt-0.5 font-medium">{n.plafondAnnuelCents ? formatEuros(n.plafondAnnuelCents, intl) : a.illimite}</dd></div>
              <div><dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-pierre">{a.plafondOp}</dt><dd className="mt-0.5 font-medium">{n.plafondParOperationCents ? formatEuros(n.plafondParOperationCents, intl) : a.illimite}</dd></div>
              <div><dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-pierre">{a.frais}</dt><dd className="mt-0.5 font-medium">{n.fraisStructurationPct} %</dd></div>
              <div><dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-pierre">{a.bons}</dt><dd className="mt-0.5 font-medium">{n.bonsPriorite}</dd></div>
            </dl>
            <ul className="mt-5 space-y-1.5 border-t border-encre/10 pt-4 text-xs">
              {[[a.chargeAffaire, n.chargeAffaire], [a.vip, n.evenementsVip], [a.diners, n.dinersPrives]].map(([l, ok]) => (
                <li key={String(l)} className={`flex items-center gap-2 ${ok ? "" : "text-pierre/60 line-through"}`}><span className={`h-px w-3 ${ok ? "bg-signal" : "bg-pierre/40"}`} />{l as string}</li>
              ))}
            </ul>
          </>
        );
        return (
          <Reveal key={n.id} delai={i * 0.05} className="border-b border-e border-encre/15">
            {nomChamp ? (
              <label className={`block h-full cursor-pointer p-6 transition ${actif ? "bg-encre text-os" : "hover:bg-os-2"}`}>
                <input type="radio" name={nomChamp} value={n.id} defaultChecked={actif} className="sr-only" />
                {contenu}
              </label>
            ) : (
              <div className={`h-full p-6 ${n.id === "gold" ? "bg-encre text-os [&_.text-pierre]:text-os/50 [&_.border-encre\\/10]:border-os/15" : ""}`}>{contenu}</div>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}

export function GrilleStatuts({ t, intl }: { t: Dict; intl: string }) {
  return (
    <div className="grid border-t border-s border-os/15 md:grid-cols-3 lg:grid-cols-5">
      {STATUTS.map((s, i) => (
        <Reveal key={s.id} delai={i * 0.05} className="relative overflow-hidden border-b border-e border-os/15 p-6">
          <span className="filigrane absolute -top-3 end-1 text-[96px]" aria-hidden="true">0{s.ordre}</span>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-os/45">{t.adhesion.aPartirDe} {formatEuros(s.seuilCents, intl)}</p>
          <h3 className="mt-4 text-3xl uppercase text-os">{t.adhesion.statuts[s.id].nom}</h3>
          <p className="mt-4 text-sm leading-relaxed text-os/60">{t.adhesion.statuts[s.id].d}</p>
        </Reveal>
      ))}
    </div>
  );
}
