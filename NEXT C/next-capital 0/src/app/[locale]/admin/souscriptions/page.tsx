import { pageLocale, dateLocale } from "@/lib/locale";
import { db } from "@/lib/db";
import { formatEuros, formatTokens } from "@/config/fonds";
import { Kpi, Titre } from "@/components/Kpi";

interface Ligne { id: number; montant_cents: number; frais_cents: number; net_cents: number; tokens_centi: number; niveau: string; reference: string; cree_le: string; email: string; prenom: string; nom: string }

export default async function AdminSouscriptions({ params }: { params: Promise<{ locale: string }> }) {
  const { t, intl } = await pageLocale(params);
  const lignes = db().prepare("SELECT s.*, u.email, u.prenom, u.nom FROM souscriptions s JOIN utilisateurs u ON u.id = s.utilisateur_id ORDER BY s.id DESC LIMIT 500").all() as Ligne[];
  const total = lignes.reduce((a, l) => a + l.montant_cents, 0);
  const frais = lignes.reduce((a, l) => a + l.frais_cents, 0);
  const tokens = lignes.reduce((a, l) => a + l.tokens_centi, 0);
  return (
    <>
      <Titre>{t.admin.souscriptions}</Titre>
      <div className="grid gap-4 sm:grid-cols-3"><Kpi label={t.admin.kpis.collecte} valeur={formatEuros(total, intl)} accent /><Kpi label={t.compte.frais} valeur={formatEuros(frais, intl)} /><Kpi label={t.admin.kpis.tokens} valeur={formatTokens(tokens, intl)} /></div>
      <div className="carte mt-6 overflow-x-auto p-6">
        <table className="tableau">
          <thead><tr><th>{t.commun.date}</th><th>Investisseur</th><th>{t.commun.reference}</th><th>{t.compte.adhesion}</th><th>{t.commun.montant}</th><th>{t.compte.frais}</th><th>{t.commun.tokenUnite}</th></tr></thead>
          <tbody>{lignes.map((l) => <tr key={l.id}><td className="whitespace-nowrap">{dateLocale(l.cree_le, intl)}</td><td>{l.prenom} {l.nom}<p className="text-xs text-pierre">{l.email}</p></td><td className="font-mono text-xs">{l.reference}</td><td>{l.niveau}</td><td>{formatEuros(l.montant_cents, intl)}</td><td>{formatEuros(l.frais_cents, intl)}</td><td>{formatTokens(l.tokens_centi, intl)}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  );
}
