import { pageLocale, dateLocale } from "@/lib/locale";
import { exigerInvestisseurValide } from "@/lib/garde";
import { db } from "@/lib/db";
import type { Mouvement } from "@/lib/types";
import { formatEuros, formatTokens } from "@/config/fonds";
import { Titre } from "@/components/Kpi";

export default async function Historique({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const u = await exigerInvestisseurValide(locale);
  const c = t.compte;
  const mvts = db().prepare("SELECT * FROM mouvements WHERE utilisateur_id = ? ORDER BY id DESC").all(u.id) as Mouvement[];
  return (
    <>
      <Titre>{c.historique}</Titre>
      <div className="carte overflow-x-auto p-6">
        <table className="tableau">
          <thead><tr><th>{t.commun.date}</th><th>{t.commun.reference}</th><th>{t.commun.montant}</th><th>{t.commun.tokenUnite}</th><th>{c.soldeApres}</th><th>{c.tokensApres}</th></tr></thead>
          <tbody>
            {mvts.map((m) => (
              <tr key={m.id}>
                <td className="whitespace-nowrap">{dateLocale(m.cree_le, intl)}</td>
                <td><span className="pastille-gris me-2">{c.types[m.type]}</span><span className="font-mono text-xs">{m.reference}</span><p className="mt-0.5 text-xs text-pierre">{m.description}</p></td>
                <td className={`whitespace-nowrap ${m.montant_cents < 0 ? "text-rouge" : "text-signal-2"}`}>{m.montant_cents > 0 ? "+" : ""}{formatEuros(m.montant_cents, intl)}</td>
                <td className="whitespace-nowrap">{m.tokens_centi ? `+${formatTokens(m.tokens_centi, intl)}` : "—"}</td>
                <td className="whitespace-nowrap">{formatEuros(m.solde_apres_cents, intl)}</td>
                <td className="whitespace-nowrap">{formatTokens(m.tokens_apres_centi, intl)}</td>
              </tr>
            ))}
            {mvts.length === 0 && <tr><td colSpan={6} className="text-pierre">{t.commun.aucun}</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
