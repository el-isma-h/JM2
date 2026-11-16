import { redirect } from "next/navigation";
import { pageLocale } from "@/lib/locale";
import { exigerInvestisseurValide } from "@/lib/garde";
import { db } from "@/lib/db";
import type { Depot } from "@/lib/types";
import { formatEuros } from "@/config/fonds";
import { simulerPaiementAction } from "@/lib/actions/compte";
import { Titre } from "@/components/Kpi";

/** Page de paiement simulée (absence de clé Stripe). */
export default async function Simulation({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ depot?: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const u = await exigerInvestisseurValide(locale);
  const { depot } = await searchParams;
  const d = db().prepare("SELECT * FROM depots WHERE id = ? AND utilisateur_id = ? AND statut = 'en_attente'").get(Number(depot), u.id) as Depot | undefined;
  if (!d) redirect(`/${locale}/compte/wallet`);
  return (
    <>
      <Titre sous={t.admin.stripeSimule}>{t.compte.carte}</Titre>
      <div className="carte mx-auto max-w-md p-8">
        <p className="etiquette">{t.commun.demoCourt}</p>
        <p className="mt-3 font-display font-semibold tracking-tight text-4xl">{formatEuros(d.montant_cents, intl)}</p>
        <p className="mt-1 font-mono text-xs text-pierre">{d.reference}</p>
        <div className="mt-6 space-y-3">
          <div><span className="champ-label">Carte</span><input className="champ font-mono" defaultValue="4242 4242 4242 4242" readOnly /></div>
          <div className="grid grid-cols-2 gap-3"><input className="champ font-mono" defaultValue="12/34" readOnly /><input className="champ font-mono" defaultValue="123" readOnly /></div>
        </div>
        <form action={simulerPaiementAction} className="mt-6"><input type="hidden" name="locale" value={locale} /><input type="hidden" name="depot" value={d.id} /><button className="bouton-primaire w-full">{t.compte.payer}</button></form>
      </div>
    </>
  );
}
