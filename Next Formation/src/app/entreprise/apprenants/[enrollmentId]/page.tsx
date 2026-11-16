import Link from "next/link";
import { notFound } from "next/navigation";
import { guardEmployer } from "@/server/extranet/guard";
import { attendanceForEnrollment, listCompanyFollowups, listRecordEntries, nextSlotForSessions } from "@/server/extranet/queries";
import { addCompanyCommentAction } from "@/server/actions/employer";
import { NoAttachment } from "@/components/extranet/shell";
import { HoursStats, hhmm, partLabels, recordKindLabels } from "@/components/extranet/ui";
import { FormDialog } from "@/components/admin/form-dialog";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Field, Input, Textarea } from "@/components/ui/field";
import { EmptyState, KeyValue, PageHeader, Panel, PanelHeader } from "@/components/ui/surface";
import { Table, Td, Th } from "@/components/ui/table";
import { fmtDate } from "@/lib/dates";
import { fmtMinutes } from "@/lib/time";

export const dynamic = "force-dynamic";

const followupLabels: Record<string, string> = { visite: "Visite en entreprise", appel: "Appel", visio: "Visio", bilan_intermediaire: "Bilan intermédiaire", bilan_final: "Bilan final", echange_tuteur: "Échange avec le tuteur", incident: "Incident" };

/** Détail d'un apprenant de l'entreprise : assiduité, livret visible entreprise, suivis, commentaire du tuteur. */
export default async function EmployerLearnerDetail({ params }: { params: Promise<{ enrollmentId: string }> }) {
  const { enrollmentId } = await params;
  const ctx = await guardEmployer(`/entreprise/apprenants/${enrollmentId}`);
  if (!ctx) return <NoAttachment kind="employer" />;
  const e = ctx.enrollments.find((x) => x.enrollment.id === enrollmentId);
  if (!e) notFound();
  const [{ rows, hours }, entries, followups, next] = await Promise.all([
    attendanceForEnrollment(ctx.org.id, e.enrollment.id, e.enrollment.hoursPlanned, e.enrollment.legacyHours),
    listRecordEntries(ctx.org.id, [e.enrollment.id], "company"),
    listCompanyFollowups(ctx.org.id, [e.enrollment.id]),
    nextSlotForSessions(ctx.org.id, [e.session.id]),
  ]);
  const absences = rows.filter((r) => r.attendance.status === "absent" || r.attendance.status === "absent_justifie");
  const tutor = e.enrollment.tutorContactId ? ctx.contacts.find((c) => c.id === e.enrollment.tutorContactId) : null;

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Nos apprenants", href: "/entreprise/apprenants" }, { label: `${e.person.firstName} ${e.person.lastName}` }]}
        title={`${e.person.firstName} ${e.person.lastName}`}
        description={`${e.program?.title ?? e.session.title} · session ${e.session.code}`}
        actions={
          <FormDialog action={addCompanyCommentAction} trigger="Ajouter un commentaire au livret" title="Commentaire d'entreprise" description="Observation du tuteur, partagée avec l'équipe pédagogique et l'apprenant." submitLabel="Ajouter">
            <input type="hidden" name="enrollmentId" value={e.enrollment.id} />
            <Field label="Titre" required htmlFor="c-title">
              <Input id="c-title" name="title" required maxLength={120} placeholder="Ex. Point d'étape sur les missions confiées" />
            </Field>
            <Field label="Commentaire" required htmlFor="c-body" help="Restez factuel : activités réalisées, compétences observées, points d'attention.">
              <Textarea id="c-body" name="body" required maxLength={4000} />
            </Field>
          </FormDialog>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel>
            <PanelHeader title="Assiduité" description="Compteurs distincts, jamais additionnés." />
            <HoursStats hours={hours} />
            {absences.length ? (
              <Table className="border-t border-line">
                <thead>
                  <tr>
                    <Th>Date</Th>
                    <Th>Période</Th>
                    <Th>Présence</Th>
                  </tr>
                </thead>
                <tbody>
                  {absences.map((r) => (
                    <tr key={r.attendance.id}>
                      <Td className="num">{fmtDate(r.slotDate)}</Td>
                      <Td className="num">
                        {partLabels[r.period.part] ?? r.period.part} {hhmm(r.period.startTime)} - {hhmm(r.period.endTime)}
                      </Td>
                      <Td>
                        <StatusBadge status={r.attendance.status} />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="border-t border-line px-5 py-4 text-[13px] text-ink-2">Aucune absence enregistrée.</p>
            )}
          </Panel>

          <Panel>
            <PanelHeader title="Livret (entrées partagées avec l'entreprise)" />
            {entries.length ? (
              <ol className="divide-y divide-line">
                {entries.map((r) => (
                  <li key={r.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="num text-[12px] text-ink-3">{fmtDate(r.date)}</span>
                      <Badge tone={r.kind === "entreprise" ? "info" : "neutral"}>{recordKindLabels[r.kind] ?? r.kind}</Badge>
                      <span className="font-medium text-ink">{r.title}</span>
                    </div>
                    {r.body ? <p className="mt-2 whitespace-pre-line text-[13.5px] text-ink-2">{r.body}</p> : null}
                    {r.authorRole ? <p className="mt-2 text-[11.5px] text-ink-3">{r.authorRole}</p> : null}
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState title="Aucune entrée partagée" description="L'équipe pédagogique partage ici les objectifs et bilans visibles par l'entreprise." />
            )}
          </Panel>

          <Panel>
            <PanelHeader title="Suivi en entreprise" description="Échanges entre l'organisme et le tuteur." />
            {followups.length ? (
              <ol className="divide-y divide-line">
                {followups.map((f) => (
                  <li key={f.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="num text-[12px] text-ink-3">{fmtDate(f.date)}</span>
                      <Badge>{followupLabels[f.kind] ?? f.kind}</Badge>
                    </div>
                    <p className="mt-2 text-[13.5px] text-ink">{f.summary}</p>
                    {f.actions ? <p className="mt-1 text-[13px] text-ink-2">Actions : {f.actions}</p> : null}
                    {f.nextDate ? <p className="num mt-1 text-[12px] text-ink-3">Prochain point : {fmtDate(f.nextDate)}</p> : null}
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState title="Aucun suivi enregistré" />
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Inscription" />
            <div className="px-5 py-5">
              <KeyValue
                items={[
                  { k: "Statut", v: <StatusBadge status={e.enrollment.status} /> },
                  { k: "Progression", v: <StatusBadge status={e.enrollment.progression} /> },
                  { k: "Contrat", v: e.enrollment.contractKind.replace(/_/g, " ") },
                  { k: "Période", v: `${fmtDate(e.enrollment.startDate ?? e.session.startDate)} au ${fmtDate(e.enrollment.endDate ?? e.session.endDate)}` },
                  { k: "Heures prévues", v: <span className="num">{fmtMinutes(hours.planned)}</span> },
                  { k: "Tuteur", v: tutor ? `${tutor.firstName} ${tutor.lastName}` : "non désigné" },
                  { k: "Prochaine séance", v: next ? fmtDate(next.slot.date, "EEEE d MMMM") : "-" },
                ]}
              />
              <Link href="/entreprise/documents" className="mt-4 block text-[13px] text-accent underline-offset-4 hover:underline">
                Documents et conventions
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
