import { pageLocale, dateLocale } from "@/lib/locale";
import { db } from "@/lib/db";
import { formatEuros } from "@/config/fonds";
import { deciderDepotAction } from "@/lib/actions/admin";
import { Titre } from "@/components/Kpi";

interface Ligne { id: number; methode: "sepa" | "carte" | "crypto"; montant_cents: number; statut: string; reference: string; detail: string | null; cree_le: string; email: string; prenom: string; nom: string }

export default async function AdminDepots({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const lignes = db().prepare("SELECT d.*, u.email, u.prenom, u.nom FROM depots d JOIN utilisateurs u ON u.id = d.utilisateur_id ORDER BY CASE d.statut WHEN 'en_attente' THEN 0 ELSE 1 END, d.id DESC LIMIT 200").all() as Ligne[];
  return (
    <>
      <Titre>{t.admin.depots}</Titre>
      <div className="carte overflow-x-auto p-6">
        <table className="tableau">
          <thead><tr><th>{t.commun.date}</th><th>Investisseur</th><th>{t.compte.methode}</th><th>{t.commun.reference}</th><th>{t.commun.montant}</th><th>{t.commun.statut}</th><th>{t.commun.actions}</th></tr></thead>
          <tbody>
            {lignes.map((l) => {
              const det = l.detail ? (JSON.parse(l.detail) as Record<string, string>) : {};
              return (
                <tr key={l.id}>
                  <td className="whitespace-nowrap">{dateLocale(l.cree_le, intl)}</td>
                  <td>{l.prenom} {l.nom}<p className="text-xs text-pierre">{l.email}</p></td>
                  <td>{t.compte[l.methode]}{det.txHash && <p className="max-w-[160px] truncate font-mono text-[10px] text-pierre">{det.txHash}</p>}</td>
                  <td className="font-mono text-xs">{l.reference}</td>
                  <td className="whitespace-nowrap">{formatEuros(l.montant_cents, intl)}</td>
                  <td><span className={l.statut === "confirme" ? "pastille-vert" : l.statut === "rejete" ? "pastille-rouge" : "pastille-or"}>{l.statut}</span></td>
                  <td>
                    {l.statut === "en_attente" && (
                      <form action={deciderDepotAction} className="flex gap-1.5">
                        <input type="hidden" name="locale" value={locale} /><input type="hidden" name="depot" value={l.id} />
                        <button name="decision" value="confirmer" className="bouton-primaire !px-3 !py-1 text-xs">{t.admin.confirmerDepot}</button>
                        <button name="decision" value="rejeter" className="bouton-contour !px-3 !py-1 text-xs">{t.admin.rejeterDepot}</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
