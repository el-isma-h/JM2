import { redirect } from "next/navigation";
import { pageLocale, dateLocale } from "@/lib/locale";
import { utilisateurCourant } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Kyc, Souscription } from "@/lib/types";
import { formatEuros, formatTokens } from "@/config/fonds";
import { Titre } from "@/components/Kpi";

export default async function Documents({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, intl } = await pageLocale(params);
  const u = await utilisateurCourant();
  if (!u) redirect(`/${locale}/connexion`);
  const c = t.compte;
  const kyc = db().prepare("SELECT * FROM kyc WHERE utilisateur_id = ? ORDER BY id DESC LIMIT 1").get(u.id) as Kyc | undefined;
  const sous = db().prepare("SELECT * FROM souscriptions WHERE utilisateur_id = ? ORDER BY id DESC").all(u.id) as Souscription[];
  return (
    <>
      <Titre>{c.documents}</Titre>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="carte p-6">
          <p className="etiquette">{c.docs.kyc}</p>
          {kyc ? (
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex justify-between"><span className="text-pierre">{t.commun.date}</span><span>{dateLocale(kyc.soumis_le, intl)}</span></li>
              <li className="flex justify-between"><span className="text-pierre">{t.commun.statut}</span><span className={u.statut_kyc === "valide" ? "pastille-vert" : u.statut_kyc === "refuse" ? "pastille-rouge" : "pastille-or"}>{u.statut_kyc}</span></li>
              {kyc.piece_identite && <li><a href={`/api/documents/${kyc.piece_identite}`} className="text-encre underline-offset-4 hover:underline" target="_blank" rel="noreferrer">{t.candidature.pieces.identite} →</a></li>}
              {kyc.justificatif_domicile && <li><a href={`/api/documents/${kyc.justificatif_domicile}`} className="text-encre underline-offset-4 hover:underline" target="_blank" rel="noreferrer">{t.candidature.pieces.domicile} →</a></li>}
            </ul>
          ) : <p className="mt-4 text-sm text-pierre">{t.commun.aucun}</p>}
        </div>
        <div className="carte p-6">
          <p className="etiquette">{c.docs.reporting}</p>
          <p className="mt-4 text-sm text-pierre">{c.docs.reportingAide}</p>
        </div>
      </div>
      <div className="carte mt-4 p-6">
        <p className="etiquette">{c.docs.attestations}</p>
        <ul className="mt-4 divide-y divide-encre/10 text-sm">
          {sous.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <span><span className="font-mono text-xs">{s.reference}</span> · {dateLocale(s.cree_le, intl)} · {formatEuros(s.montant_cents, intl)} → {formatTokens(s.tokens_centi, intl)}</span>
              <a href={`/api/attestation/${s.id}`} className="bouton-contour !px-4 !py-1.5 text-xs">{c.telecharger}</a>
            </li>
          ))}
          {sous.length === 0 && <li className="py-3 text-pierre">{t.commun.aucun}</li>}
        </ul>
      </div>
    </>
  );
}
