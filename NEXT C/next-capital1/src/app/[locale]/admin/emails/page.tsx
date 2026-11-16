import { pageLocale, dateLocale } from "@/lib/locale";
import { db } from "@/lib/db";
import type { EmailJournal } from "@/lib/types";
import { Titre } from "@/components/Kpi";

export default async function AdminEmails({ params }: { params: Promise<{ locale: string }> }) {
  const { t, intl } = await pageLocale(params);
  const lignes = db().prepare("SELECT * FROM emails_journal ORDER BY id DESC LIMIT 200").all() as EmailJournal[];
  return (
    <>
      <Titre sous="Aucun SMTP configuré : les e-mails sont journalisés ici au lieu d'être envoyés.">{t.admin.emails}</Titre>
      <div className="space-y-3">
        {lignes.map((e) => (
          <details key={e.id} className="carte p-5">
            <summary className="flex cursor-pointer flex-wrap justify-between gap-2 text-sm"><span><strong>{e.sujet}</strong> <span className="text-pierre">→ {e.destinataire}</span></span><span className="text-pierre">{dateLocale(e.cree_le, intl)}</span></summary>
            <p className="mt-3 whitespace-pre-wrap text-sm text-encre/80">{e.corps}</p>
          </details>
        ))}
        {lignes.length === 0 && <p className="text-sm text-pierre">{t.commun.aucun}</p>}
      </div>
    </>
  );
}
