import Link from "next/link";
import { guardEmployer } from "@/server/extranet/guard";
import { listCompanyFollowups, listRecordEntries } from "@/server/extranet/queries";
import { addCompanyCommentAction } from "@/server/actions/employer";
import { NoAttachment } from "@/components/extranet/shell";
import { recordKindLabels } from "@/components/extranet/ui";
import { FormDialog } from "@/components/admin/form-dialog";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { EmptyState, PageHeader, Panel, PanelHeader } from "@/components/ui/surface";
import { fmtDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

const followupLabels: Record<string, string> = { visite: "Visite en entreprise", appel: "Appel", visio: "Visio", bilan_intermediaire: "Bilan intermédiaire", bilan_final: "Bilan final", echange_tuteur: "Échange avec le tuteur", incident: "Incident" };

/** Suivis en entreprise et livrets partagés, avec ajout d'un commentaire d'entreprise par le tuteur. */
export default async function EmployerFollowup() {
  const ctx = await guardEmployer("/entreprise/suivi");
  if (!ctx) return <NoAttachment kind="employer" />;
  const [followups, entries] = await Promise.all([listCompanyFollowups(ctx.org.id, ctx.enrollmentIds), listRecordEntries(ctx.org.id, ctx.enrollmentIds, "company")]);
  const name = (id: string) => {
    const e = ctx.enrollments.find((x) => x.enrollment.id === id);
    return e ? `${e.person.firstName} ${e.person.lastName}` : "Apprenant";
  };
  return (
    <>
      <PageHeader
        title="Suivi et livrets"
        description="Échanges de suivi entre l'organisme et votre entreprise, et entrées de livret partagées. En tant que tuteur, vous pouvez ajouter un commentaire d'entreprise au livret d'un apprenant."
        actions={
          ctx.enrollments.length ? (
            <FormDialog action={addCompanyCommentAction} trigger="Ajouter un commentaire" title="Commentaire d'entreprise" description="Partagé avec l'équipe pédagogique et l'apprenant." submitLabel="Ajouter">
              <Field label="Apprenant" required htmlFor="s-enr">
                <Select id="s-enr" name="enrollmentId" required defaultValue={ctx.enrollments[0]?.enrollment.id}>
                  {ctx.enrollments.map((e) => (
                    <option key={e.enrollment.id} value={e.enrollment.id}>
                      {e.person.firstName} {e.person.lastName} · {e.program?.title ?? e.session.title}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Titre" required htmlFor="s-title">
                <Input id="s-title" name="title" required maxLength={120} />
              </Field>
              <Field label="Commentaire" required htmlFor="s-body" help="Activités confiées, compétences observées, points d'attention.">
                <Textarea id="s-body" name="body" required maxLength={4000} />
              </Field>
            </FormDialog>
          ) : null
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Suivis en entreprise" />
          {followups.length ? (
            <ol className="divide-y divide-line">
              {followups.map((f) => (
                <li key={f.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="num text-[12px] text-ink-3">{fmtDate(f.date)}</span>
                    <Badge>{followupLabels[f.kind] ?? f.kind}</Badge>
                    <Link href={`/entreprise/apprenants/${f.enrollmentId}`} className="font-medium text-ink hover:underline">
                      {name(f.enrollmentId)}
                    </Link>
                  </div>
                  <p className="mt-2 text-[13.5px] text-ink">{f.summary}</p>
                  {f.actions ? <p className="mt-1 text-[13px] text-ink-2">Actions : {f.actions}</p> : null}
                  {f.nextDate ? <p className="num mt-1 text-[12px] text-ink-3">Prochain point : {fmtDate(f.nextDate)}</p> : null}
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState title="Aucun suivi enregistré" description="Les visites, appels et bilans réalisés avec votre entreprise apparaîtront ici." />
          )}
        </Panel>
        <Panel>
          <PanelHeader title="Livrets : entrées partagées" />
          {entries.length ? (
            <ol className="divide-y divide-line">
              {entries.map((r) => (
                <li key={r.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="num text-[12px] text-ink-3">{fmtDate(r.date)}</span>
                    <Badge tone={r.kind === "entreprise" ? "info" : "neutral"}>{recordKindLabels[r.kind] ?? r.kind}</Badge>
                    <Link href={`/entreprise/apprenants/${r.enrollmentId}`} className="font-medium text-ink hover:underline">
                      {name(r.enrollmentId)}
                    </Link>
                  </div>
                  <p className="mt-1 text-[13.5px] font-medium text-ink">{r.title}</p>
                  {r.body ? <p className="mt-1 whitespace-pre-line text-[13.5px] text-ink-2">{r.body}</p> : null}
                  {r.authorRole ? <p className="mt-2 text-[11.5px] text-ink-3">{r.authorRole}</p> : null}
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState title="Aucune entrée partagée" />
          )}
        </Panel>
      </div>
    </>
  );
}
