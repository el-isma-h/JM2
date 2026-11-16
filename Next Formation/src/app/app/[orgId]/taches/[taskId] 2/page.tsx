import Link from "next/link";
import { notFound } from "next/navigation";
import { guardOrg } from "@/server/guard";
import { canActOnTask, canViewTask, orgStaff, taskById, taskEvents } from "@/server/tasks/queries";
import { entityTypeLabels, isOverdue, parsePrerequisites, taskFamilyLabels, type TaskFamily, type TaskStatus } from "@/server/tasks/rules";
import { todayParis } from "@/lib/time";
import { fmtDate, fmtDateTime } from "@/lib/dates";
import { roleLabels, type OrgRole } from "@/server/authz";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KeyValue, Notice, PageHeader, Panel, PanelHeader } from "@/components/ui/surface";
import { FadeIn } from "@/components/ui/motion";
import { ActionButton } from "@/components/admin/action-form";
import { togglePrerequisiteAction } from "@/server/actions/tasks";
import { CommentForm, TaskActions } from "../_components/task-actions";
import { assigneeLabel } from "../_components/task-table";

export const dynamic = "force-dynamic";

const eventLabels: Record<string, string> = {
  creation: "Création",
  reaffectation: "Réaffectation",
  statut: "Changement de statut",
  commentaire: "Commentaire",
  echeance: "Report d'échéance",
  blocage: "Blocage",
  deblocage: "Déblocage",
};

function valueLabel(v: string | null, staff: Map<string, string>): string {
  if (!v) return "-";
  if (v.startsWith("role:")) return `Rôle : ${roleLabels[v.slice(5) as OrgRole] ?? v.slice(5)}`;
  if (/^[0-9a-f-]{36}$/i.test(v)) return staff.get(v) ?? "Membre inactif";
  const statuses: Record<string, string> = { a_faire: "À faire", en_cours: "En cours", bloquee: "Bloquée", terminee: "Terminée", annulee: "Annulée" };
  if (statuses[v]) return statuses[v];
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return fmtDate(v);
  return v;
}

export default async function TaskDetailPage({ params }: { params: Promise<{ orgId: string; taskId: string }> }) {
  const { orgId, taskId } = await params;
  const ctx = await guardOrg(orgId, `/app/${orgId}/taches/${taskId}`);
  const task = await taskById(orgId, taskId);
  if (!task || !canViewTask(ctx, task)) notFound();
  const [events, staff] = await Promise.all([taskEvents(task.id), orgStaff(orgId)]);
  const staffMap = new Map(staff.map((s) => [s.id, s.name]));
  const today = todayParis();
  const late = isOverdue(task, today);
  const prerequisites = parsePrerequisites(task.prerequisites);
  const pending = prerequisites.filter((p) => !p.done);
  const canAct = canActOnTask(ctx, task) && ctx.permissions.has("tasks.manage");
  const isMine = task.assigneeUserId === ctx.user.id;

  return (
    <FadeIn>
      <PageHeader
        breadcrumb={[{ label: "Mes tâches", href: `/app/${orgId}/taches` }, { label: task.title }]}
        title={
          <span className="flex flex-wrap items-center gap-3">
            {task.title}
            <StatusBadge status={task.status} />
            {late ? <Badge tone="danger">En retard</Badge> : null}
          </span>
        }
        description={task.description ?? `${taskFamilyLabels[task.family as TaskFamily] ?? task.family}, créée le ${fmtDateTime(task.createdAt)} (${task.source === "manuel" ? "manuelle" : "relais automatique"}).`}
        actions={ctx.permissions.has("tasks.manage") ? <TaskActions orgId={orgId} taskId={task.id} status={task.status as TaskStatus} isMine={isMine} hasPendingPrerequisites={pending.length > 0} dueDate={task.dueDate} staff={staff} canAct={canAct} /> : null}
      />

      {task.status === "bloquee" ? (
        <Notice tone="danger" title="Ce qui bloque" className="mb-6">
          {task.blockedReason ?? "Motif non renseigné."}
          {task.href ? (
            <>
              {" "}
              <Link href={task.href} className="underline">
                Ouvrir le dossier source
              </Link>
              .
            </>
          ) : null}
        </Notice>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Tâche" />
            <KeyValue
              className="px-5 py-4"
              items={[
                { k: "Famille", v: taskFamilyLabels[task.family as TaskFamily] ?? task.family },
                {
                  k: "Dossier lié",
                  v: task.href && task.entityId ? (
                    <Link href={task.href} className="hover:underline">
                      <span className="etiquette mr-2">{entityTypeLabels[task.entityType ?? ""] ?? task.entityType}</span>
                      {task.entityLabel ?? "Ouvrir"}
                    </Link>
                  ) : (
                    "Aucun"
                  ),
                },
                { k: "Responsable", v: assigneeLabel(task, staffMap) },
                { k: "Échéance", v: <span className={late ? "num text-danger-ink" : "num"}>{task.dueDate ? fmtDate(task.dueDate) : "Sans échéance"}</span> },
                { k: "Priorité", v: <StatusBadge status={task.priority} /> },
                { k: "Indicateur qualité", v: task.indicatorCode ?? "-" },
                { k: "Clé d'événement", v: task.idempotencyKey ? <span className="num text-[12px]">{task.idempotencyKey}</span> : "-" },
                ...(task.completedAt ? [{ k: "Terminée", v: `${fmtDateTime(task.completedAt)}${task.completedBy ? ` par ${staffMap.get(task.completedBy) ?? "un membre"}` : ""}${task.resolutionNote ? ` : ${task.resolutionNote}` : ""}` }] : []),
              ]}
            />
          </Panel>

          <Panel>
            <PanelHeader title="Prérequis explicites" description="Donnée présente, pièce validée ou décision humaine requise : la tâche ne peut être terminée tant qu'un prérequis reste ouvert, sauf dérogation motivée." />
            {prerequisites.length ? (
              <ul className="divide-y divide-line">
                {prerequisites.map((p, i) => (
                  <li key={i} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-[13.5px]">
                    <span className="flex items-center gap-3">
                      {p.done ? <Badge tone="ok">Satisfait</Badge> : <Badge tone="warn">En attente</Badge>}
                      <span className={p.done ? "text-ink-3" : "text-ink"}>{p.label}</span>
                      {p.kind ? <span className="etiquette">{p.kind}</span> : null}
                    </span>
                    {canAct ? <ActionButton action={togglePrerequisiteAction} fields={{ orgId, taskId: task.id, index: String(i), done: p.done ? "0" : "1" }} label={p.done ? "Rouvrir" : "Marquer satisfait"} variant="ghost" /> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-4 text-[13.5px] text-ink-2">Aucun prérequis déclaré.</p>
            )}
          </Panel>

          {canAct ? (
            <Panel>
              <PanelHeader title="Commenter" />
              <div className="px-5 py-4">
                <CommentForm orgId={orgId} taskId={task.id} />
              </div>
            </Panel>
          ) : null}
        </div>

        <Panel className="self-start">
          <PanelHeader title="Historique complet" description="Création, réaffectations, statuts, blocages, reports et commentaires : rien n'est effacé." />
          {events.length ? (
            <ol className="divide-y divide-line">
              {events.map(({ e, firstName, lastName }) => (
                <li key={e.id} className="px-5 py-3 text-[13px]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-ink">{eventLabels[e.kind] ?? e.kind}</span>
                    <span className="num text-[12px] text-ink-3">{fmtDateTime(e.at)}</span>
                  </div>
                  <p className="mt-0.5 text-ink-2">
                    {firstName ? `${firstName} ${lastName}` : "Système"}
                    {e.fromValue || e.toValue ? (
                      <>
                        {" : "}
                        {e.fromValue ? valueLabel(e.fromValue, staffMap) : "-"} vers {e.toValue ? valueLabel(e.toValue, staffMap) : "-"}
                      </>
                    ) : null}
                  </p>
                  {e.note ? <p className="mt-1 whitespace-pre-wrap text-ink">{e.note}</p> : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="px-5 py-4 text-[13.5px] text-ink-2">Aucun événement.</p>
          )}
          <div className="border-t border-line px-5 py-3">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/app/${orgId}/taches`}>Retour à mes tâches</Link>
            </Button>
          </div>
        </Panel>
      </div>
    </FadeIn>
  );
}
