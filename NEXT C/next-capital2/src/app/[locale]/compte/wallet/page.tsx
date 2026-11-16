import { pageLocale, dateLocale } from "@/lib/locale";
import { exigerInvestisseurValide } from "@/lib/garde";
import { wallet } from "@/lib/wallet";
import { db } from "@/lib/db";
import type { Depot } from "@/lib/types";
import { formatEuros, formatTokens, PAIEMENTS } from "@/config/fonds";
import { creerDepotSepaAction, creerDepotCryptoAction, demarrerPaiementCarteAction } from "@/lib/actions/compte";
import { Kpi, Message, Titre } from "@/components/Kpi";
import { OngletsDepot } from "@/components/OngletsDepot";
import { stripeConfigure } from "@/lib/stripe";

export default async function Wallet({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ ok?: string; erreur?: string; ref?: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const u = await exigerInvestisseurValide(locale);
  const { ok, erreur, ref } = await searchParams;
  const c = t.compte;
  const w = wallet(u.id);
  const depots = db().prepare("SELECT * FROM depots WHERE utilisateur_id = ? ORDER BY id DESC LIMIT 20").all(u.id) as Depot[];
  const champMontant = (id: string) => (
    <div><label className="champ-label" htmlFor={id}>{c.montantDepot}</label><input id={id} name="montant" type="number" min={PAIEMENTS.depotMinimumCents / 100} step="100" required className="champ" placeholder="5000" /></div>
  );
  const onglets = [
    { id: "sepa", label: c.sepa, contenu: (
      <form action={creerDepotSepaAction} className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <input type="hidden" name="locale" value={locale} />
        <div className="space-y-4">{champMontant("m-sepa")}<button className="bouton-primaire">{c.creerDepot}</button><p className="text-xs text-pierre">{c.sepaAide}</p></div>
        <dl className="bg-os p-5 text-sm">
          <dt className="text-pierre">{c.titulaire}</dt><dd className="mb-3 font-medium">{process.env.SEPA_TITULAIRE || "NEXT Capital S.A."}</dd>
          <dt className="text-pierre">{c.iban}</dt><dd className="mb-3 font-mono">{process.env.SEPA_IBAN || "LU00 0000 0000 0000 0000"}</dd>
          <dt className="text-pierre">{c.bic}</dt><dd className="font-mono">{process.env.SEPA_BIC || "XXXXLULL"}</dd>
        </dl>
      </form>
    ) },
    { id: "carte", label: c.carte, contenu: (
      <form action={demarrerPaiementCarteAction} className="max-w-md space-y-4">
        <input type="hidden" name="locale" value={locale} />
        {champMontant("m-carte")}
        <button className="bouton-primaire">{c.payer}</button>
        <p className="text-xs text-pierre">{c.carteAide}</p>
        <p className="pastille-gris">{stripeConfigure() ? t.admin.stripeConfigure : t.admin.stripeSimule}</p>
      </form>
    ) },
    { id: "crypto", label: c.crypto, contenu: (
      <form action={creerDepotCryptoAction} className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <input type="hidden" name="locale" value={locale} />
        <div className="space-y-4">
          {champMontant("m-crypto")}
          <div><label className="champ-label" htmlFor="tx">{c.txHash}</label><input id="tx" name="txHash" required minLength={10} className="champ font-mono" placeholder="0x…" /></div>
          <button className="bouton-primaire">{c.declarerEnvoi}</button>
          <p className="text-xs text-pierre">{c.cryptoAide}</p>
        </div>
        <dl className="bg-os p-5 text-sm">
          <dt className="text-pierre">{c.reseau}</dt><dd className="mb-3 font-medium">{process.env.CRYPTO_RESEAU || "Ethereum (USDC / USDT / ETH)"}</dd>
          <dt className="text-pierre">{c.adresse}</dt><dd className="break-all font-mono text-xs">{process.env.CRYPTO_ADRESSE || "0x0000000000000000000000000000000000000000"}</dd>
        </dl>
      </form>
    ) },
  ];
  return (
    <>
      <Titre>{c.wallet}</Titre>
      <div className="grid gap-4 sm:grid-cols-2"><Kpi label={c.solde} valeur={formatEuros(w.solde_cents, intl)} accent /><Kpi label={c.tokens} valeur={formatTokens(w.tokens_centi, intl)} /></div>
      {ok === "depot" && <div className="mt-5"><Message type="ok" texte={`${c.depotCree} ${ref ?? ""}`} /></div>}
      {ok === "carte" && <div className="mt-5"><Message type="ok" texte={c.depotCree} /></div>}
      {erreur && <div className="mt-5"><Message type="erreur" texte={c.erreurs[erreur as keyof typeof c.erreurs] ?? c.erreurs.generique} /></div>}
      <div className="carte mt-6 p-6">
        <p className="etiquette">{c.deposer}</p>
        <div className="mt-5"><OngletsDepot onglets={onglets} /></div>
      </div>
      <div className="carte mt-6 overflow-x-auto p-6">
        <p className="etiquette">{c.depotsEnAttente}</p>
        <table className="tableau mt-4">
          <thead><tr><th>{t.commun.date}</th><th>{t.commun.reference}</th><th>{c.methode}</th><th>{t.commun.montant}</th><th>{t.commun.statut}</th></tr></thead>
          <tbody>
            {depots.map((d) => (
              <tr key={d.id}><td className="whitespace-nowrap">{dateLocale(d.cree_le, intl)}</td><td className="font-mono text-xs">{d.reference}</td><td>{c[d.methode]}</td><td>{formatEuros(d.montant_cents, intl)}</td>
                <td><span className={d.statut === "confirme" ? "pastille-vert" : d.statut === "rejete" ? "pastille-rouge" : "pastille-or"}>{d.statut}</span></td></tr>
            ))}
            {depots.length === 0 && <tr><td colSpan={5} className="text-pierre">{t.commun.aucun}</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
