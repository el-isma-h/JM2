import Link from "next/link";
import { pageLocale, dateLocale } from "@/lib/locale";
import { db } from "@/lib/db";
import { Titre } from "@/components/Kpi";

interface Ligne { id: number; utilisateur_id: number; prenom: string; nom: string; email: string; pays: string | null; statut_kyc: string; adhesion_niveau: string | null; soumis_le: string; decision: string | null }

export default async function AdminKyc({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const lignes = db().prepare(`SELECT k.id, k.utilisateur_id, u.prenom, u.nom, u.email, u.pays, u.statut_kyc, u.adhesion_niveau, k.soumis_le, k.decision
    FROM kyc k JOIN utilisateurs u ON u.id = k.utilisateur_id ORDER BY CASE u.statut_kyc WHEN 'en_attente' THEN 0 WHEN 'incomplet' THEN 1 ELSE 2 END, k.id DESC`).all() as Ligne[];
  const pastille = (s: string) => (s === "valide" ? "pastille-vert" : s === "refuse" ? "pastille-rouge" : "pastille-or");
  return (
    <>
      <Titre>{t.admin.kyc}</Titre>
      <div className="carte overflow-x-auto p-6">
        <table className="tableau">
          <thead><tr><th>{t.commun.date}</th><th>Candidat</th><th>{t.candidature.identite.pays}</th><th>{t.compte.adhesion}</th><th>{t.commun.statut}</th><th></th></tr></thead>
          <tbody>
            {lignes.map((l) => (
              <tr key={l.id}>
                <td className="whitespace-nowrap">{dateLocale(l.soumis_le, intl)}</td>
                <td>{l.prenom} {l.nom}<p className="text-xs text-pierre">{l.email}</p></td>
                <td>{l.pays}</td>
                <td>{l.adhesion_niveau ? t.adhesion.niveaux[l.adhesion_niveau as keyof typeof t.adhesion.niveaux] : "—"}</td>
                <td><span className={pastille(l.statut_kyc)}>{l.statut_kyc}</span></td>
                <td><Link href={`/${locale}/admin/kyc/${l.id}`} className="bouton-contour !px-4 !py-1.5 text-xs">{t.admin.decider}</Link></td>
              </tr>
            ))}
            {lignes.length === 0 && <tr><td colSpan={6} className="text-pierre">{t.commun.aucun}</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
