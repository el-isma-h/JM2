import { pageLocale } from "@/lib/locale";
import { ADHESIONS, FONDS, STATUTS, THESES, formatEuros } from "@/config/fonds";
import { reinitialiserAction } from "@/lib/actions/admin";
import { Titre } from "@/components/Kpi";
import { stripeConfigure } from "@/lib/stripe";

export default async function AdminParametres({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const a = t.admin;
  return (
    <>
      <Titre sous="Les paramètres économiques sont définis dans src/config/fonds.ts.">{a.parametres}</Titre>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="carte p-6 text-sm">
          <p className="etiquette">{t.nav.token}</p>
          <dl className="mt-3 space-y-1.5">
            <div className="flex justify-between"><dt className="text-pierre">{t.token.prix}</dt><dd>1 {FONDS.token.symbole} = {formatEuros(FONDS.token.prixEmissionCents, intl)}</dd></div>
            <div className="flex justify-between"><dt className="text-pierre">Ticket minimum</dt><dd>{formatEuros(FONDS.ticketMinimumCents, intl)} (pas {formatEuros(FONDS.ticketPasCents, intl)})</dd></div>
            <div className="flex justify-between"><dt className="text-pierre">Frais de gestion</dt><dd>{FONDS.fraisGestionAnnuelsPct.min} à {FONDS.fraisGestionAnnuelsPct.max} % / an</dd></div>
            <div className="flex justify-between"><dt className="text-pierre">Commission plus-value</dt><dd>{FONDS.commissionPlusValuePct} %</dd></div>
          </dl>
        </div>
        <div className="carte p-6 text-sm">
          <p className="etiquette">Intégrations</p>
          <ul className="mt-3 space-y-2">
            <li className="flex justify-between"><span className="text-pierre">{a.stripe}</span><span className={stripeConfigure() ? "pastille-vert" : "pastille-or"}>{stripeConfigure() ? "configuré" : "simulation"}</span></li>
            <li className="flex justify-between"><span className="text-pierre">{a.xai}</span><span className={process.env.XAI_API_KEY ? "pastille-vert" : "pastille-or"}>{process.env.XAI_API_KEY ? "configuré" : "orientation"}</span></li>
            <li className="flex justify-between"><span className="text-pierre">SEPA IBAN</span><span className="font-mono text-xs">{process.env.SEPA_IBAN || "non défini"}</span></li>
            <li className="flex justify-between"><span className="text-pierre">Crypto</span><span className="font-mono text-xs">{process.env.CRYPTO_RESEAU || "non défini"}</span></li>
          </ul>
        </div>
        <div className="carte p-6 text-sm">
          <p className="etiquette">{t.adhesion.niveauxTitre}</p>
          <table className="tableau mt-3"><thead><tr><th>Niveau</th><th>Prix</th><th>Plafond/an</th><th>Frais</th><th>Bons</th></tr></thead>
            <tbody>{ADHESIONS.map((x) => <tr key={x.id}><td>{t.adhesion.niveaux[x.id]}</td><td>{formatEuros(x.prixAnnuelCents, intl)}</td><td>{x.plafondAnnuelCents ? formatEuros(x.plafondAnnuelCents, intl) : "∞"}</td><td>{x.fraisStructurationPct} %</td><td>{x.bonsPriorite}</td></tr>)}</tbody></table>
        </div>
        <div className="carte p-6 text-sm">
          <p className="etiquette">{t.adhesion.statutsTitre} · {t.nav.theses}</p>
          <ul className="mt-3 space-y-1">{STATUTS.map((s) => <li key={s.id} className="flex justify-between"><span>{t.adhesion.statuts[s.id].nom}</span><span className="text-pierre">{formatEuros(s.seuilCents, intl)}</span></li>)}</ul>
          <ul className="mt-4 space-y-1 border-t border-encre/10 pt-3">{THESES.map((th) => <li key={th.id} className="flex justify-between"><span>{t.theses[th.id].nom}</span><span className="text-pierre">{th.allocationCiblePct} %</span></li>)}</ul>
        </div>
      </div>
      <form action={reinitialiserAction} className="carte mt-6 flex flex-wrap items-center justify-between gap-4 border-rouge/30 p-6">
        <input type="hidden" name="locale" value={locale} />
        <div><p className="font-medium">{a.reinitialiser}</p><p className="text-xs text-pierre">{a.reinitAide}</p></div>
        <button className="bouton !bg-rouge text-white">{a.reinitialiser}</button>
      </form>
    </>
  );
}
