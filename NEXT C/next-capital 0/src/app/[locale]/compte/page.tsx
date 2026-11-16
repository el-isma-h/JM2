import Link from "next/link";
import { pageLocale } from "@/lib/locale";
import { utilisateurCourant } from "@/lib/auth";
import { wallet, capitalInvesti } from "@/lib/wallet";
import { adhesion, formatEuros, formatTokens, statutPourCapital, FONDS } from "@/config/fonds";
import { payerAdhesionAction } from "@/lib/actions/compte";
import { Kpi, Message, Titre } from "@/components/Kpi";
import { db } from "@/lib/db";
import type { Mouvement } from "@/lib/types";
import { dateLocale } from "@/lib/locale";

export default async function Tableau({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ ok?: string; erreur?: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const { ok, erreur } = await searchParams;
  const u = (await utilisateurCourant())!;
  const c = t.compte;

  if (u.statut_kyc !== "valide") {
    return (
      <>
        <Titre>{c.bienvenue}, {u.prenom}</Titre>
        <Message type={u.statut_kyc === "refuse" ? "erreur" : "info"} texte={u.statut_kyc === "refuse" ? c.kycRefuse : c.kycEnAttente} />
        <div className="carte mt-6 p-6 text-sm text-encre/70">
          <p className="etiquette">{t.candidature.titre}</p>
          <p className="mt-3">{t.parcours.etapes[1].d}</p>
        </div>
      </>
    );
  }

  const w = wallet(u.id);
  const investi = capitalInvesti(u.id);
  const statut = statutPourCapital(investi);
  const a = u.adhesion_niveau ? adhesion(u.adhesion_niveau) : null;
  const adhesionOk = Boolean(u.adhesion_payee_le);
  const derniers = db().prepare("SELECT * FROM mouvements WHERE utilisateur_id = ? ORDER BY id DESC LIMIT 5").all(u.id) as Mouvement[];

  return (
    <>
      <Titre sous={u.email}>{c.bienvenue}, {u.prenom}</Titre>
      {ok === "adhesion" && <div className="mb-5"><Message type="ok" texte={c.adhesionPayee} /></div>}
      {erreur && <div className="mb-5"><Message type="erreur" texte={c.erreurs[erreur as keyof typeof c.erreurs] ?? c.erreurs.generique} /></div>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={c.solde} valeur={formatEuros(w.solde_cents, intl)} accent />
        <Kpi label={c.tokens} valeur={formatTokens(w.tokens_centi, intl)} sous={`${c.valeurEstimee} ${formatEuros(Math.round((w.tokens_centi * FONDS.token.prixEmissionCents) / 100), intl)}`} />
        <Kpi label={c.capitalInvesti} valeur={formatEuros(investi, intl)} />
        <Kpi label={c.statutActuel} valeur={statut ? t.adhesion.statuts[statut.id].nom : "—"} sous={a ? `${c.adhesion} ${t.adhesion.niveaux[a.id]}` : undefined} />
      </div>

      {a && !adhesionOk && (
        <div className="carte mt-6 flex flex-wrap items-center justify-between gap-4 border-signal bg-signal/5 p-6">
          <div>
            <p className="font-medium">{c.adhesionAPayer} : {t.adhesion.niveaux[a.id]} · {formatEuros(a.prixAnnuelCents, intl)} {t.adhesion.parAn}</p>
            <p className="mt-1 text-xs text-pierre">{t.candidature.adhesionAide}</p>
          </div>
          <form action={payerAdhesionAction}><input type="hidden" name="locale" value={locale} /><button className="bouton-or" disabled={w.solde_cents < a.prixAnnuelCents}>{c.payerAdhesion}</button></form>
        </div>
      )}
      {a && adhesionOk && <p className="mt-4 text-xs text-pierre">{c.adhesionValide} {u.adhesion_expire_le}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[["wallet", c.deposer], ["souscrire", c.souscrireTitre], ["portefeuille", c.portefeuille]].map(([s, l]) => (
          <Link key={s} href={`/${locale}/compte/${s}`} className="carte p-5 transition hover:bg-os-2"><p className="font-display font-semibold tracking-tight text-xl">{l}</p><p className="mt-1 text-xs text-pierre">→</p></Link>
        ))}
      </div>

      <div className="carte mt-8 overflow-x-auto p-6">
        <p className="etiquette">{c.historique}</p>
        <table className="tableau mt-4">
          <thead><tr><th>{t.commun.date}</th><th>{t.commun.reference}</th><th>{t.commun.montant}</th><th>{t.commun.tokenUnite}</th></tr></thead>
          <tbody>
            {derniers.map((m) => (
              <tr key={m.id}><td className="whitespace-nowrap">{dateLocale(m.cree_le, intl)}</td><td><span className="pastille-gris me-2">{c.types[m.type]}</span>{m.reference}</td><td className={m.montant_cents < 0 ? "text-rouge" : "text-signal-2"}>{formatEuros(m.montant_cents, intl)}</td><td>{m.tokens_centi ? formatTokens(m.tokens_centi, intl) : "—"}</td></tr>
            ))}
            {derniers.length === 0 && <tr><td colSpan={4} className="text-pierre">{t.commun.aucun}</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
