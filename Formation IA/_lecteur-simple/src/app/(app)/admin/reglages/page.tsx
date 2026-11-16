import type { Metadata } from "next";
import { requireRole } from "@/server/auth";
import { getFlatLessons } from "@/content";
import { getPlatformKey, statusOf } from "@/server/ai/keys";
import { fakeProviderEnabled } from "@/server/ai/client";
import { mailEnabled } from "@/server/admin/invitations";
import { deletePlatformKeyAction, savePlatformKeyAction, testPlatformKeyAction } from "@/server/actions/ai-key";
import { AI_PROVIDERS, PROVIDERS, maskKey, resolveCredentials, resolveModel, SOURCE_LABELS } from "@/lib/ai";
import { routes } from "@/lib/paths";
import { PageHeader, Panel, PanelHeader, Notice } from "@/components/ui/surface";
import { Badge } from "@/components/ui/badge";
import { KeyForm } from "@/components/ai-key/key-form";
import { EnvKeyTest, TutorPreview } from "@/components/admin/settings";

export const metadata: Metadata = { title: "Réglages" };
export const dynamic = "force-dynamic";

/** Réservé aux administrateurs (le formateur reçoit une 404). */
export default async function AdminReglagesPage() {
  await requireRole("admin");
  const platform = await getPlatformKey();
  const status = statusOf(platform);
  const effective = resolveCredentials({ platform, env: process.env });
  const lessons = getFlatLessons().map((l) => ({ id: l.id, title: l.title }));

  return (
    <div>
      <PageHeader title="Réglages" description="Clé IA utilisée par le tuteur pour les apprenants qui n'ont pas la leur, et état des services de la plateforme." breadcrumb={[{ label: "Administration", href: routes.admin }, { label: "Réglages" }]} />

      <Panel>
        <PanelHeader title="Quelle clé le tuteur utilise" description="Pour chaque question, la première clé disponible dans cet ordre." />
        <ol className="grid gap-px bg-line sm:grid-cols-3">
          {(["personal", "env", "platform"] as const).map((s, i) => (
            <li key={s} className="bg-bg-elev px-5 py-4">
              <p className="num text-[12px] text-ink-3">{i + 1}</p>
              <p className="mt-1 text-[14px] text-ink">{SOURCE_LABELS[s]}</p>
              <p className="mt-1 text-[12.5px] text-ink-2">
                {s === "personal"
                  ? "Enregistrée par l'apprenant sur la page Clé API."
                  : s === "platform"
                    ? status.configured
                      ? `${PROVIDERS[status.provider].company} · ${status.masked} (utilisée si aucune variable d'environnement n'est définie)`
                      : "Aucune clé enregistrée ci-dessous."
                    : "ANTHROPIC_API_KEY, puis OPENAI_API_KEY, puis XAI_API_KEY."}
              </p>
            </li>
          ))}
        </ol>
        <div className="border-t border-line px-5 py-4">
          {effective ? (
            <p className="text-[13.5px] text-ink-2">
              Sans clé personnelle, les apprenants utilisent : <span className="text-ink">{SOURCE_LABELS[effective.source]}</span> ({PROVIDERS[effective.provider].company}, <span className="num">{effective.model}</span>).
            </p>
          ) : (
            <p className="text-[13.5px] text-warn-ink">Aucune clé serveur ni clé de plateforme : seuls les apprenants ayant enregistré leur propre clé peuvent utiliser le tuteur.</p>
          )}
          {fakeProviderEnabled() ? <p className="mt-2 text-[12.5px] text-info-ink">Mode simulation actif (AI_FAKE_PROVIDER=true) : aucune requête n&apos;est envoyée aux fournisseurs.</p> : null}
        </div>
      </Panel>

      <div className="grid-cols-1 [&>*]:min-w-0 mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel>
          <PanelHeader title="Clé de la plateforme" description="Enregistrée chiffrée en base (AES-256-GCM avec APP_SECRET), jamais réaffichée en clair. Utilisée seulement si aucune variable d'environnement ANTHROPIC_API_KEY / OPENAI_API_KEY / XAI_API_KEY n'est définie." />
          <div className="px-5 py-5">
            <KeyForm
              status={status.configured ? { ...status, updatedAt: status.updatedAt?.toISOString() ?? null } : status}
              saveAction={savePlatformKeyAction}
              testAction={testPlatformKeyAction}
              deleteAction={deletePlatformKeyAction}
              submitLabel="Tester et enregistrer"
            />
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Variables d'environnement" description="Définies sur le serveur (fichier .env ou docker-compose), prioritaires sur la clé de la plateforme. Modifiables uniquement par redéploiement." />
            <ul className="divide-y divide-line">
              {AI_PROVIDERS.map((p) => {
                const info = PROVIDERS[p];
                const key = process.env[info.envKey]?.trim();
                return (
                  <li key={p} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                    <div className="min-w-0">
                      <p className="text-[14px] text-ink">
                        {info.company} <span className="num ml-1 text-[12px] text-ink-3">{info.envKey}</span>
                      </p>
                      <p className="mt-1 text-[12.5px] text-ink-2">
                        {key ? <span className="num">{maskKey(key)}</span> : "Non définie"} · modèle <span className="num">{resolveModel(p, null, process.env)}</span>
                        {process.env[info.envModel] ? <span className="text-ink-3"> ({info.envModel})</span> : null}
                      </p>
                    </div>
                    {key ? <EnvKeyTest provider={p} /> : <Badge>Absente</Badge>}
                  </li>
                );
              })}
            </ul>
          </Panel>
          <Panel>
            <PanelHeader title="E-mails d'invitation" />
            <div className="px-5 py-4">
              {mailEnabled() ? (
                <Notice tone="ok">Resend est configuré (RESEND_API_KEY). Expéditeur : {process.env.MAIL_FROM || "onboarding@resend.dev (par défaut)"}.</Notice>
              ) : (
                <Notice tone="info">Envoi désactivé : définissez RESEND_API_KEY et MAIL_FROM. En attendant, le lien d&apos;activation s&apos;affiche dans Invitations pour être copié.</Notice>
              )}
            </div>
          </Panel>
        </div>
      </div>

      <Panel className="mt-6">
        <PanelHeader title="Essayer le tuteur" description="Ouvrez le tuteur sur n'importe quelle leçon pour vérifier la clé active et la qualité des réponses." />
        <div className="px-5 py-5">
          <TutorPreview lessons={lessons} />
        </div>
      </Panel>
    </div>
  );
}
