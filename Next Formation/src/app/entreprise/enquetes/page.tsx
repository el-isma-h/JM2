import { guardEmployer } from "@/server/extranet/guard";
import { listSurveys } from "@/server/extranet/queries";
import { openEmployerSurveyAction } from "@/server/actions/employer";
import { NoAttachment } from "@/components/extranet/shell";
import { ActionButton } from "@/components/admin/action-form";
import { Badge } from "@/components/ui/badge";
import { EmptyState, PageHeader, Panel, PanelHeader } from "@/components/ui/surface";
import { Table, Td, Th } from "@/components/ui/table";
import { fmtDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

/** Enquêtes employeur adressées aux contacts de l'entreprise. */
export default async function EmployerSurveys() {
  const ctx = await guardEmployer("/entreprise/enquetes");
  if (!ctx) return <NoAttachment kind="employer" />;
  const rows = await listSurveys(ctx.org.id, { contactIds: ctx.contacts.map((c) => c.id) });
  const contactName = (id: string | null) => {
    const c = ctx.contacts.find((x) => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : "-";
  };
  const pending = rows.filter((r) => !r.response.submittedAt && r.survey.status === "active");
  const done = rows.filter((r) => Boolean(r.response.submittedAt));
  return (
    <>
      <PageHeader title="Enquêtes employeur" description="Votre avis sur la formation suivie par vos salariés et apprentis contribue à l'amélioration continue de l'organisme." />
      <div className="space-y-6">
        <Panel>
          <PanelHeader title="À répondre" />
          {pending.length ? (
            <Table>
              <thead>
                <tr>
                  <Th>Enquête</Th>
                  <Th>Destinataire</Th>
                  <Th>Envoyée le</Th>
                  <Th className="text-right">Action</Th>
                </tr>
              </thead>
              <tbody>
                {pending.map((r) => (
                  <tr key={r.response.id}>
                    <Td className="font-medium text-ink">{r.survey.title}</Td>
                    <Td>{contactName(r.response.contactId)}</Td>
                    <Td className="num">{r.response.sentAt ? fmtDate(r.response.sentAt) : "-"}</Td>
                    <Td className="text-right">
                      <ActionButton action={openEmployerSurveyAction} fields={{ responseId: r.response.id }} label="Répondre" variant="primary" />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState title="Aucune enquête en attente" />
          )}
        </Panel>
        <Panel>
          <PanelHeader title="Répondues" />
          {done.length ? (
            <Table>
              <thead>
                <tr>
                  <Th>Enquête</Th>
                  <Th>Destinataire</Th>
                  <Th>Répondue le</Th>
                  <Th>État</Th>
                </tr>
              </thead>
              <tbody>
                {done.map((r) => (
                  <tr key={r.response.id}>
                    <Td className="font-medium text-ink">{r.survey.title}</Td>
                    <Td>{contactName(r.response.contactId)}</Td>
                    <Td className="num">{fmtDate(r.response.submittedAt)}</Td>
                    <Td>
                      <Badge tone="ok">Réponse reçue</Badge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState title="Aucune réponse enregistrée" />
          )}
        </Panel>
      </div>
    </>
  );
}
