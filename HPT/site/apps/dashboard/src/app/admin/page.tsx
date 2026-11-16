import Link from "next/link";
import { desc, eq, isNull, notLike, sql } from "drizzle-orm";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { db } from "@/serveur/db";
import { alertes, documents, propositions, rapports } from "@/serveur/db/schema";
import { Forme } from "@/interface/ui/Forme";
import { etatsEnregistres } from "@/serveur/lib/next/ecosysteme";
import { LIBELLES_STATUT } from "@/serveur/lib/next/libelles";
import { EtatVide, Panneau, Pastille, PointEtat, dateFr } from "@/interface/ui/elements";
import { STATUTS_ACTIFS, prixEuros } from "@/serveur/lib/abonnement";
import { formaterOctets } from "@/serveur/lib/coffre/types";
import { exiger } from "@/serveur/lib/securite/session";
import { etatAgents } from "@/serveur/lib/vues/agents";
import { listerClients } from "@/serveur/lib/vues/clients";

export const metadata = { title: "Vue d'ensemble" };

const TON_GRAVITE = { critique: "danger", haute: "danger", moyenne: "vigilance", info: "neutre" } as const;

export default async function VueEnsemble() {
  await exiger({ equipe: true });
  const [clients, [stock], ouvertes, [rapport], agents, etats, [attente]] = await Promise.all([
    listerClients(),
    db.select({ n: sql<number>`count(*)::int`, total: sql<string>`coalesce(sum(${documents.tailleChiffree}),0)` }).from(documents).where(isNull(documents.supprimeLe)),
    db.select().from(alertes).where(eq(alertes.statut, "ouverte")).orderBy(desc(alertes.creeLe)).limit(6),
    db.select().from(rapports).where(notLike(rapports.contenu, "[Écosystème]%")).orderBy(desc(rapports.creeLe)).limit(1),
    etatAgents(),
    etatsEnregistres(),
    db.select({ n: sql<number>`count(*)::int` }).from(propositions).where(eq(propositions.statut, "a_valider")),
  ]);
  const actifs = clients.filter((c) => c.statut && STATUTS_ACTIFS.includes(c.statut));
  const payants = clients.filter((c) => c.statut === "actif");
  const mrr = payants.reduce((t, c) => t + (c.prix ?? 0), 0);
  const semaine = clients.filter((c) => Date.now() - c.c.creeLe.getTime() < 7 * 86_400_000).length;
  const incomplets = clients.filter((c) => c.c.onboardingEtape !== 99).length;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-semibold">Vue d&apos;ensemble</h1>
        <p className="mt-1 text-texte-2">Clients, coffre-fort et sécurité de la plateforme HPT.</p>
      </div>

      <dl className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 border border-filet rounded-lg bg-surface divide-x divide-y xl:divide-y-0 divide-filet mb-6">
        {[
          { t: "Clients", v: String(clients.length), s: semaine ? `+${semaine} cette semaine` : undefined },
          { t: "Abonnements actifs", v: String(actifs.length), s: actifs.length - payants.length ? `dont ${actifs.length - payants.length} démo` : undefined },
          { t: "Revenu mensuel", v: prixEuros(mrr), s: "HT, abonnements payés" },
          { t: "Pièces stockées", v: String(stock.n), s: formaterOctets(Number(stock.total)) },
          { t: "Onboardings en cours", v: String(incomplets) },
          { t: "À valider", v: String(attente.n), s: "propositions des agents" },
        ].map((x) => (
          <div key={x.t} className="px-5 py-4">
            <dt className="text-sm text-texte-3">{x.t}</dt>
            <dd className="mt-1 chiffres text-xl">{x.v}</dd>
            {x.s && <dd className="text-xs text-texte-3 mt-0.5">{x.s}</dd>}
          </div>
        ))}
      </dl>

      <section aria-label="Écosystème Next" className="mb-6 rounded-lg border border-filet bg-surface">
        <header className="flex items-center justify-between px-5 h-14 border-b border-filet">
          <h2 className="text-[0.9375rem] font-semibold font-sans tracking-normal">Écosystème Next</h2>
          <Link href="/admin/ecosysteme" className="text-sm text-texte-2 hover:text-texte inline-flex items-center gap-1.5">
            Piloter <ArrowRight className="size-3.5" />
          </Link>
        </header>
        <ul className="grid sm:grid-cols-2 xl:grid-cols-6 divide-y sm:divide-y-0 xl:divide-x divide-filet">
          {etats.map((e) => {
            const premier = e.etat?.indicateurs[0];
            return (
              <li key={e.produit.slug}>
                <Link href={`/admin/ecosysteme/${e.produit.slug}`} className="flex flex-col gap-2 px-5 py-4 hover:bg-surface-2/50 h-full">
                  <span className="flex items-center gap-2 text-sm font-medium" style={{ color: e.produit.couleur }}>
                    <Forme forme={e.produit.forme} couleur={e.produit.couleur} pleine={e.statut === "ok"} className="size-3.5" />
                    {e.produit.nom.replace("Next ", "")}
                  </span>
                  {e.statut === "ok" && premier ? (
                    <span>
                      <span className="chiffres text-lg">{premier.valeur}</span> <span className="text-xs text-texte-3">{premier.libelle}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-texte-3">{LIBELLES_STATUT[e.statut] ?? e.statut}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6">
        <Panneau
          titre="Derniers inscrits"
          sansMarge
          action={
            <Link href="/admin/clients" className="text-sm text-texte-2 hover:text-texte inline-flex items-center gap-1.5">
              Tous les clients <ArrowRight className="size-3.5" />
            </Link>
          }
        >
          {clients.length === 0 ? (
            <EtatVide titre="Aucun client pour l'instant" texte="Les inscriptions apparaîtront ici avec leurs réponses d'onboarding." />
          ) : (
            <ul className="divide-y divide-filet">
              {clients.slice(0, 7).map(({ c, r, plan, statut }) => (
                <li key={c.id}>
                  <Link href={`/admin/clients/${c.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-2/50 transition-colors">
                    <span className="flex-1 min-w-0">
                      <span className="block font-medium truncate">{c.societe || "Société non renseignée"}</span>
                      <span className="block text-sm text-texte-3 truncate">
                        {[c.prenom, c.nom].filter(Boolean).join(" ") || c.email}
                        {r.secteur ? ` · ${r.secteur}` : ""}
                        {r.effectif ? ` · ${r.effectif} salariés` : ""}
                      </span>
                    </span>
                    {c.onboardingEtape !== 99 ? (
                      <Pastille ton="vigilance">Onboarding {c.onboardingEtape}/5</Pastille>
                    ) : plan && statut && STATUTS_ACTIFS.includes(statut) ? (
                      <Pastille ton="signal">{plan}</Pastille>
                    ) : (
                      <Pastille>Sans formule</Pastille>
                    )}
                    <span className="hidden sm:block text-xs text-texte-3 w-24 text-right">{dateFr(c.creeLe, false)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panneau>

        <div className="flex flex-col gap-6">
          <Panneau titre="Synthèse de l'Analyste" action={rapport ? <span className="text-xs text-texte-3">{rapport.moteur}</span> : undefined}>
            {rapport ? (
              <>
                <p className="text-sm text-texte-2 whitespace-pre-line leading-relaxed">{rapport.contenu}</p>
                <p className="text-xs text-texte-3 mt-3">{dateFr(rapport.creeLe)}</p>
              </>
            ) : (
              <p className="text-sm text-texte-3">Aucun rapport : lancez le processus des agents (`npm run agents`).</p>
            )}
          </Panneau>
          <Panneau titre="Agents" sansMarge action={<Link href="/admin/securite" className="text-sm text-texte-2 hover:text-texte">Détail</Link>}>
            <ul className="grid grid-cols-2 divide-x divide-y divide-filet">
              {agents.agents.map((a) => (
                <li key={a.id} className="flex items-center gap-2.5 px-4 py-3 text-sm">
                  <PointEtat etat={a.actif ? "ok" : a.derniere?.statut === "erreur" ? "erreur" : "attente"} />
                  {a.nom}
                  <span className="sr-only">{a.actif ? "actif" : "inactif"}</span>
                </li>
              ))}
            </ul>
          </Panneau>
        </div>
      </div>

      <Panneau titre="Alertes ouvertes" className="mt-6" sansMarge action={<Link href="/admin/securite" className="text-sm text-texte-2 hover:text-texte">Centre de sécurité</Link>}>
        {ouvertes.length === 0 ? (
          <p className="px-5 py-6 text-sm text-texte-3">Aucune alerte ouverte.</p>
        ) : (
          <ul className="divide-y divide-filet">
            {ouvertes.map((a) => (
              <li key={a.id} className="flex items-center gap-4 px-5 py-3 text-sm">
                <Pastille ton={TON_GRAVITE[a.gravite as keyof typeof TON_GRAVITE] ?? "neutre"}>{a.gravite}</Pastille>
                <span className="flex-1 min-w-0 truncate">{a.titre}</span>
                <span className="text-xs text-texte-3 whitespace-nowrap">{dateFr(a.creeLe)}</span>
              </li>
            ))}
          </ul>
        )}
      </Panneau>
    </>
  );
}
