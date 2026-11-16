import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Key } from "@phosphor-icons/react/ssr";
import { requireUser } from "@/server/auth";
import { routes } from "@/lib/paths";
import { initials } from "@/lib/utils";
import { PageHeader, Panel, Notice } from "@/components/ui/surface";
import { StatusBadge } from "@/components/ui/badge";
import { DailyGoalChoice, NameForm, PasswordForm, ThemeChoice } from "@/components/profil/profile-forms";
import { ApiKeyProfileStatus } from "@/components/ai-key/profile-status";

export const metadata: Metadata = { title: "Profil" };

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-5 border-t border-line py-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-10">
      <div>
        <h2 id={id} className="text-[15px] text-ink">
          {title}
        </h2>
        {description ? <p className="mt-2 text-[12.5px] text-ink-3">{description}</p> : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default async function ProfilPage() {
  const user = await requireUser();
  return (
    <div>
      <PageHeader title="Profil" description="Vos informations, votre rythme et l'apparence de l'application." />

      <div className="mb-8 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center border border-line-strong font-mono text-[15px] text-ink">{initials(user.firstName, user.lastName)}</span>
        <div className="min-w-0">
          <p className="text-[15px] text-ink">
            {user.firstName} {user.lastName}
          </p>
          <p className="truncate font-mono text-[11px] text-ink-3">{user.email}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <StatusBadge status={user.role} />
          {user.isDemo ? <StatusBadge status="demo" /> : null}
        </div>
      </div>

      {user.isDemo ? (
        <Notice tone="info" title="Compte démo" className="mb-2">
          Ce compte est partagé : le nom et le mot de passe ne peuvent pas être modifiés. L&apos;objectif quotidien et le thème restent réglables.
        </Notice>
      ) : null}

      <Section id="objectif" title="Objectif quotidien" description="Les XP à gagner chaque jour pour entretenir votre série. Une leçon terminée rapporte 20 XP.">
        <DailyGoalChoice value={user.dailyGoalXp} />
      </Section>

      <Section id="theme" title="Thème" description="Enregistré sur cet appareil.">
        <ThemeChoice />
      </Section>

      <Section id="identite" title="Nom" description="Affiché sur le tableau de bord et dans le menu.">
        <NameForm firstName={user.firstName} lastName={user.lastName} locked={user.isDemo} />
      </Section>

      <Section id="mot-de-passe" title="Mot de passe" description="Changer le mot de passe ferme vos sessions sur les autres appareils.">
        <PasswordForm locked={user.isDemo} />
      </Section>

      <Section id="cle-api" title="Clé API" description="Pour utiliser le tuteur IA avec votre propre compte Anthropic, OpenAI ou xAI.">
        <Panel className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Key size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden />
            <ApiKeyProfileStatus userId={user.id} />
          </div>
          <Link href={routes.apiKey} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent hover:underline">
            Configurer une clé API <ArrowRight size={12} aria-hidden />
          </Link>
        </Panel>
      </Section>
    </div>
  );
}
