import type { Metadata } from "next";
import Link from "next/link";
import { LockKey } from "@phosphor-icons/react/dist/ssr";
import { FadeIn } from "@/components/ui/motion";
import { DemoEntry } from "@/components/admin/demo-entry";
import { SiteFooter, SiteHeader } from "@/components/marketing/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/demo", "Démonstration instantanée du logiciel de gestion de formation", "Explorez Next Formation sans inscription avec un organisme fictif complet (OF et CFA) : direction, administratif, pédagogie, formateur, finance, qualité, apprenant, entreprise. Données fictives, supprimées après 24 h, aucun e-mail réel.");

/** Huit profils d'entrée : ce que chacun voit, et les limites de ses droits (cahier des charges §8). */
const PROFILS: { as: string; who: string; role: string; sees: string; limits: string; primary?: boolean }[] = [
  { as: "direction", who: "Élise Marchetti", role: "Direction, propriétaire", sees: "Pilotage, tous les dossiers, sécurité, charte institutionnelle, journal d'audit, RIB central.", limits: "Seule à administrer la sécurité et la charte, parce que propriétaire active, pas par cumul de rôles.", primary: true },
  { as: "admin", who: "Karim Benali", role: "Administratif", sees: "Inscriptions, pièces administratives, documents, tâches, finance en lecture.", limits: "Aucune administration de sécurité ; pas de notes pédagogiques." },
  { as: "pedagogy", who: "Nathalie Roussel", role: "Formatrice, responsable d'agence et pédagogique", sees: "Supervision, parcours, groupes, formateurs, examens, blocs internes, consultation financière.", limits: "Sans administration de sécurité ni modification de la charte, malgré le cumul de trois rôles ; pas de gestion du RIB." },
  { as: "trainer", who: "Thomas Lefebvre", role: "Formateur seul", sees: "Ses séances, ses feuilles de période, ses apprenants affectés, son extranet.", limits: "Ni blocs internes, ni pièces administratives, ni finances ; ne peut pas créer sa propre affectation." },
  { as: "finance", who: "Sophie Garnier", role: "Finance", sees: "Financements, factures, règlements, BPF, RIB central.", limits: "Aucune ouverture des CV ni des notes pédagogiques." },
  { as: "quality", who: "Mehdi Ouali", role: "Qualité", sees: "Référentiel, preuves, analyses, actions correctives, veille.", limits: "Preuves et contrôles autorisés uniquement ; pas de finance ni de sécurité." },
  { as: "learner", who: "Inès Carvalho", role: "Apprenante, BTS en alternance", sees: "Son planning, ses documents, son émargement, ses enquêtes, son livret.", limits: "Son propre dossier seulement." },
  { as: "employer", who: "Julien Deschamps", role: "Tuteur en entreprise", sees: "Ses alternants, le suivi en entreprise, conventions et factures de son entreprise.", limits: "Rien d'autre que ses propres salariés en formation." },
];

const CONTENU: [string, string][] = [
  ["Organisme", "Atelier Méridien Formation, organisme de formation et CFA fictif à Paris, charte institutionnelle renseignée."],
  ["Catalogue", "BTS en alternance, titre professionnel, formations courtes et habilitations, programmes versionnés."],
  ["Dossiers", "Sessions en cours et à venir, inscriptions OF et CFA, pièces manquantes, financements avec accord et échéancier."],
  ["À traiter", "Une pièce attendue, une période d'émargement en cours, une convention à régénérer, une analyse qualité à relancer."],
];

export default function DemoPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg text-ink">
      <SiteHeader />
      <main className="flex-1">
        <section className="sombre bg-[#0a0b0d] text-[#f3f0e8]">
          <div className="conteneur grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-20">
            <FadeIn>
              <p className="etiquette">Démonstration instantanée</p>
              <h1 className="mt-5 text-[32px] sm:text-[48px] lg:text-[56px]">Un organisme fictif complet, en quelques secondes.</h1>
              <p className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-[#f3f0e8]/70">Un espace neuf est préparé pour vous seul : Atelier Méridien Formation, organisme de formation et CFA à Paris. Choisissez le profil par lequel vous entrez ; chacun voit ce que son rôle autorise, et rien d&apos;autre.</p>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="flex gap-3 border border-[#f3f0e8]/20 p-4 text-[13.5px] text-[#f3f0e8]/75">
                <LockKey size={18} className="mt-0.5 shrink-0 text-[#c9b8f0]" aria-hidden="true" />
                <p>
                  <span className="font-medium text-[#f3f0e8]">Données fictives, supprimées après 24 h, aucun e-mail réel.</span> Les noms, SIRET et coordonnées bancaires sont inventés ; aucun envoi, aucune signature ni aucune déclaration ne quitte la démonstration.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="conteneur py-14 lg:py-20">
          <h2 className="text-[24px] sm:text-[30px]">Entrer comme</h2>
          <div className="mt-8 grid gap-px border border-line-strong bg-line-strong md:grid-cols-2">
            {PROFILS.map((p, i) => (
              <FadeIn key={p.as} delay={0.04 * i} className="flex h-full flex-col bg-bg p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{p.role}</p>
                <h3 className="mt-2 text-[20px]">{p.who}</h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink">{p.sees}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{p.limits}</p>
                <div className="mt-5 flex-1" />
                <DemoEntry as={p.as} label={`Entrer comme ${p.who.split(" ")[0]}`} primary={p.primary} />
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="border-t border-line bg-bg-sunken">
          <div className="conteneur grid gap-10 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
            <div>
              <h2 className="text-[24px] sm:text-[30px]">Ce que contient l&apos;espace</h2>
              <p className="mt-4 max-w-[46ch] text-[14px] leading-relaxed text-ink-2">Les données sont inventées mais réalistes : noms français variés, chiffres organiques, dossiers à différentes étapes. Pour un parcours avec vos propres données, l&apos;essai gratuit dure quinze jours.</p>
              <Link href="/inscription" className="mt-6 inline-flex min-h-[44px] items-center border border-ink bg-ink px-5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-bg transition-colors hover:border-accent hover:bg-accent">
                Essai gratuit 15 jours
              </Link>
            </div>
            <dl className="border-t border-line-strong">
              {CONTENU.map(([k, v]) => (
                <div key={k} className="grid gap-2 border-b border-line py-4 sm:grid-cols-[120px_1fr] sm:gap-6">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">{k}</dt>
                  <dd className="text-[14px] text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
