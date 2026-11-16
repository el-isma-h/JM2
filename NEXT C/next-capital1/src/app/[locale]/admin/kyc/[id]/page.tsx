import Link from "next/link";
import { notFound } from "next/navigation";
import { pageLocale, dateLocale } from "@/lib/locale";
import { db } from "@/lib/db";
import type { Kyc, Utilisateur } from "@/lib/types";
import { deciderKycAction } from "@/lib/actions/admin";
import { Titre } from "@/components/Kpi";
import { THESES, type TheseId } from "@/config/fonds";

export default async function AdminKycDetail({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const { id } = await params;
  const kyc = db().prepare("SELECT * FROM kyc WHERE id = ?").get(Number(id)) as Kyc | undefined;
  if (!kyc) notFound();
  const u = db().prepare("SELECT * FROM utilisateurs WHERE id = ?").get(kyc.utilisateur_id) as Utilisateur;
  const r = JSON.parse(kyc.reponses) as Record<string, unknown>;
  const a = t.admin;
  const c = t.candidature;
  const lib = (groupe: Record<string, string> | undefined, v: unknown) => (groupe && typeof v === "string" && groupe[v]) || String(v ?? "—");
  const lignes: [string, string][] = [
    [c.identite.telephone, u.telephone ?? "—"], [c.identite.pays, u.pays ?? "—"], [c.identite.naissance, String(r.naissance ?? "—")], [c.identite.nationalite, String(r.nationalite ?? "—")], [c.identite.adresse, String(r.adresse ?? "—")],
    [c.situation.situation, lib(c.situation.situations, r.situation)], [c.situation.secteur, lib(c.situation.secteurs, r.secteur)], [c.situation.revenus, lib(c.situation.revenusOptions, r.revenus)], [c.situation.patrimoine, lib(c.situation.patrimoineOptions, r.patrimoine)], [c.situation.origineFonds, lib(c.situation.origines, r.origineFonds)],
    [c.situation.pep, String(r.pep ?? "—")], [c.situation.usPerson, String(r.usPerson ?? "—")],
    [c.profil.zones, Array.isArray(r.zones) ? r.zones.map((z) => lib(c.profil.zonesOptions, z)).join(", ") : "—"], [c.profil.theses, Array.isArray(r.theses) ? r.theses.map((x) => (THESES.some((th) => th.id === x) ? t.theses[x as TheseId].nom : String(x))).join(", ") : "—"],
    [c.profil.risque, lib(c.profil.risques, r.risque)], [c.profil.rendement, lib(c.profil.rendements, r.rendement)], [c.profil.horizon, lib(c.profil.horizons, r.horizon)], [c.profil.experience, lib(c.profil.experiences, r.experience)], [c.profil.montantEnvisage, r.montantEnvisage ? `${r.montantEnvisage} €` : "—"],
    [t.compte.adhesion, u.adhesion_niveau ? t.adhesion.niveaux[u.adhesion_niveau] : "—"],
  ];
  return (
    <>
      <Link href={`/${locale}/admin/kyc`} className="text-sm text-pierre">← {a.kyc}</Link>
      <div className="mt-3"><Titre sous={`${u.email} · ${dateLocale(kyc.soumis_le, intl)}`}>{u.prenom} {u.nom}</Titre></div>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="carte p-6">
          <p className="etiquette">{a.reponses}</p>
          <dl className="mt-4 divide-y divide-encre/10 text-sm">{lignes.map(([l, v]) => <div key={l} className="grid gap-1 py-2.5 sm:grid-cols-[1fr_1.2fr]"><dt className="text-pierre">{l}</dt><dd>{v}</dd></div>)}</dl>
        </div>
        <div className="space-y-4">
          <div className="carte p-6">
            <p className="etiquette">{a.pieces}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {kyc.piece_identite ? <li><a href={`/api/documents/${kyc.piece_identite}`} target="_blank" rel="noreferrer" className="bouton-contour !px-4 !py-1.5 text-xs">{c.pieces.identite} →</a></li> : <li className="text-pierre">{a.aucunePiece}</li>}
              {kyc.justificatif_domicile && <li><a href={`/api/documents/${kyc.justificatif_domicile}`} target="_blank" rel="noreferrer" className="bouton-contour !px-4 !py-1.5 text-xs">{c.pieces.domicile} →</a></li>}
            </ul>
          </div>
          <form action={deciderKycAction} className="carte space-y-4 p-6">
            <input type="hidden" name="locale" value={locale} /><input type="hidden" name="kyc" value={kyc.id} />
            <p className="etiquette">{a.decider}</p>
            <p className="text-sm">{t.commun.statut} : <span className={u.statut_kyc === "valide" ? "pastille-vert" : u.statut_kyc === "refuse" ? "pastille-rouge" : "pastille-or"}>{u.statut_kyc}</span></p>
            {kyc.commentaire && <p className="bg-os p-3 text-xs text-encre/70">{kyc.commentaire}</p>}
            <div><label className="champ-label" htmlFor="com">{a.commentaire}</label><textarea id="com" name="commentaire" rows={3} className="champ" /></div>
            <div className="flex flex-wrap gap-2">
              <button name="decision" value="valide" className="bouton-primaire !px-4 text-xs">{a.valider}</button>
              <button name="decision" value="incomplet" className="bouton-contour !px-4 text-xs">{a.incomplet}</button>
              <button name="decision" value="refuse" className="bouton !bg-rouge !px-4 text-xs text-white">{a.refuser}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
