import { pageLocale } from "@/lib/locale";
import { exigerInvestisseurValide } from "@/lib/garde";
import { capitalInvesti } from "@/lib/wallet";
import { STATUTS, adhesion, formatEuros, prochainStatut, statutPourCapital } from "@/config/fonds";
import { Kpi, Titre } from "@/components/Kpi";

export default async function Statut({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const u = await exigerInvestisseurValide(locale);
  const c = t.compte;
  const investi = capitalInvesti(u.id);
  const actuel = statutPourCapital(investi);
  const prochain = prochainStatut(investi);
  const a = u.adhesion_niveau ? adhesion(u.adhesion_niveau) : null;
  const avantages = a ? [[t.adhesion.chargeAffaire, a.chargeAffaire], [t.adhesion.vip, a.evenementsVip], [t.adhesion.diners, a.dinersPrives], [`${t.adhesion.bons} : ${u.bons_priorite_restants}`, true]] as [string, boolean][] : [];
  return (
    <>
      <Titre>{c.statut}</Titre>
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label={c.statutActuel} valeur={actuel ? t.adhesion.statuts[actuel.id].nom : "—"} accent />
        <Kpi label={c.capitalInvesti} valeur={formatEuros(investi, intl)} />
        <Kpi label={c.prochain} valeur={prochain ? t.adhesion.statuts[prochain.id].nom : "—"} sous={prochain ? `${c.manque} ${formatEuros(prochain.seuilCents - investi, intl)}` : undefined} />
      </div>
      <div className="carte mt-6 p-6">
        <ol className="relative grid gap-3 md:grid-cols-5">
          {STATUTS.map((s) => {
            const atteint = investi >= s.seuilCents;
            return (
              <li key={s.id} className={` border p-4 ${atteint ? "border-encre bg-encre text-os" : "border-encre/10"}`}>
                <p className="font-display font-semibold tracking-tight text-2xl">0{s.ordre}</p>
                <p className="mt-1 font-medium">{t.adhesion.statuts[s.id].nom}</p>
                <p className={`text-xs ${atteint ? "text-os/60" : "text-pierre"}`}>{t.adhesion.aPartirDe} {formatEuros(s.seuilCents, intl)}</p>
                <p className={`mt-2 text-xs leading-relaxed ${atteint ? "text-os/75" : "text-encre/60"}`}>{t.adhesion.statuts[s.id].d}</p>
              </li>
            );
          })}
        </ol>
      </div>
      {a && (
        <div className="carte mt-6 p-6">
          <p className="etiquette">{c.avantages} · {t.adhesion.niveaux[a.id]}</p>
          <ul className="mt-4 space-y-2 text-sm">{avantages.map(([l, ok]) => <li key={l} className={`flex items-center gap-2 ${ok ? "" : "text-pierre line-through"}`}><span className={`h-1.5 w-1.5  ${ok ? "bg-signal" : "bg-pierre/30"}`} />{l}</li>)}</ul>
        </div>
      )}
    </>
  );
}
