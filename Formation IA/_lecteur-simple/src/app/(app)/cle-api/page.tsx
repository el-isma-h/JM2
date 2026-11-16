import type { Metadata } from "next";
import { Eye, Gauge, LockKey, ProhibitInset } from "@phosphor-icons/react/ssr";
import { requireUser } from "@/server/auth";
import { credentialsFor, getPersonalKey, statusOf } from "@/server/ai/keys";
import { deletePersonalKeyAction, savePersonalKeyAction, testPersonalKeyAction } from "@/server/actions/ai-key";
import { PROVIDERS, SOURCE_LABELS } from "@/lib/ai";
import { PageHeader, Panel, PanelHeader, Notice } from "@/components/ui/surface";
import { FadeIn } from "@/components/ui/motion";
import { ApiKeyGuide, CostEstimator } from "@/components/ai-key/guide";
import { KeyForm } from "@/components/ai-key/key-form";

export const metadata: Metadata = { title: "Configurer une clé API" };
export const dynamic = "force-dynamic";

const RULES = [
  { icon: ProhibitInset, title: "Ne la partagez jamais", body: "Ni par e-mail, ni dans un document, ni dans une capture d'écran. Quiconque possède la clé dépense votre crédit. Personne de Next Formation ne vous la demandera." },
  { icon: Gauge, title: "Limitez les dépenses", body: "Gardez un crédit prépayé modeste, désactivez la recharge automatique ou fixez un plafond mensuel dans la console du fournisseur." },
  { icon: LockKey, title: "Une clé par usage", body: "Créez une clé dédiée « Next Formation » : vous pourrez la couper sans toucher à vos autres outils." },
  { icon: Eye, title: "Révoquez au moindre doute", body: "Clé exposée, ordinateur perdu, fin de formation : supprimez-la ici puis révoquez-la dans la console. Une nouvelle clé se crée en une minute." },
];

export default async function CleApiPage() {
  const user = await requireUser();
  const [personal, effective] = await Promise.all([getPersonalKey(user.id), credentialsFor(user.id)]);
  const status = statusOf(personal);
  const platformCovers = effective && effective.source !== "personal";

  return (
    <div>
      <PageHeader
        title="Configurer une clé API"
        description="Le tuteur IA de chaque leçon fonctionne avec une clé API Claude (Anthropic), GPT (OpenAI) ou Grok (xAI). Une seule suffit. Comptez cinq minutes et quelques euros de crédit, qui durent des mois."
        breadcrumb={[{ label: "Tableau de bord", href: "/" }, { label: "Clé API" }]}
      />

      {platformCovers ? (
        <Notice tone="ok" className="mb-8" title="Le tuteur est déjà disponible pour vous">
          {SOURCE_LABELS[effective.source]} est active ({PROVIDERS[effective.provider].company}). Ajouter votre propre clé reste possible : elle sera utilisée en priorité (ordre : votre clé personnelle, puis la clé du serveur, puis la clé de la plateforme) et vous apprendrez à la gérer, une compétence du programme.
        </Notice>
      ) : null}

      <FadeIn>
        <section aria-labelledby="guide-titre">
          <h2 id="guide-titre" className="mb-4 text-[19px] text-ink">
            Obtenir une clé
          </h2>
          <ApiKeyGuide />
        </section>
      </FadeIn>

      <div className="grid-cols-1 [&>*]:min-w-0 mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Panel>
          <PanelHeader title="Combien ça coûte" description="Vous payez à l'usage, au nombre de tokens (≈ syllabes) lus et écrits par le modèle." />
          <div className="px-5 py-5">
            <CostEstimator />
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Règles de sécurité" description="Une clé API est un moyen de paiement : traitez-la comme un code de carte bancaire." />
          <ul className="divide-y divide-line">
            {RULES.map((r) => (
              <li key={r.title} className="flex gap-4 px-5 py-4">
                <r.icon size={22} weight="light" className="mt-0.5 shrink-0 text-accent" aria-hidden />
                <div>
                  <p className="text-[14px] text-ink">{r.title}</p>
                  <p className="mt-1 text-[13px] text-ink-2">{r.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel className="mt-10 scroll-mt-24" id="enregistrer">
        <PanelHeader title="Enregistrer ma clé" description="La clé est testée par un appel minimal (quelques tokens), puis chiffrée en AES-256-GCM. Elle ne quitte plus le serveur et ne sera jamais réaffichée." />
        <div className="max-w-[640px] px-5 py-6">
          <KeyForm
            status={status.configured ? { ...status, updatedAt: status.updatedAt?.toISOString() ?? null } : status}
            saveAction={savePersonalKeyAction}
            testAction={testPersonalKeyAction}
            deleteAction={deletePersonalKeyAction}
            disabledReason={user.isDemo ? "Le compte démo ne peut pas enregistrer de clé : connectez-vous avec votre propre compte pour configurer la vôtre." : undefined}
          />
        </div>
      </Panel>
    </div>
  );
}
