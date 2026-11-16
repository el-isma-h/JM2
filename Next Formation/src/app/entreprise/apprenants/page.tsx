import Link from "next/link";
import { guardEmployer } from "@/server/extranet/guard";
import { attendanceForEnrollment, nextSlotForSessions } from "@/server/extranet/queries";
import { NoAttachment } from "@/components/extranet/shell";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, PageHeader, Panel, PanelHeader } from "@/components/ui/surface";
import { Table, Td, Th } from "@/components/ui/table";
import { fmtDate } from "@/lib/dates";
import { fmtMinutes } from "@/lib/time";

export const dynamic = "force-dynamic";

/** Inscriptions de l'entreprise : statut, assiduité synthétique (effectuées / prévues), absences, prochaine séance. */
export default async function EmployerLearners() {
  const ctx = await guardEmployer("/entreprise/apprenants");
  if (!ctx) return <NoAttachment kind="employer" />;
  const rows = await Promise.all(
    ctx.enrollments.map(async (e) => {
      const { rows, hours } = await attendanceForEnrollment(ctx.org.id, e.enrollment.id, e.enrollment.hoursPlanned, e.enrollment.legacyHours);
      const absences = rows.filter((r) => r.attendance.status === "absent").length;
      const justified = rows.filter((r) => r.attendance.status === "absent_justifie").length;
      const next = await nextSlotForSessions(ctx.org.id, [e.session.id]);
      return { e, hours, absences, justified, next };
    }),
  );
  return (
    <>
      <PageHeader title="Nos apprenants" description="Assiduité synthétique de vos salariés et apprentis. Les heures effectuées sont celles comptées par présence ; les heures prévues sont la durée contractuelle." />
      <Panel>
        <PanelHeader title={`${rows.length} inscription${rows.length > 1 ? "s" : ""}`} />
        {rows.length ? (
          <Table>
            <thead>
              <tr>
                <Th>Apprenant</Th>
                <Th>Formation</Th>
                <Th>Inscription</Th>
                <Th num>Effectuées / prévues</Th>
                <Th num>Absences</Th>
                <Th>Prochaine séance</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ e, hours, absences, justified, next }) => (
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
                  <Td>
                    <StatusBadge status={e.enrollment.status} />
                  </Td>
                  <Td num>
                    {fmtMinutes(hours.done)} / {hours.planned ? fmtMinutes(hours.planned) : "-"}
                  </Td>
                  <Td num>
                    {absences}
                    {justified ? <span className="text-ink-3"> (+{justified} justifiée{justified > 1 ? "s" : ""})</span> : null}
                  </Td>
                  <Td className="num whitespace-nowrap">{next ? fmtDate(next.slot.date, "EEE d MMM") : "-"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState title="Aucun apprenant rattaché" description="Aucune inscription n'est rattachée à votre entreprise pour le moment." />
        )}
      </Panel>
    </>
  );
}
