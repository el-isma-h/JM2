import type { Metadata } from "next";
import { requireRole } from "@/server/auth";
import { listInvitations, mailEnabled } from "@/server/admin/invitations";
import { invitableRoles } from "@/lib/roles";
import { routes } from "@/lib/paths";
import { PageHeader, Panel, PanelHeader, EmptyState } from "@/components/ui/surface";
import { InvitationList, InviteForm } from "@/components/admin/invitations";

export const metadata: Metadata = { title: "Invitations" };
export const dynamic = "force-dynamic";

export default async function AdminInvitationsPage() {
  const user = await requireRole("admin", "trainer");
  const invitations = await listInvitations();
  const roles = invitableRoles(user.role);
  const mail = mailEnabled();
  return (
    <div>
      <PageHeader
        title="Invitations"
        description="Les comptes se créent uniquement sur invitation. La personne invitée choisit son mot de passe depuis le lien d'activation, valable 14 jours."
        breadcrumb={[{ label: "Administration", href: routes.admin }, { label: "Invitations" }]}
      />
      <div className="grid-cols-1 [&>*]:min-w-0 grid gap-6 xl:grid-cols-[minmax(0,420px)_1fr]">
        <Panel className="self-start">
          <PanelHeader title="Inviter une personne" description={mail ? "Envoi par e-mail activé (Resend)." : "Envoi par e-mail désactivé : RESEND_API_KEY absente."} />
          <div className="px-5 py-5">
            <InviteForm roles={roles} mailEnabled={mail} />
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Suivi" description="Renvoyer génère un nouveau lien et invalide le précédent." />
          {invitations.length ? (
            <InvitationList
              items={invitations.map((i) => ({
                id: i.id,
                email: i.email,
                name: [i.firstName, i.lastName].filter(Boolean).join(" "),
                role: i.role,
                state: i.state,
                createdAt: i.createdAt.toISOString(),
                expiresAt: i.expiresAt.toISOString(),
                acceptedAt: i.acceptedAt?.toISOString() ?? null,
                invitedBy: i.invitedByName,
                canRenew: roles.includes(i.role),
              }))}
            />
          ) : (
            <EmptyState title="Aucune invitation" description="Invitez un premier apprenant avec le formulaire : son lien d'activation s'affichera ici." />
          )}
        </Panel>
      </div>
    </div>
  );
}
