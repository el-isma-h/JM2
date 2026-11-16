import { redirect } from "next/navigation";
import { pageLocale } from "@/lib/locale";
import { utilisateurCourant } from "@/lib/auth";
import { majProfilAction, changerMotDePasseAction } from "@/lib/actions/compte";
import { Message, Titre } from "@/components/Kpi";
import { LANGUES, LOCALES } from "@/i18n/config";

export default async function Profil({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ ok?: string; erreur?: string }> }) {
  const { locale, t } = await pageLocale(params);
  const u = await utilisateurCourant();
  if (!u) redirect(`/${locale}/connexion`);
  const { ok, erreur } = await searchParams;
  const c = t.compte;
  return (
    <>
      <Titre>{c.profil}</Titre>
      {ok && <div className="mb-5"><Message type="ok" texte={c.profilOk} /></div>}
      {erreur && <div className="mb-5"><Message type="erreur" texte={c.erreurs.generique} /></div>}
      <div className="grid gap-4 md:grid-cols-2">
        <form action={majProfilAction} className="carte space-y-4 p-6">
          <input type="hidden" name="locale" value={locale} />
          <p className="etiquette">{c.profilInfos}</p>
          <div><span className="champ-label">{t.candidature.identite.prenom}</span><input className="champ" value={`${u.prenom} ${u.nom}`} readOnly /></div>
          <div><span className="champ-label">{t.candidature.identite.email}</span><input className="champ" value={u.email} readOnly /></div>
          <div><label className="champ-label" htmlFor="tel">{t.candidature.identite.telephone}</label><input id="tel" name="telephone" className="champ" defaultValue={u.telephone ?? ""} /></div>
          <div><label className="champ-label" htmlFor="langue">{c.langue}</label>
            <select id="langue" name="langue" className="champ" defaultValue={u.langue}>{LOCALES.map((l) => <option key={l} value={l}>{LANGUES[l].nom}</option>)}</select></div>
          <button className="bouton-primaire">{t.commun.enregistrer}</button>
        </form>
        <form action={changerMotDePasseAction} className="carte space-y-4 p-6">
          <input type="hidden" name="locale" value={locale} />
          <p className="etiquette">{c.changerMdp}</p>
          <div><label className="champ-label" htmlFor="actuel">{c.motDePasseActuel}</label><input id="actuel" name="actuel" type="password" required className="champ" autoComplete="current-password" /></div>
          <div><label className="champ-label" htmlFor="nouveau">{c.nouveauMotDePasse}</label><input id="nouveau" name="nouveau" type="password" required minLength={8} className="champ" autoComplete="new-password" /></div>
          <button className="bouton-contour">{c.changerMdp}</button>
        </form>
      </div>
    </>
  );
}
