import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { ArrowRight, CheckCircle, FileLock, ShieldWarning } from "@phosphor-icons/react/dist/ssr";
import { db } from "@/serveur/db";
import { alertes } from "@/serveur/db/schema";
import { STATUTS } from "@/interface/coffre/statut";
import { EtatVide, Message, Panneau, Pastille, classesBouton, dateFr } from "@/interface/ui/elements";
import { AGENTS } from "@/contenu/agents";
import { abonnementDe } from "@/serveur/lib/abonnement";
import { espaceUtilise } from "@/serveur/lib/coffre/coffre";
import { formaterOctets, nomDossier } from "@/serveur/lib/coffre/types";
import { conversationsDe } from "@/serveur/lib/messagerie/messagerie";
import { exiger } from "@/serveur/lib/securite/session";
import { etatAgents } from "@/serveur/lib/vues/agents";
import { piecesDe } from "@/serveur/lib/vues/pieces";

export const metadata = { title: "Tableau de bord" };

export default async function TableauClient({ searchParams }: { searchParams: Promise<{ bienvenue?: string }> }) {
  const s = await exiger({ equipe: false });
  const c = s.compte;
  const [abo, pieces, utilise, convs, agents, aTraiter, q] = await Promise.all([
    abonnementDe(c.id),
    piecesDe(c.id),
    espaceUtilise(c.id),
    conversationsDe(c.id),
    etatAgents(),
    db.select().from(alertes).where(and(eq(alertes.compteId, c.id), eq(alertes.statut, "ouverte"))).orderBy(desc(alertes.creeLe)).limit(5),
    searchParams,
  ]);
  const nonLus = convs.reduce((t, x) => t + x.nonLuClient, 0);
  const inclus = AGENTS.filter((a) => a.socle || abo.plan?.agents.includes(a.id));
  const quota = abo.plan?.quotaOctets ?? 0;

  return (
    <>
      {q.bienvenue && (
        <div className="mb-6">
          <Message ton="succes">Votre coffre-fort est ouvert. Déposez vos premières pièces quand vous voulez.</Message>
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[1.75rem] font-semibold">Bonjour {c.prenom || ""}</h1>
          <p className="mt-1 text-texte-2">{c.societe}</p>
        </div>
        <Link href="/espace/coffre" className={classesBouton("principal")}>
          Déposer des pièces
        </Link>
      </div>

      <dl className="grid grid-cols-2 lg:grid-cols-4 border border-filet rounded-lg bg-surface divide-x divide-y lg:divide-y-0 divide-filet mb-6">
        {[
          { t: "Pièces au coffre", v: String(pieces.actives.length) },
          { t: "Espace utilisé", v: formaterOctets(utilise), s: quota ? `sur ${formaterOctets(quota)}` : undefined },
          { t: "Messages non lus", v: String(nonLus) },
          { t: "Formule", v: abo.actif ? abo.plan!.nom : "Aucune" },
        ].map((x) => (
          <div key={x.t} className="px-5 py-4">
            <dt className="text-sm text-texte-3">{x.t}</dt>
            <dd className="mt-1">
              <span className="chiffres text-xl">{x.v}</span>
              {x.s && <span className="text-sm text-texte-3"> {x.s}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6">
        <Panneau
          titre="Dernières pièces"
          sansMarge
          action={
            <Link href="/espace/coffre" className="text-sm text-texte-2 hover:text-texte inline-flex items-center gap-1.5">
              Tout voir <ArrowRight className="size-3.5" />
            </Link>
          }
        >
          {pieces.actives.length === 0 ? (
            <EtatVide icone={<FileLock />} titre="Coffre vide" texte="Kbis, déclarations URSSAF, factures d'énergie, avis de taxe foncière : déposez ce que HPT doit analyser." />
          ) : (
            <ul className="divide-y divide-filet">
              {pieces.actives.slice(0, 6).map((p) => {
                const st = STATUTS[p.statut] ?? STATUTS.analyse;
                return (
                  <li key={p.id} className="flex items-center gap-4 px-5 py-3 text-sm">
                    <span className="flex-1 min-w-0">
                      <span className="block truncate font-medium">{p.nom}</span>
                      <span className="block text-xs text-texte-3">
                        {nomDossier(p.dossier)} · {dateFr(new Date(p.creeLe), false)}
                      </span>
                    </span>
                    <Pastille ton={st.ton}>{st.libelle}</Pastille>
                  </li>
                );
              })}
            </ul>
          )}
        </Panneau>

        <Panneau titre="Ce qui protège votre coffre" sansMarge>
          <ul className="divide-y divide-filet">
            {AGENTS.map((a) => {
              const etat = agents.agents.find((x) => x.id === a.id);
              const compris = inclus.some((x) => x.id === a.id);
              return (
                <li key={a.id} className="flex items-start gap-3 px-5 py-3">
                  {compris ? (
                    <CheckCircle className={`size-[18px] mt-0.5 shrink-0 ${etat?.actif ? "text-signal" : "text-vigilance"}`} weight="fill" />
                  ) : (
                    <span className="size-[18px] mt-0.5 shrink-0 rounded-full border border-filet-fort" aria-hidden />
                  )}
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm font-medium ${compris ? "" : "text-texte-3"}`}>{a.nom}</span>
                    <span className="block text-xs text-texte-3 leading-relaxed">
                      {compris ? (etat?.actif ? `Dernier passage ${dateFr(etat.derniere?.debut)}` : "En attente du prochain passage") : "Inclus dans les formules Pro et Ultra"}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </Panneau>
      </div>

      <Panneau titre="Points d'attention" className="mt-6" sansMarge>
        {aTraiter.length === 0 ? (
          <p className="px-5 py-6 text-sm text-texte-3">Rien à signaler.</p>
        ) : (
          <ul className="divide-y divide-filet">
            {aTraiter.map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-5 py-3.5">
                <ShieldWarning className={`size-5 shrink-0 ${a.gravite === "critique" || a.gravite === "haute" ? "text-danger" : "text-vigilance"}`} weight="duotone" />
                <span className="flex-1">
                  <span className="block text-sm font-medium">{a.titre}</span>
                  <span className="block text-sm text-texte-2">{a.description}</span>
                </span>
                <span className="text-xs text-texte-3 whitespace-nowrap">{dateFr(a.creeLe, false)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panneau>
    </>
  );
}
