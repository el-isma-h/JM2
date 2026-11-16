import Link from "next/link";
import { guardEmployer } from "@/server/extranet/guard";
import { listCompanyInvoices, listPendingSignatures, listSlotsForSessions, listSurveys, listVisibleDocuments } from "@/server/extranet/queries";
import { NoAttachment } from "@/components/extranet/shell";
import { hhmm } from "@/components/extranet/ui";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, Notice, PageHeader, Panel, PanelHeader, Stat } from "@/components/ui/surface";
import { Table, Td, Th } from "@/components/ui/table";
import { fmtDate } from "@/lib/dates";
import { formatCents } from "@/lib/money";
import { todayParis } from "@/lib/time";

export const dynamic = "force-dynamic";

/** Vue d'ensemble entreprise : salariés / apprentis en formation, échéances, documents à signer, factures ouvertes. */
export default async function EmployerHome() {
  const ctx = await guardEmployer("/entreprise");
  if (!ctx) return <NoAttachment kind="employer" />;
  const sessionIds = [...new Set(ctx.enrollments.map((e) => e.session.id))];
  const [docs, invoices, upcoming, surveys] = await Promise.all([
    listVisibleDocuments(ctx.org.id, { enrollmentIds: ctx.enrollmentIds, companyId: ctx.company.id }, ["entreprise", "public"]),
    listCompanyInvoices(ctx.org.id, ctx.company.id),
    listSlotsForSessions(ctx.org.id, sessionIds, { from: todayParis() }),
    listSurveys(ctx.org.id, { contactIds: ctx.contacts.map((c) => c.id) }),
  ]);
  const pendingSign = await listPendingSignatures(ctx.org.id, docs.map((d) => d.id));
  const active = ctx.enrollments.filter((e) => ["inscrit", "en_cours", "preinscrit"].includes(e.enrollment.status));
  const openInvoices = invoices.filter((i) => ["emise", "envoyee", "partiellement_payee", "en_retard"].includes(i.status));
  const due = openInvoices.reduce((a, i) => a + (i.totalTtcCents - i.paidCents), 0);
  const pendingSurveys = surveys.filter((s) => !s.response.submittedAt && s.survey.status === "active");
  const nextSlots = upcoming.filter((s) => s.slot.status !== "annulee").slice(0, 6);

  return (
    <>
      <PageHeader title={ctx.company.name} description={`Espace entreprise auprès de ${ctx.org.tradeName ?? ctx.org.legalName} : vos salariés et apprentis en formation, documents à signer, factures et suivi.`} />

      <div className="mb-8 space-y-3">
        {pendingSign.length ? (
          <Notice tone="warn" title={`${pendingSign.length} document${pendingSign.length > 1 ? "s" : ""} en attente de signature`}>
            <Link href="/entreprise/documents" className="font-medium underline underline-offset-4">
              Voir les documents à signer
            </Link>
          </Notice>
        ) : null}
        {pendingSurveys.length ? (
          <Notice tone="info" title={`${pendingSurveys.length} enquête${pendingSurveys.length > 1 ? "s" : ""} employeur en attente`}>
            <Link href="/entreprise/enquetes" className="font-medium underline underline-offset-4">
              Répondre
            </Link>
          </Notice>
        ) : null}
      </div>

      <Panel className="mb-6">
        <div className="grid grid-cols-2 gap-6 px-5 py-5 sm:grid-cols-4">
          <Stat label="En formation" value={<span className="num">{active.length}</span>} hint="inscriptions actives" />
          <Stat label="À signer" value={<span className="num">{pendingSign.length}</span>} hint="documents" />
          <Stat label="Factures ouvertes" value={<span className="num">{openInvoices.length}</span>} hint={openInvoices.length ? `reste dû ${formatCents(due)}` : "aucun reste dû"} />
          <Stat label="Prochaines séances" value={<span className="num">{upcoming.length}</span>} hint="toutes sessions" />
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader
            title="Nos apprenants"
            actions={
              <Button asChild variant="secondary" size="sm">
                <Link href="/entreprise/apprenants">Détail et assiduité</Link>
              </Button>
            }
          />
          {ctx.enrollments.length ? (
            <Table>
              <thead>
                <tr>
                  <Th>Apprenant</Th>
                  <Th>Formation</Th>
                  <Th>Période</Th>
                  <Th>Inscription</Th>
                  <Th>Progression</Th>
                </tr>
              </thead>
              <tbody>
                {ctx.enrollments.map((e) => (
                  <tr key={e.enrollment.id}>
                    <Td>
                      <Link href={`/entreprise/apprenants/${e.enrollment.id}`} className="font-medium text-ink hover:underline">
                        {e.person.firstName} {e.person.lastName}
                      </Link>
                    </Td>
                    <Td>
                      {e.program?.title ?? e.session.title}
                      <span className="block text-[12px] text-ink-3">Session {e.session.code}</span>
                    </Td>
                    <Td className="num whitespace-nowrap">
                      {fmtDate(e.enrollment.startDate ?? e.session.startDate)} au {fmtDate(e.enrollment.endDate ?? e.session.endDate)}
                    </Td>
                    <Td>
                      <StatusBadge status={e.enrollment.status} />
                    </Td>
                    <Td>
                      <StatusBadge status={e.enrollment.progression} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState title="Aucun apprenant rattaché" description="Aucune inscription n'est rattachée à votre entreprise pour le moment." />
          )}
        </Panel>

        <Panel>
          <PanelHeader title="Prochaines échéances" description="Séances à venir de vos apprenants" />
          {nextSlots.length ? (
            <ul className="divide-y divide-line">
              {nextSlots.map((s) => (
                <li key={s.slot.id} className="px-5 py-3">
                  <p className="num text-[12px] text-ink-3">{fmtDate(s.slot.date, "EEEE d MMMM")}</p>
                  <p className="text-[13.5px] font-medium text-ink">{s.sessionTitle}</p>
                  <p className="text-[12.5px] text-ink-2">{s.periods.map((p) => `${hhmm(p.startTime)} - ${hhmm(p.endTime)}`).join(" · ") || "horaires à préciser"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Aucune séance à venir" />
          )}
        </Panel>
      </div>
    </>
  );
}
