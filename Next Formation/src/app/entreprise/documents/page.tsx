import { guardEmployer } from "@/server/extranet/guard";
import { listPendingSignatures, listPieces, listVisibleDocuments } from "@/server/extranet/queries";
import { openSignatureAction, uploadCompanyPieceAction } from "@/server/actions/employer";
import { UploadDialog } from "@/components/extranet/upload-dialog";
import { NoAttachment } from "@/components/extranet/shell";
import { DocumentTable, categoryLabels } from "@/components/extranet/ui";
import { ActionButton } from "@/components/admin/action-form";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, PageHeader, Panel, PanelHeader } from "@/components/ui/surface";
import { Table, Td, Th } from "@/components/ui/table";
import { fmtDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

/** Conventions, contrats, attestations (visibilité `entreprise`) et signatures en attente pour un contact de l'entreprise. */
export default async function EmployerDocuments() {
  const ctx = await guardEmployer("/entreprise/documents");
  if (!ctx) return <NoAttachment kind="employer" />;
  const docs = await listVisibleDocuments(ctx.org.id, { enrollmentIds: ctx.enrollmentIds, companyId: ctx.company.id }, ["entreprise", "public"]);
  const [pending, pieces] = await Promise.all([listPendingSignatures(ctx.org.id, docs.map((d) => d.id)), listPieces(ctx.org.id, ctx.enrollmentIds, ["entreprise"])]);
  const personName = (enrollmentId: string) => {
    const e = ctx.enrollments.find((x) => x.enrollment.id === enrollmentId);
    return e ? `${e.person.firstName} ${e.person.lastName}` : "Apprenant";
  };
  const emails = new Set([ctx.user.email.toLowerCase(), ...(ctx.contact?.email ? [ctx.contact.email.toLowerCase()] : [])]);
  const byDoc = new Map(docs.map((d) => [d.id, d]));
  const byEnrollment = ctx.enrollments.map((e) => ({ e, docs: docs.filter((d) => d.enrollmentId === e.enrollment.id) }));
  const companyDocs = docs.filter((d) => !d.enrollmentId);

  return (
    <>
      <PageHeader title="Documents et conventions" description="Conventions, contrats et attestations mis à disposition de votre entreprise. Un document généré n'est jamais considéré comme signé : la signature se fait via le lien personnel ci-dessous." />
      <div className="space-y-6">
        <Panel>
          <PanelHeader title="Signatures en attente" description="Demandes adressées à un contact de votre entreprise." />
          {pending.length ? (
            <Table>
              <thead>
                <tr>
                  <Th>Document</Th>
                  <Th>Signataires</Th>
                  <Th>État</Th>
                  <Th>Expire</Th>
                  <Th className="text-right">Action</Th>
                </tr>
              </thead>
              <tbody>
                {pending.map((r) => {
                  const doc = byDoc.get(r.documentId);
                  const signers = (Array.isArray(r.signers) ? r.signers : []) as { name?: string; email?: string; signedAt?: string | null }[];
                  const mine = signers.some((s) => s.email && emails.has(s.email.toLowerCase()) && !s.signedAt);
                  return (
                    <tr key={r.id}>
                      <Td className="font-medium text-ink">{doc?.title ?? "Document"}</Td>
                      <Td>
                        <ul className="text-[12.5px]">
                          {signers.map((s, i) => (
                            <li key={i}>
                              {s.name ?? s.email} {s.signedAt ? <span className="text-ok-ink">(signé)</span> : <span className="text-ink-3">(en attente)</span>}
                            </li>
                          ))}
                        </ul>
                      </Td>
                      <Td>
                        <StatusBadge status={r.status} />
                      </Td>
                      <Td className="num">{r.expiresAt ? fmtDate(r.expiresAt) : "-"}</Td>
                      <Td className="text-right">
                        {mine ? <ActionButton action={openSignatureAction} fields={{ requestId: r.id }} label="Signer" variant="primary" /> : <span className="text-[12.5px] text-ink-3">Signature attendue d&apos;un autre contact</span>}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <EmptyState title="Aucune signature en attente" />
          )}
        </Panel>

        <Panel>
          <PanelHeader title="Pièces attendues de votre entreprise" description="Pièces que l&apos;organisme attend de l&apos;employeur (ex. CERFA signé, attestation). Une pièce déposée est contrôlée par l&apos;équipe administrative." />
          {pieces.length ? (
            <Table>
              <thead>
                <tr>
                  <Th>Pièce</Th>
                  <Th>Apprenant</Th>
                  <Th>État</Th>
                  <Th>Échéance</Th>
                  <Th className="text-right">Action</Th>
                </tr>
              </thead>
              <tbody>
                {pieces.map((r) => (
                  <tr key={r.submission.id}>
                    <Td>
                      <span className="font-medium text-ink">{r.piece.label}</span>
                      {r.submission.status === "refusee" && r.submission.refusalReason ? <span className="mt-1 block text-[12.5px] text-danger-ink">Motif du refus : {r.submission.refusalReason}</span> : null}
                    </Td>
                    <Td>{personName(r.submission.enrollmentId)}</Td>
                    <Td>
                      <StatusBadge status={r.submission.status} />
                    </Td>
                    <Td className="num">{r.submission.dueDate ? fmtDate(r.submission.dueDate) : "-"}</Td>
                    <Td className="text-right">
                      {r.submission.status === "acceptee" || r.submission.status === "non_applicable" ? (
                        <span className="text-[12.5px] text-ink-3">Rien à faire</span>
                      ) : (
                        <UploadDialog action={uploadCompanyPieceAction} trigger={r.submission.status === "deposee" ? "Remplacer" : "Déposer"} triggerVariant={r.submission.status === "deposee" ? "secondary" : "primary"} title={r.piece.label} description={r.piece.description ?? "Le fichier est transmis à l'organisme pour contrôle."} fields={{ submissionId: r.submission.id }} />
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState title="Aucune pièce attendue de votre entreprise" />
          )}
        </Panel>

        {byEnrollment.map(({ e, docs }) => (
          <Panel key={e.enrollment.id}>
            <PanelHeader title={`${e.person.firstName} ${e.person.lastName}`} description={`${e.program?.title ?? e.session.title} · session ${e.session.code}`} />
            <DocumentTable docs={docs} downloadBase="/entreprise/documents" emptyTitle="Aucun document" emptyDescription="Aucun document n'a encore été transmis pour cette inscription." />
          </Panel>
        ))}

        <Panel>
          <PanelHeader title="Documents de l'entreprise" description={companyDocs.length ? companyDocs.map((d) => categoryLabels[d.category] ?? d.category).filter((v, i, a) => a.indexOf(v) === i).join(", ") : undefined} />
          <DocumentTable docs={companyDocs} downloadBase="/entreprise/documents" emptyTitle="Aucun document d'entreprise" emptyDescription="Conventions cadres et attestations globales apparaîtront ici." />
        </Panel>
      </div>
    </>
  );
}
