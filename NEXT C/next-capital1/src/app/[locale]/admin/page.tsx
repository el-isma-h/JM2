import Link from "next/link";
import { pageLocale, dateLocale } from "@/lib/locale";
import { db } from "@/lib/db";
import { formatEuros, formatTokens } from "@/config/fonds";
import { Kpi, Titre } from "@/components/Kpi";
import type { EntreeJournal } from "@/lib/types";
import { stripeConfigure } from "@/lib/stripe";

export default async function AdminTableau({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const a = t.admin;
  const d = db();
  const n = (sql: string) => (d.prepare(sql).get() as { n: number }).n;
  const candidats = n("SELECT COUNT(*) AS n FROM utilisateurs WHERE role='investisseur' AND statut_kyc IN ('en_attente','incomplet')");
  const ouverts = n("SELECT COUNT(*) AS n FROM utilisateurs WHERE role='investisseur' AND statut_kyc='valide'");
  const collecte = n("SELECT COALESCE(SUM(montant_cents),0) AS n FROM souscriptions");
  const tokens = n("SELECT COALESCE(SUM(tokens_centi),0) AS n FROM souscriptions");
  const depots = n("SELECT COUNT(*) AS n FROM depots WHERE statut='en_attente'");
  const journal = d.prepare("SELECT * FROM journal_audit ORDER BY id DESC LIMIT 8").all() as EntreeJournal[];
  return (
    <>
      <Titre>{a.tableau}</Titre>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Link href={`/${locale}/admin/kyc`}><Kpi label={a.kpis.candidats} valeur={String(candidats)} accent /></Link>
        <Kpi label={a.kpis.investisseurs} valeur={String(ouverts)} />
        <Kpi label={a.kpis.collecte} valeur={formatEuros(collecte, intl)} />
        <Kpi label={a.kpis.tokens} valeur={formatTokens(tokens, intl)} />
        <Link href={`/${locale}/admin/depots`}><Kpi label={a.kpis.depotsAttente} valeur={String(depots)} /></Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="carte p-5 text-sm"><p className="etiquette">{a.stripe}</p><p className={`mt-3 ${stripeConfigure() ? "pastille-vert" : "pastille-or"}`}>{stripeConfigure() ? a.stripeConfigure : a.stripeSimule}</p></div>
        <div className="carte p-5 text-sm"><p className="etiquette">{a.xai}</p><p className={`mt-3 ${process.env.XAI_API_KEY ? "pastille-vert" : "pastille-or"}`}>{process.env.XAI_API_KEY ? a.xaiConfigure : a.xaiSimule}</p></div>
      </div>
      <div className="carte mt-6 overflow-x-auto p-6">
        <p className="etiquette">{a.journal}</p>
        <table className="tableau mt-4">
          <thead><tr><th>{t.commun.date}</th><th>Acteur</th><th>Action</th><th>Cible</th></tr></thead>
          <tbody>{journal.map((j) => <tr key={j.id}><td className="whitespace-nowrap">{dateLocale(j.cree_le, intl)}</td><td>{j.acteur_email}</td><td><span className="pastille-gris">{j.action}</span></td><td className="font-mono text-xs">{j.cible}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  );
}
