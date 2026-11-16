import { pageLocale } from "@/lib/locale";
import { Titre } from "@/components/Kpi";

export default async function AdminExport({ params }: { params: Promise<{ locale: string }> }) {
  const { t } = await pageLocale(params);
  const types = Object.entries(t.admin.csv) as [string, string][];
  return (
    <>
      <Titre>{t.admin.export}</Titre>
      <div className="grid gap-4 sm:grid-cols-2">
        {types.map(([k, l]) => <a key={k} href={`/api/admin/export/${k}`} className="carte flex items-center justify-between p-6 transition hover:bg-os-2"><span className="font-display font-semibold tracking-tight text-xl">{l}</span><span className="pastille-gris">CSV</span></a>)}
      </div>
    </>
  );
}
