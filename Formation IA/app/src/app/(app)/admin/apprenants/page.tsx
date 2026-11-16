import type { Metadata } from "next";
import Link from "next/link";
import { EnvelopeSimple } from "@phosphor-icons/react/ssr";
import { requireRole } from "@/server/auth";
import { listLearners } from "@/server/admin/queries";
import { PageHeader, Panel, EmptyState } from "@/components/ui/surface";
import { Button } from "@/components/ui/button";
import { LearnersTable } from "@/components/admin/learners-table";
import { routes } from "@/lib/paths";

export const metadata: Metadata = { title: "Apprenants" };
export const dynamic = "force-dynamic";

export default async function AdminApprenantsPage() {
  await requireRole("admin", "trainer");
  const rows = await listLearners({ includeStaff: true });
  return (
    <div>
      <PageHeader
        title="Apprenants"
        description="Recherchez un apprenant, triez par progression ou par dernière activité, puis ouvrez sa fiche pour agir."
        breadcrumb={[{ label: "Administration", href: routes.admin }, { label: "Apprenants" }]}
        actions={
          <Button asChild size="sm">
            <Link href={routes.adminInvitations}>
              <EnvelopeSimple size={14} /> Inviter un apprenant
            </Link>
          </Button>
        }
      />
      <Panel>
        {rows.length ? (
          <LearnersTable
            now={new Date().getTime()}
            rows={rows.map((r) => ({
              id: r.id,
              name: `${r.firstName} ${r.lastName}`.trim(),
              email: r.email,
              role: r.role,
              isDemo: r.isDemo,
              disabled: r.disabled,
              currentLevel: r.currentLevel,
              progress: r.progress,
              seconds: r.seconds,
              lastActivity: r.lastActivity?.toISOString() ?? null,
              certificates: r.certificates,
            }))}
          />
        ) : (
          <EmptyState title="Aucun apprenant" description="Invitez vos premiers apprenants : ils activeront leur compte depuis le lien reçu." />
        )}
      </Panel>
    </div>
  );
}
