import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DownloadSimple, LockKeyOpen, Seal } from "@phosphor-icons/react/ssr";
import { requireRole } from "@/server/auth";
import { getProgramme } from "@/content";
import { getLearnerDetail } from "@/server/admin/queries";
import { ACTION_LABELS, type AdminActionName } from "@/server/admin/audit";
import { badgeDef, examAttemptStatus, parisDayKey } from "@/domain";
import { canActOn } from "@/lib/roles";
import { routes, withBase } from "@/lib/paths";
import { formatDate, formatDateTime, formatNumber, formatSeconds, initials } from "@/lib/utils";
import { reissueCertificateAction, removeUnlockAction, resetExamAttemptsAction, revokeCertificateAction, setAccountDisabledAction, unlockAction } from "@/server/actions/admin";
import { PageHeader, Panel, PanelHeader, EmptyState, Notice } from "@/components/ui/surface";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, Td, Th } from "@/components/ui/table";
import { BadgeIcon } from "@/components/badges/badge-icon";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { Heatmap } from "@/components/admin/charts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Fiche apprenant" };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  passed: "Réussi",
  in_progress: "Tentative en cours",
  needs_finalize: "Tentative expirée à clôturer",
  available: "Disponible",
  cooldown: "Délai d'attente",
  exhausted: "Tentatives épuisées",
};

export default async function AdminApprenantsIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await requireRole("admin", "trainer");
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const d = await getLearnerDetail(id);
  if (!d) notFound();
  const { user } = d;
  const now = new Date();
  const name = `${user.firstName} ${user.lastName}`.trim() || user.email;
  const canProgress = canActOn(actor, user, "progress");
  const canDisable = canActOn(actor, user, "disable");
  const programme = getProgramme();
  const manual = new Set(d.unlocks.map((u) => `${u.scope}:${u.refId}`));
  const lessonsByModule = new Map<string, typeof d.lessons>();
  for (const l of d.lessons) lessonsByModule.set(l.moduleId, [...(lessonsByModule.get(l.moduleId) ?? []), l]);
  const quizBest = new Map<string, number>();
  for (const q of d.quizzes) quizBest.set(q.moduleId, Math.max(quizBest.get(q.moduleId) ?? 0, q.percent));
  const activeCerts = new Set(d.certificates.filter((c) => !c.revokedAt).map((c) => c.levelId));
  const today = parisDayKey(now);

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Administration", href: routes.admin }, { label: "Apprenants", href: routes.adminLearners }, { label: name }]}
        title={
          <span className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-line-strong font-mono text-[14px] tracking-normal">{initials(user.firstName, user.lastName)}</span>
            <span className="min-w-0">{name}</span>
          </span>
        }
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span>{user.email}</span>
            <StatusBadge status={user.role} />
            {user.isDemo ? <StatusBadge status="demo" /> : null}
            {user.disabledAt ? <Badge tone="danger">Désactivé le {formatDate(user.disabledAt)}</Badge> : null}
            <span className="text-ink-3">Inscrit le {formatDate(user.createdAt)} · dernière connexion {formatDateTime(user.lastLoginAt)}</span>
          </span>
        }
        actions={
          <>
            <Button href={`${withBase(routes.api.adminExport("preuves"))}?apprenant=${user.id}`}>
              <DownloadSimple size={14} /> Preuves FOAD
            </Button>
            {canDisable ? (
              user.disabledAt ? (
                <ConfirmAction label="Réactiver le compte" title="Réactiver le compte" description={`${name} pourra de nouveau se connecter avec son mot de passe.`} confirmLabel="Réactiver" run={setAccountDisabledAction.bind(null, user.id, false)} />
              ) : (
                <ConfirmAction
                  danger
                  variant="danger"
                  label="Désactiver le compte"
                  title="Désactiver le compte"
                  description={`${name} ne pourra plus se connecter et ses sessions ouvertes seront fermées. Sa progression et ses preuves de réalisation sont conservées ; vous pourrez réactiver le compte à tout moment.`}
                  confirmLabel="Désactiver"
                  run={setAccountDisabledAction.bind(null, user.id, true)}
                />
              )
            ) : null}
          </>
        }
      />

      <Panel className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-6">
        {[
          { k: "Progression", v: `${d.progressPercent} %` },
          { k: "Niveau en cours", v: d.currentLevel ?? "—" },
          { k: "Temps total", v: formatSeconds(d.totalSeconds) },
          { k: "Leçons terminées", v: `${d.state.completedLessons.size} / ${d.lessons.length}` },
          { k: "XP", v: formatNumber(d.totalXp) },
          { k: "Certificats", v: String(activeCerts.size) },
        ].map((s) => (
          <div key={s.k} className="min-w-0 bg-bg-elev px-5 py-4">
            <p className="text-[12px] text-ink-3">{s.k}</p>
            <p className="num mt-1.5 truncate text-[22px] font-light text-ink">{s.v}</p>
          </div>
        ))}
      </Panel>
      {!canProgress ? (
        <Notice tone="info" className="mt-4">
          Ce compte appartient à l&apos;équipe : seuls les administrateurs peuvent agir dessus.
        </Notice>
      ) : null}

      <Tabs defaultValue="progression" className="mt-8">
        <TabsList>
          <TabsTrigger value="progression">Progression</TabsTrigger>
          <TabsTrigger value="evaluations">Quiz et examens</TabsTrigger>
          <TabsTrigger value="activite">Activité</TabsTrigger>
          <TabsTrigger value="certificats">Certificats et badges</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
        </TabsList>

        {/* ---------- Progression ---------- */}
        <TabsContent value="progression" className="space-y-6">
          {programme.levels.map((level) => {
            const la = d.access.levels[level.id];
            return (
              <Panel key={level.id}>
                <PanelHeader
                  title={
                    <span className="flex flex-wrap items-center gap-3">
                      <span className="num">{level.id}</span> {level.title}
                      <StatusBadge status={la.examPassed ? "completed" : la.state} />
                      {la.manuallyUnlocked ? <Badge tone="info">Débloqué manuellement</Badge> : null}
                    </span>
                  }
                  description={`${la.lessonsCompleted} / ${la.lessonsTotal} leçons · ${la.modulesCompleted} / ${la.modulesTotal} modules · examen ${la.examPassed ? "réussi" : la.examUnlocked ? "accessible" : "verrouillé"}`}
                  actions={
                    canProgress ? (
                      manual.has(`level:${level.id}`) ? (
                        <ConfirmAction label="Retirer le déblocage" title={`Retirer le déblocage du niveau ${level.id}`} description="Le niveau redevient soumis aux règles normales (réussite de l'examen précédent). La progression déjà faite est conservée." confirmLabel="Retirer" run={removeUnlockAction.bind(null, user.id, "level", level.id)} />
                      ) : !la.unlocked ? (
                        <ConfirmAction
                          label={
                            <>
                              <LockKeyOpen size={13} /> Débloquer le niveau
                            </>
                          }
                          title={`Débloquer le niveau ${level.id}`}
                          description={`Le niveau ${level.id} et son premier module deviennent accessibles à ${name}, sans attendre la réussite de l'examen précédent. L'action est journalisée.`}
                          confirmLabel="Débloquer"
                          run={unlockAction.bind(null, user.id, "level", level.id)}
                        />
                      ) : null
                    ) : null
                  }
                />
                <ul className="divide-y divide-line">
                  {level.modules.map((m) => {
                    const ma = d.access.modules[m.id];
                    const lessons = lessonsByModule.get(m.id) ?? [];
                    const best = quizBest.get(m.id);
                    return (
                      <li key={m.id}>
                        <details className="group">
                          <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 transition-colors hover:bg-bg-sunken [&::-webkit-details-marker]:hidden">
                            <span className="num w-10 shrink-0 text-[12px] text-ink-3">{m.id}</span>
                            <span className="min-w-0 flex-1 text-[13.5px] text-ink">{m.title}</span>
                            <span className="flex w-full items-center gap-3 sm:w-auto">
                              <Progress value={ma.lessonsCompleted} max={ma.lessonsTotal} className="w-16 sm:w-24" tone={ma.completed ? "ok" : "accent"} label={`Leçons du module ${m.id}`} />
                              <span className="num w-10 text-right text-[12px] text-ink-2">
                                {ma.lessonsCompleted}/{ma.lessonsTotal}
                              </span>
                              <span className="ml-auto text-right text-[12px] text-ink-2 sm:ml-0 sm:w-24">{best !== undefined ? <>Quiz <span className="num">{Math.round(best)} %</span></> : ma.quizUnlocked ? "Quiz ouvert" : "—"}</span>
                              <StatusBadge status={ma.state} />
                            </span>
                          </summary>
                          <div className="border-t border-line bg-bg px-5 py-4">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                              <p className="text-[12.5px] text-ink-2">
                                {ma.manuallyUnlocked ? "Module débloqué manuellement. " : ""}
                                {ma.unlocked ? "Module accessible." : "Module verrouillé : quiz du module précédent non réussi."}
                              </p>
                              {canProgress ? (
                                manual.has(`module:${m.id}`) ? (
                                  <ConfirmAction label="Retirer le déblocage" title={`Retirer le déblocage du module ${m.id}`} description="Le module redevient soumis aux règles normales. La progression déjà faite est conservée." confirmLabel="Retirer" run={removeUnlockAction.bind(null, user.id, "module", m.id)} />
                                ) : !ma.unlocked ? (
                                  <ConfirmAction
                                    label={
                                      <>
                                        <LockKeyOpen size={13} /> Débloquer le module
                                      </>
                                    }
                                    title={`Débloquer le module ${m.id}`}
                                    description={`« ${m.title} » devient accessible à ${name} sans réussite du quiz précédent. L'action est journalisée.`}
                                    confirmLabel="Débloquer"
                                    run={unlockAction.bind(null, user.id, "module", m.id)}
                                  />
                                ) : null
                              ) : null}
                            </div>
                            <Table>
                              <thead>
                                <tr>
                                  <Th>Leçon</Th>
                                  <Th>État</Th>
                                  <Th>Première ouverture</Th>
                                  <Th>Terminée le</Th>
                                  <Th num>Temps passé</Th>
                                </tr>
                              </thead>
                              <tbody>
                                {lessons.map((l) => (
                                  <tr key={l.id}>
                                    <Td>
                                      <span className="num mr-2 text-ink-3">{l.id}</span>
                                      {l.title}
                                    </Td>
                                    <Td>{l.progress ? <StatusBadge status={l.progress.status} /> : <span className="text-ink-3">—</span>}</Td>
                                    <Td className="text-ink-2">{formatDateTime(l.progress?.firstOpenedAt)}</Td>
                                    <Td className="text-ink-2">{formatDateTime(l.progress?.completedAt)}</Td>
                                    <Td num>
                                      {l.progress ? formatSeconds(l.progress.timeSpentSeconds) : "—"}
                                      <span className="ml-1 text-ink-3">/ {l.minutes} min</span>
                                    </Td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </details>
                      </li>
                    );
                  })}
                </ul>
              </Panel>
            );
          })}
        </TabsContent>

        {/* ---------- Quiz et examens ---------- */}
        <TabsContent value="evaluations" className="space-y-6">
          <Panel>
            <PanelHeader title="Examens de niveau" description="3 tentatives par niveau, 7 jours entre deux tentatives. Une réinitialisation annule les tentatives non réussies sans les effacer." />
            <div className="divide-y divide-line">
              {programme.levels.map((level) => {
                const attempts = d.exams.filter((e) => e.levelId === level.id);
                if (!attempts.length) return null;
                const status = examAttemptStatus(attempts, now);
                const resettable = attempts.some((a) => !a.voidedAt && a.passed !== true);
                let n = 0;
                const numbered = [...attempts].reverse().map((a) => ({ ...a, n: a.voidedAt ? null : ++n })).reverse();
                return (
                  <section key={level.id} className="px-5 py-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[14px] text-ink">
                        <span className="num mr-2">{level.id}</span>
                        {level.title}
                        <span className="ml-3 text-[12.5px] text-ink-2">{STATUS_LABEL[status.kind]}</span>
                      </p>
                      {canProgress && resettable ? (
                        <ConfirmAction
                          label="Réinitialiser les tentatives"
                          title={`Réinitialiser les tentatives — ${level.id}`}
                          description={`Les tentatives non réussies de ${name} pour ce niveau seront annulées : elles ne comptent plus dans la limite de 3 et le délai de 7 jours est levé. Elles restent visibles ici et dans les exports.`}
                          confirmLabel="Réinitialiser"
                          run={resetExamAttemptsAction.bind(null, user.id, level.id)}
                        />
                      ) : null}
                    </div>
                    <ul className="space-y-3">
                      {numbered.map((a) => (
                        <li key={a.id} className={cn("border border-line px-4 py-3", a.voidedAt && "opacity-60")}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[13px] text-ink">
                              {a.n ? `Tentative ${a.n}` : "Tentative annulée"} · <span className="text-ink-2">{formatDateTime(a.startedAt)}</span>
                              {a.durationSeconds !== null ? <span className="text-ink-3"> · {formatSeconds(a.durationSeconds)}</span> : null}
                            </p>
                            <span className="flex items-center gap-2">
                              <span className="num text-[14px]">{a.percent !== null ? `${Math.round(a.percent)} %` : "—"}</span>
                              {a.voidedAt ? <StatusBadge status="voided" /> : a.submittedAt ? <StatusBadge status={a.passed ? "passed" : "failed"} /> : <StatusBadge status="in_progress" />}
                            </span>
                          </div>
                          {a.byCompetence.length ? (
                            <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                              {a.byCompetence.map((c) => (
                                <div key={c.competence} className="flex items-center gap-3 text-[12px]">
                                  <span className="num w-12 shrink-0 text-ink-2">{c.competence}</span>
                                  <Progress value={c.percent} className="flex-1" tone={c.percent >= 70 ? "ok" : "warn"} label={`Compétence ${c.competence}`} />
                                  <span className="num w-16 shrink-0 text-right text-ink-2">
                                    {c.correct}/{c.total}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : null}
                          {a.voidedAt ? <p className="mt-2 text-[12px] text-ink-3">Annulée le {formatDateTime(a.voidedAt)}</p> : null}
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
              {d.exams.length === 0 ? <EmptyState title="Aucune tentative d'examen" description="L'examen d'un niveau s'ouvre quand tous ses quiz de module sont réussis." /> : null}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Historique des quiz" description={`${d.quizzes.length} tentative${d.quizzes.length > 1 ? "s" : ""}`} />
            {d.quizzes.length ? (
              <Table>
                <thead>
                  <tr>
                    <Th>Date</Th>
                    <Th>Module</Th>
                    <Th num>Score</Th>
                    <Th num>%</Th>
                    <Th>Résultat</Th>
                  </tr>
                </thead>
                <tbody>
                  {d.quizzes.map((q) => (
                    <tr key={q.id}>
                      <Td className="text-ink-2">{formatDateTime(q.at)}</Td>
                      <Td>
                        <span className="num mr-2 text-ink-3">{q.moduleId}</span>
                        {programme.levels.flatMap((l) => l.modules).find((m) => m.id === q.moduleId)?.title}
                      </Td>
                      <Td num>
                        {q.score}/{q.total}
                      </Td>
                      <Td num>{Math.round(q.percent)} %</Td>
                      <Td>{q.percent >= 100 ? <StatusBadge status="perfect" /> : <StatusBadge status={q.passed ? "passed" : "failed"} />}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <EmptyState title="Aucun quiz passé" />
            )}
          </Panel>
        </TabsContent>

        {/* ---------- Activité ---------- */}
        <TabsContent value="activite" className="space-y-6">
          <Panel>
            <PanelHeader title="Calendrier d'activité" description="Minutes de formation mesurées par jour, sur les six derniers mois." />
            <div className="px-5 py-5">
              <Heatmap today={today} days={d.daily.map((x) => ({ day: x.day, seconds: x.seconds, events: x.lessons + x.quizzes + x.exams + x.tutor + x.logins }))} />
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Jour par jour" />
            {d.daily.length ? (
              <Table>
                <thead>
                  <tr>
                    <Th>Date</Th>
                    <Th num>Temps</Th>
                    <Th num>Leçons terminées</Th>
                    <Th num>Quiz</Th>
                    <Th num>Examens</Th>
                    <Th num>Tuteur</Th>
                    <Th num>Connexions</Th>
                  </tr>
                </thead>
                <tbody>
                  {d.daily.slice(0, 90).map((x) => (
                    <tr key={x.day}>
                      <Td>{formatDate(`${x.day}T12:00:00Z`)}</Td>
                      <Td num>{x.seconds ? formatSeconds(x.seconds) : "—"}</Td>
                      <Td num>{x.lessons || "—"}</Td>
                      <Td num>{x.quizzes || "—"}</Td>
                      <Td num>{x.exams || "—"}</Td>
                      <Td num>{x.tutor || "—"}</Td>
                      <Td num>{x.logins || "—"}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <EmptyState title="Aucune activité enregistrée" description="Le temps passé, les leçons terminées et les connexions apparaîtront ici." />
            )}
          </Panel>
        </TabsContent>

        {/* ---------- Certificats et badges ---------- */}
        <TabsContent value="certificats" className="space-y-6">
          <Panel>
            <PanelHeader title="Certificats" />
            <ul className="divide-y divide-line">
              {d.certificates.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Seal size={26} weight="light" className={c.revokedAt ? "text-ink-3" : "text-accent"} aria-hidden />
                    <div className="min-w-0">
                      <Link href={routes.verify(c.number)} className="num text-[14px] text-ink hover:text-accent" target="_blank">
                        {c.number}
                      </Link>
                      <p className="text-[12px] text-ink-3">
                        Niveau {c.levelId} · émis le {formatDate(c.issuedAt)}
                        {c.revokedAt ? ` · révoqué le ${formatDate(c.revokedAt)}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={c.revokedAt ? "revoked" : "valid"} />
                    {canProgress && !c.revokedAt ? (
                      <ConfirmAction
                        danger
                        variant="danger"
                        label="Révoquer"
                        title={`Révoquer le certificat ${c.number}`}
                        description="La page publique de vérification indiquera que ce certificat est révoqué. Vous pourrez ensuite en réémettre un nouveau (nouveau numéro)."
                        confirmLabel="Révoquer"
                        run={revokeCertificateAction.bind(null, c.id)}
                      />
                    ) : null}
                  </div>
                </li>
              ))}
              {canProgress
                ? [...d.state.passedExams]
                    .filter((lv) => !activeCerts.has(lv))
                    .map((lv) => (
                      <li key={`re-${lv}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                        <p className="text-[13.5px] text-ink-2">Examen {lv} réussi, aucun certificat actif.</p>
                        <ConfirmAction label="Réémettre un certificat" title={`Réémettre le certificat ${lv}`} description={`Un nouveau certificat (nouveau numéro, date du jour) sera émis pour ${name}. L'action est journalisée.`} confirmLabel="Émettre" run={reissueCertificateAction.bind(null, user.id, lv)} />
                      </li>
                    ))
                : null}
              {d.certificates.length === 0 && d.state.passedExams.size === 0 ? <EmptyState title="Aucun certificat" description="Un certificat est émis à la réussite de l'examen d'un niveau." /> : null}
            </ul>
          </Panel>
          <Panel>
            <PanelHeader title="Badges" description={`${d.badges.length} obtenu${d.badges.length > 1 ? "s" : ""}${d.hasPersonalKey ? " · clé API personnelle configurée" : ""}`} />
            {d.badges.length ? (
              <ul className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-5">
                {d.badges.map((b) => {
                  const def = badgeDef(b.badgeId);
                  return (
                    <li key={b.badgeId} className="bg-bg-elev px-4 py-4">
                      <BadgeIcon name={def?.icon ?? "Seal"} size={24} className="text-accent" />
                      <p className="mt-2 text-[13px] text-ink">{def?.title ?? b.badgeId}</p>
                      <p className="text-[11.5px] text-ink-3">{formatDate(b.at)}</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState title="Aucun badge" />
            )}
          </Panel>
        </TabsContent>

        {/* ---------- Journal ---------- */}
        <TabsContent value="journal">
          <Panel>
            <PanelHeader title="Actions de l'équipe" description="Chaque déblocage, réinitialisation, action sur un certificat ou sur le compte est enregistré ici." />
            {d.actions.length ? (
              <ul className="divide-y divide-line">
                {d.actions.map(({ a, actorFirst, actorLast }) => (
                  <li key={a.id} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3">
                    <p className="text-[13.5px] text-ink">
                      {ACTION_LABELS[a.action as AdminActionName] ?? a.action}
                      {a.refId ? <span className="num ml-2 text-ink-2">{a.refId}</span> : null}
                    </p>
                    <p className="text-[12px] text-ink-3">
                      {actorFirst ? `${actorFirst} ${actorLast ?? ""}`.trim() : "Compte supprimé"} · {formatDateTime(a.at)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="Aucune action" description="Aucune intervention de l'équipe sur ce compte pour l'instant." />
            )}
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Button({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="inline-flex h-8 items-center gap-2 whitespace-nowrap border border-line-strong px-3 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ink transition-all duration-500 hover:border-ink hover:bg-ink hover:text-bg">
      {children}
    </a>
  );
}
