import { guardEmployer } from "@/server/extranet/guard";
import { listCompanyInvoices } from "@/server/extranet/queries";
import { db, schema } from "@/db";
import { and, eq } from "drizzle-orm";
import { NoAttachment } from "@/components/extranet/shell";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, Notice, PageHeader, Panel, PanelHeader, Stat } from "@/components/ui/surface";
import { Table, Td, Th } from "@/components/ui/table";
import { fmtDate } from "@/lib/dates";
import { formatCents } from "@/lib/money";

export const dynamic = "force-dynamic";

const kindLabels: Record<string, string> = { facture: "Facture", avoir: "Avoir", acompte: "Acompte", proforma: "Pro forma" };

/** Factures adressées à l'entreprise (`invoices.companyId`) : statut, PDF, paiement en ligne si l'organisme l'a configuré. */
export default async function EmployerInvoices() {
  const ctx = await guardEmployer("/entreprise/factures");
  if (!ctx) return <NoAttachment kind="employer" />;
  const invoices = await listCompanyInvoices(ctx.org.id, ctx.company.id);
  const [stripe] = await db
    .select({ status: schema.orgIntegrations.status })
    .from(schema.orgIntegrations)
    .where(and(eq(schema.orgIntegrations.orgId, ctx.org.id), eq(schema.orgIntegrations.kind, "stripe")))
    .limit(1);
  const onlinePayment = stripe?.status === "connectee";
  const open = invoices.filter((i) => ["emise", "envoyee", "partiellement_payee", "en_retard"].includes(i.status));
  const due = open.reduce((a, i) => a + (i.totalTtcCents - i.paidCents), 0);
  const late = open.filter((i) => i.status === "en_retard");

  return (
    <>
      <PageHeader title="Factures" description="Factures et avoirs émis à votre entreprise. Les montants sont en euros TTC ; la TVA formation peut être exonérée (mention portée sur la facture)." />
      <Panel className="mb-6">
        <div className="grid grid-cols-2 gap-6 px-5 py-5 sm:grid-cols-3">
          <Stat label="Reste dû" value={<span className="num">{formatCents(due)}</span>} hint={`${open.length} facture${open.length > 1 ? "s" : ""} ouverte${open.length > 1 ? "s" : ""}`} />
          <Stat label="En retard" value={<span className="num">{late.length}</span>} />
          <Stat label="Paiement en ligne" value={onlinePayment ? "Disponible" : "Non proposé"} hint={onlinePayment ? "via l'organisme" : "virement selon les conditions de la facture"} />
        </div>
      </Panel>
      {late.length ? (
        <Notice tone="danger" className="mb-6" title="Factures en retard de règlement">
          Merci de régulariser {late.map((i) => i.number ?? "").filter(Boolean).join(", ")} ou de contacter l&apos;organisme.
        </Notice>
      ) : null}
      <Panel>
        <PanelHeader title={`${invoices.length} document${invoices.length > 1 ? "s" : ""}`} />
        {invoices.length ? (
          <Table>
            <thead>
              <tr>
                <Th>Numéro</Th>
                <Th>Type</Th>
                <Th>Émise le</Th>
                <Th>Échéance</Th>
                <Th num>Montant TTC</Th>
                <Th num>Réglé</Th>
                <Th>État</Th>
                <Th className="text-right">PDF</Th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id}>
                  <Td className="num font-medium text-ink">{i.number ?? "-"}</Td>
                  <Td>{kindLabels[i.kind] ?? i.kind}</Td>
                  <Td className="num">{fmtDate(i.issueDate)}</Td>
                  <Td className="num">{i.dueDate ? fmtDate(i.dueDate) : "-"}</Td>
                  <Td num>{formatCents(i.totalTtcCents)}</Td>
                  <Td num>{formatCents(i.paidCents)}</Td>
                  <Td>
                    <StatusBadge status={i.status} />
                  </Td>
                  <Td className="text-right">
                    {i.documentId ? (
                      <Button asChild variant="secondary" size="sm">
                        <a href={`/entreprise/documents/${i.documentId}/telecharger`}>Télécharger</a>
                      </Button>
                    ) : (
                      <span className="text-[12.5px] text-ink-3">PDF non généré</span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState title="Aucune facture" description="Aucune facture n'a été émise à votre entreprise." />
        )}
      </Panel>
    </>
  );
}
