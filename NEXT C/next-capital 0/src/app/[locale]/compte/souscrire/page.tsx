import Link from "next/link";
import { pageLocale } from "@/lib/locale";
import { exigerInvestisseurValide } from "@/lib/garde";
import { wallet, investiCetteAnnee } from "@/lib/wallet";
import { adhesion, formatEuros } from "@/config/fonds";
import { souscrireAction } from "@/lib/actions/compte";
import { Kpi, Message, Titre } from "@/components/Kpi";
import { SimulateurSouscription } from "@/components/SimulateurSouscription";

export default async function Souscrire({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ ok?: string; erreur?: string; ref?: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const u = await exigerInvestisseurValide(locale);
  const { ok, erreur, ref } = await searchParams;
  const c = t.compte;
  const w = wallet(u.id);
  const a = u.adhesion_niveau ? adhesion(u.adhesion_niveau) : null;
  const adhesionOk = Boolean(a && u.adhesion_payee_le);
  const annee = investiCetteAnnee(u.id);
  return (
    <>
      <Titre sous={a ? `${c.adhesion} ${t.adhesion.niveaux[a.id]} · ${c.frais} ${a.fraisStructurationPct} %` : undefined}>{c.souscrireTitre}</Titre>
      {ok && <div className="mb-5"><Message type="ok" texte={`${c.sousOk} ${ref ?? ""}`} /></div>}
      {erreur && <div className="mb-5"><Message type="erreur" texte={c.erreurs[erreur as keyof typeof c.erreurs] ?? c.erreurs.generique} /></div>}
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label={c.solde} valeur={formatEuros(w.solde_cents, intl)} accent />
        <Kpi label={c.plafondAn} valeur={a?.plafondAnnuelCents ? formatEuros(Math.max(0, a.plafondAnnuelCents - annee), intl) : t.adhesion.illimite} />
        <Kpi label={c.plafondOp} valeur={a?.plafondParOperationCents ? formatEuros(a.plafondParOperationCents, intl) : t.adhesion.illimite} />
      </div>
      <div className="carte mt-6 p-6">
        {adhesionOk && a ? (
          <SimulateurSouscription niveau={a.id} intl={intl} t={c} soldeCents={w.solde_cents} action={souscrireAction} locale={locale} />
        ) : (
          <div><Message type="info" texte={c.erreurs.adhesion} /><Link href={`/${locale}/compte`} className="bouton-primaire mt-4">{c.payerAdhesion}</Link></div>
        )}
      </div>
    </>
  );
}
