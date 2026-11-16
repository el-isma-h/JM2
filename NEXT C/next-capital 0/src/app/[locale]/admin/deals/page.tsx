import { pageLocale } from "@/lib/locale";
import { db } from "@/lib/db";
import type { Deal } from "@/lib/types";
import { CANAUX, THESES, formatEuros, type TheseId } from "@/config/fonds";
import { enregistrerDealAction, supprimerDealAction } from "@/lib/actions/admin";
import { Message, Titre } from "@/components/Kpi";

function FormDeal({ d, locale, t }: { d?: Deal; locale: string; t: Awaited<ReturnType<typeof pageLocale>>["t"] }) {
  return (
    <form action={enregistrerDealAction} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />{d && <input type="hidden" name="id" value={d.id} />}
      <div><span className="champ-label">Nom</span><input name="nom" required defaultValue={d?.nom} className="champ" /></div>
      <div><span className="champ-label">Slug</span><input name="slug" required defaultValue={d?.slug} className="champ font-mono" /></div>
      <div><span className="champ-label">{t.deals.these}</span><select name="these" defaultValue={d?.these ?? "ia"} className="champ">{THESES.map((th) => <option key={th.id} value={th.id}>{t.theses[th.id as TheseId].nom}</option>)}</select></div>
      <div><span className="champ-label">{t.deals.canal}</span><select name="canal" defaultValue={d?.canal ?? "europe"} className="champ">{CANAUX.map((c) => <option key={c} value={c}>{t.accueil.canaux[c].t}</option>)}</select></div>
      <div><span className="champ-label">{t.deals.stade}</span><input name="stade" required defaultValue={d?.stade} className="champ" /></div>
      <div><span className="champ-label">{t.deals.pays}</span><input name="pays" required defaultValue={d?.pays} className="champ" /></div>
      <div><span className="champ-label">{t.deals.objectif} (€)</span><input name="objectif" type="number" min={1} required defaultValue={d ? d.objectif_cents / 100 : ""} className="champ" /></div>
      <div><span className="champ-label">{t.deals.alloue} (€)</span><input name="alloue" type="number" min={0} defaultValue={d ? d.alloue_cents / 100 : 0} className="champ" /></div>
      <div><span className="champ-label">{t.commun.statut}</span><select name="statut" defaultValue={d?.statut ?? "a_venir"} className="champ"><option value="ouvert">{t.deals.ouvert}</option><option value="a_venir">{t.deals.a_venir}</option><option value="cloture">{t.deals.cloture}</option></select></div>
      <label className="flex items-center gap-2 self-end text-sm"><input type="checkbox" name="exemple" defaultChecked={d ? d.exemple === 1 : true} className="accent-encre" />{t.commun.exemple}</label>
      <div className="sm:col-span-2"><span className="champ-label">Résumé FR</span><textarea name="resume_fr" rows={2} defaultValue={d?.resume_fr} className="champ" /></div>
      <div className="sm:col-span-2"><span className="champ-label">Résumé EN</span><textarea name="resume_en" rows={2} defaultValue={d?.resume_en} className="champ" /></div>
      <div className="sm:col-span-2"><button className="bouton-primaire !px-5 !py-2 text-xs">{t.commun.enregistrer}</button></div>
    </form>
  );
}

export default async function AdminDeals({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ erreur?: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const { erreur } = await searchParams;
  const deals = db().prepare("SELECT * FROM deals ORDER BY id").all() as Deal[];
  return (
    <>
      <Titre>{t.admin.deals}</Titre>
      {erreur && <div className="mb-4"><Message type="erreur" texte={t.candidature.erreurs.champs} /></div>}
      <details className="carte p-6" open={deals.length === 0}>
        <summary className="cursor-pointer font-display font-semibold tracking-tight text-xl">{t.admin.nouveauDeal}</summary>
        <div className="mt-4"><FormDeal locale={locale} t={t} /></div>
      </details>
      <div className="mt-4 space-y-3">
        {deals.map((d) => (
          <details key={d.id} className="carte p-6">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
              <span className="font-display font-semibold tracking-tight text-xl">{d.nom} <span className="ms-2 text-sm text-pierre">{t.theses[d.these as TheseId].nom} · {d.stade} · {d.pays}</span></span>
              <span className="text-sm">{formatEuros(d.alloue_cents, intl)} / {formatEuros(d.objectif_cents, intl)} <span className={`ms-2 ${d.statut === "ouvert" ? "pastille-vert" : d.statut === "cloture" ? "pastille-gris" : "pastille-azur"}`}>{t.deals[d.statut]}</span></span>
            </summary>
            <div className="mt-4"><FormDeal d={d} locale={locale} t={t} /></div>
            <form action={supprimerDealAction} className="mt-3"><input type="hidden" name="locale" value={locale} /><input type="hidden" name="id" value={d.id} /><button className="text-xs text-rouge underline-offset-4 hover:underline">{t.admin.supprimerDeal}</button></form>
          </details>
        ))}
      </div>
    </>
  );
}
