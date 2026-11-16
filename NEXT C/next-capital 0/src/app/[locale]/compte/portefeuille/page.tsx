import { pageLocale, dateLocale } from "@/lib/locale";
import { exigerInvestisseurValide } from "@/lib/garde";
import { db } from "@/lib/db";
import { wallet, capitalInvesti } from "@/lib/wallet";
import type { Souscription, Deal } from "@/lib/types";
import { FONDS, THESES, formatEuros, formatTokens, type TheseId } from "@/config/fonds";
import { Kpi, Titre } from "@/components/Kpi";
import { DealCarte } from "@/components/DealCarte";

export default async function Portefeuille({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const u = await exigerInvestisseurValide(locale);
  const c = t.compte;
  const w = wallet(u.id);
  const investi = capitalInvesti(u.id);
  const total = db().prepare("SELECT COALESCE(SUM(tokens_centi), 0) AS n FROM wallets").get() as { n: number };
  const part = total.n > 0 ? (w.tokens_centi / total.n) * 100 : 0;
  const sous = db().prepare("SELECT * FROM souscriptions WHERE utilisateur_id = ? ORDER BY id DESC").all(u.id) as Souscription[];
  const deals = db().prepare("SELECT * FROM deals WHERE statut <> 'a_venir' ORDER BY id").all() as Deal[];
  return (
    <>
      <Titre>{c.portefeuille}</Titre>
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label={c.tokens} valeur={formatTokens(w.tokens_centi, intl)} accent />
        <Kpi label={c.capitalInvesti} valeur={formatEuros(investi, intl)} />
        <Kpi label={c.vosParts} valeur={`${part.toFixed(2)} %`} sous={c.partExplication} />
      </div>
      <div className="carte mt-6 p-6">
        <p className="etiquette">{c.allocation}</p>
        <div className="mt-5 space-y-3">
          {THESES.map((th) => (
            <div key={th.id}>
              <div className="flex justify-between text-sm"><span>{t.theses[th.id as TheseId].nom}</span><span className="text-pierre">{th.allocationCiblePct} % · {formatEuros(Math.round((investi * th.allocationCiblePct) / 100), intl)}</span></div>
              <div className="mt-1 h-2 overflow-hidden  bg-encre/10"><div className="h-full  bg-encre" style={{ width: `${th.allocationCiblePct}%` }} /></div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-pierre">{t.accueil.disclaimerPerf}</p>
      </div>
      <div className="carte mt-6 overflow-x-auto p-6">
        <p className="etiquette">{c.docs.attestations}</p>
        <table className="tableau mt-4">
          <thead><tr><th>{t.commun.date}</th><th>{t.commun.reference}</th><th>{t.commun.montant}</th><th>{c.frais}</th><th>{c.net}</th><th>{t.commun.tokenUnite}</th></tr></thead>
          <tbody>{sous.map((s) => <tr key={s.id}><td className="whitespace-nowrap">{dateLocale(s.cree_le, intl)}</td><td className="font-mono text-xs">{s.reference}</td><td>{formatEuros(s.montant_cents, intl)}</td><td>{formatEuros(s.frais_cents, intl)}</td><td>{formatEuros(s.net_cents, intl)}</td><td>{formatTokens(s.tokens_centi, intl)}</td></tr>)}
          {sous.length === 0 && <tr><td colSpan={6} className="text-pierre">{t.commun.aucun}</td></tr>}</tbody>
        </table>
        <p className="mt-3 text-[11px] text-pierre">1 {FONDS.token.symbole} = {formatEuros(FONDS.token.prixEmissionCents, intl)}</p>
      </div>
      <div className="mt-8"><p className="etiquette mb-4">{t.deals.titre}</p><div className="grid gap-4 md:grid-cols-2">{deals.map((d) => <DealCarte key={d.id} d={d} t={t} locale={locale} intl={intl} />)}</div></div>
    </>
  );
}
