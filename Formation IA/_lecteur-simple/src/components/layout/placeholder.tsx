import { Hourglass } from "@phosphor-icons/react/ssr";
import { PageHeader, Panel } from "@/components/ui/surface";
import { Badge } from "@/components/ui/badge";

/**
 * Page en attente de développement : garde la navigation fonctionnelle (aucun lien cassé).
 * À REMPLACER intégralement par la fonctionnalité (voir CONVENTIONS.md § « Remplacer un placeholder »).
 */
export function Placeholder({
  title,
  description,
  spec,
  breadcrumb,
  children,
}: {
  title: string;
  description?: string;
  /** Rappel des exigences de la SPEC pour le développeur et le relecteur. */
  spec: string[];
  breadcrumb?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div>
      <PageHeader title={title} description={description} breadcrumb={breadcrumb} actions={<Badge tone="warn">En construction</Badge>} />
      <Panel className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <Hourglass size={28} weight="light" className="mt-1 shrink-0 text-accent" aria-hidden />
          <div className="min-w-0">
            <p className="font-display text-[15px] uppercase tracking-[0.06em] text-ink">Cette page arrive bientôt</p>
            <p className="mt-2 max-w-[60ch] text-[13.5px] text-ink-2">La fondation est en place ; la fonctionnalité est en cours de développement.</p>
            <ul className="mt-5 space-y-2 border-l border-line pl-4 text-[13px] text-ink-2">
              {spec.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            {children ? <div className="mt-6">{children}</div> : null}
          </div>
        </div>
      </Panel>
    </div>
  );
}
