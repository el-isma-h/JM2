import { pageLocale, dateLocale } from "@/lib/locale";
import { db } from "@/lib/db";
import type { EntreeJournal } from "@/lib/types";
import { Titre } from "@/components/Kpi";

export default async function AdminJournal({ params }: { params: Promise<{ locale: string }> }) {
  const { t, intl } = await pageLocale(params);
  const lignes = db().prepare("SELECT * FROM journal_audit ORDER BY id DESC LIMIT 500").all() as EntreeJournal[];
  return (
    <>
      <Titre>{t.admin.journal}</Titre>
      <div className="carte overflow-x-auto p-6">
        <table className="tableau">
          <thead><tr><th>#</th><th>{t.commun.date}</th><th>Acteur</th><th>Action</th><th>Cible</th><th>Détails</th></tr></thead>
          <tbody>{lignes.map((j) => <tr key={j.id}><td className="text-pierre">{j.id}</td><td className="whitespace-nowrap">{dateLocale(j.cree_le, intl)}</td><td>{j.acteur_email}</td><td><span className="pastille-gris">{j.action}</span></td><td className="font-mono text-xs">{j.cible}</td><td className="max-w-[320px] truncate font-mono text-[11px] text-pierre">{j.details}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  );
}
