import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Certificate,
  LockSimple,
  Timer,
} from "@phosphor-icons/react/ssr";
import { requireUser } from "@/server/auth";
import { getExamOverview, type ExamOverview } from "@/server/exams";
import { getExam, getLevel } from "@/content";
import { levelIdFromParam, routes } from "@/lib/paths";
import { attemptDurationSeconds } from "@/domain/exam-session";
import { cn, formatDate, formatDateTime, formatSeconds } from "@/lib/utils";
import { PageHeader, Panel, PanelHeader } from "@/components/ui/surface";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, Td, Th } from "@/components/ui/table";
import { FadeIn } from "@/components/ui/motion";
import { StartExam } from "@/components/exam/start-exam";
import { Countdown } from "@/components/exam/countdown";

export const metadata: Metadata = { title: "Examen de niveau" };

export default async function ExamenNiveauPage({
  params,
}: {
  params: Promise<{ niveau: string }>;
}) {
  const { niveau } = await params;
  const user = await requireUser();
  const levelId = levelIdFromParam(niveau);
  const level = levelId ? getLevel(levelId) : null;
  const exam = levelId ? getExam(levelId) : null;
  if (!level || !levelId || !exam) notFound();
  const now = new Date();
  const o = await getExamOverview(user.id, levelId, now);
  const used = o.attempts.filter((a) => a.number !== null).length;

  const rules = [
    {
      v: String(exam.questions.length),
      u: "questions",
      d: "QCM, vrai/faux, mises en situation. Ordre des questions et des réponses propre à chaque tentative.",
    },
    {
      v: String(exam.timeLimitMinutes),
      u: "minutes",
      d: "Chronomètre tenu par le serveur. À zéro, vos réponses enregistrées sont envoyées.",
    },
    {
      v: `${exam.passScore} %`,
      u: "pour réussir",
      d: `Soit ${Math.ceil((exam.passScore / 100) * exam.questions.length)} bonnes réponses. Une question sans réponse compte comme fausse.`,
    },
    {
      v: String(o.maxAttempts),
      u: "tentatives",
      d: "Au maximum pour ce niveau. Une tentative commencée est comptée.",
    },
    {
      v: `${o.cooldownDays} j`,
      u: "entre deux essais",
      d: "Le temps de revoir les leçons signalées dans la correction.",
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumb={[
          { label: "Parcours", href: routes.parcours },
          { label: levelId, href: routes.level(levelId) },
          { label: "Examen" },
        ]}
        title={`Examen du niveau ${level.index}`}
        description={level.title.replace(/^Niveau \d+ — /, "")}
        actions={<StatusBadge status={statusKey(o)} />}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <FadeIn>
          <Panel>
            <PanelHeader title="Règlement" description={exam.title} />
            <dl className="divide-y divide-line">
              {rules.map((r) => (
                <div
                  key={r.u}
                  className="grid grid-cols-[92px_1fr] items-baseline gap-4 px-5 py-4 sm:grid-cols-[128px_1fr]"
                >
                  <dt className="flex items-baseline gap-2">
                    <span className="font-display tabular-nums text-[30px] font-light leading-none tracking-tight text-ink sm:text-[38px]">
                      {r.v}
                    </span>
                  </dt>
                  <dd className="min-w-0">
                    <p className="text-[14px] font-medium text-ink">{r.u}</p>
                    <p className="mt-0.5 max-w-[60ch] text-[13px] text-ink-2">
                      {r.d}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="border-t border-line px-5 py-4 font-serif text-[17px] italic leading-snug text-ink-2">
              Les bonnes réponses et les explications ne sont révélées
              qu&apos;après la soumission, avec votre score par compétence.
            </p>
          </Panel>
        </FadeIn>

        <FadeIn
          delay={0.06}
          className="order-first lg:sticky lg:top-6 lg:order-none"
        >
          <StatePanel
            o={o}
            levelId={levelId}
            niveau={niveau}
            used={used}
            now={now}
            questions={exam.questions.length}
            minutes={exam.timeLimitMinutes}
            passScore={exam.passScore}
          />
        </FadeIn>
      </div>

      <section className="mt-10" aria-labelledby="historique">
        <h2 id="historique" className="mb-4 text-[15px] text-ink">
          Historique des tentatives
        </h2>
        {o.attempts.length === 0 ? (
          <p className="border border-dashed border-line-strong px-5 py-6 text-[13.5px] text-ink-2">
            Aucune tentative pour l&apos;instant. Votre première tentative
            apparaîtra ici avec sa correction.
          </p>
        ) : (
          <>
            <ul className="divide-y divide-line border-y border-line sm:hidden">
              {o.attempts.map((a) => (
                <li
                  key={a.id}
                  className={cn(
                    "flex items-center gap-4 py-3.5",
                    a.voidedAt && "opacity-60",
                  )}
                >
                  <span className="tabular-nums font-display text-[24px] font-light leading-none text-ink">
                    {a.number ?? "—"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] text-ink">
                      {formatDateTime(a.startedAt)}
                    </span>
                    <span className="block text-[12px] text-ink-3">
                      {a.percent !== null
                        ? `${a.score}/${a.questionOrder.length} · ${fmtPct(a.percent)}`
                        : "en cours"}
                      {a.submittedAt && !a.voidedAt ? (
                        <>
                          {" · "}
                          <Link
                            href={routes.examResult(levelId, a.id)}
                            className="text-accent underline-offset-4 hover:underline"
                          >
                            correction
                          </Link>
                        </>
                      ) : null}
                    </span>
                  </span>
                  {a.voidedAt ? (
                    <StatusBadge status="voided" />
                  ) : a.submittedAt ? (
                    <StatusBadge status={a.passed ? "passed" : "failed"} />
                  ) : (
                    <StatusBadge status="in_progress" />
                  )}
                </li>
              ))}
            </ul>
            <Panel className="hidden sm:block">
              <Table>
                <thead>
                  <tr>
                    <Th>Tentative</Th>
                    <Th>Commencée le</Th>
                    <Th num>Durée</Th>
                    <Th num>Score</Th>
                    <Th>Résultat</Th>
                    <Th>
                      <span className="sr-only">Correction</span>
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {o.attempts.map((a) => (
                    <tr
                      key={a.id}
                      className={a.voidedAt ? "opacity-60" : undefined}
                    >
                      <Td className="num">
                        {a.number ? `${a.number} / ${o.maxAttempts}` : "—"}
                      </Td>
                      <Td>{formatDateTime(a.startedAt)}</Td>
                      <Td num>
                        {a.submittedAt
                          ? formatSeconds(attemptDurationSeconds(a))
                          : "en cours"}
                      </Td>
                      <Td num>
                        {a.percent !== null
                          ? `${a.score}/${a.questionOrder.length} · ${fmtPct(a.percent)}`
                          : "—"}
                      </Td>
                      <Td>
                        {a.voidedAt ? (
                          <StatusBadge status="voided" />
                        ) : a.submittedAt ? (
                          <StatusBadge
                            status={a.passed ? "passed" : "failed"}
                          />
                        ) : (
                          <StatusBadge status="in_progress" />
                        )}
                      </Td>
                      <Td className="text-right">
                        {a.submittedAt && !a.voidedAt ? (
                          <Link
                            href={routes.examResult(levelId, a.id)}
                            className="inline-flex items-center gap-1.5 text-[12.5px] text-accent underline-offset-4 hover:underline"
                          >
                            Voir la correction
                          </Link>
                        ) : null}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Panel>
          </>
        )}
      </section>
    </div>
  );
}

function statusKey(o: ExamOverview): string {
  if (!o.levelUnlocked || (!o.examUnlocked && o.status.kind === "available"))
    return "locked";
  return o.status.kind === "needs_finalize" ? "in_progress" : o.status.kind;
}

function fmtPct(p: number) {
  return `${p.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
}

function AttemptCells({ used, max }: { used: number; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 w-7 border",
              i < used ? "border-ink-3 bg-ink-3" : "border-accent",
            )}
          />
        ))}
      </div>
      <span className="text-[12.5px] text-ink-2">
        {max - used} tentative{max - used > 1 ? "s" : ""} restante
        {max - used > 1 ? "s" : ""} sur {max}
      </span>
    </div>
  );
}

function StatePanel({
  o,
  levelId,
  niveau,
  used,
  now,
  questions,
  minutes,
  passScore,
}: {
  o: ExamOverview;
  levelId: string;
  niveau: string;
  used: number;
  now: Date;
  questions: number;
  minutes: number;
  passScore: number;
}) {
  const s = o.status;
  const shell = (
    title: string,
    body: React.ReactNode,
    tone: "accent" | "neutral" = "neutral",
  ) => (
    <Panel className={tone === "accent" ? "border-accent" : undefined}>
      <div className="border-b border-line px-5 py-4">
        <p className="text-[12px] text-ink-3">Votre situation</p>
        <h2 className="mt-1 text-[17px] text-ink">{title}</h2>
      </div>
      <div className="space-y-5 px-5 py-5">{body}</div>
    </Panel>
  );

  if (s.kind === "passed") {
    return shell(
      "Examen réussi",
      <>
        <div className="flex items-start gap-3">
          <Certificate
            size={30}
            weight="light"
            className="shrink-0 text-accent"
            aria-hidden
          />
          <p className="text-[13.5px] text-ink-2">
            {o.certificate ? (
              <>
                Certificat délivré le {formatDate(o.certificate.issuedAt)}, n°{" "}
                <span className="num text-ink">{o.certificate.number}</span>.
              </>
            ) : (
              "Certificat en cours de délivrance."
            )}
            {o.bestPercent !== null ? (
              <>
                {" "}
                Score :{" "}
                <span className="num text-ink">{fmtPct(o.bestPercent)}</span>.
              </>
            ) : null}
          </p>
        </div>
        <div className="grid gap-2">
          <Button asChild variant="accent" size="lg">
            <Link href={routes.certificates}>Voir mon certificat</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={routes.examResult(levelId, s.attemptId)}>
              Revoir la correction
            </Link>
          </Button>
        </div>
      </>,
      "accent",
    );
  }

  if (!o.levelUnlocked) {
    return shell(
      "Niveau verrouillé",
      <>
        <p className="flex gap-3 text-[13.5px] text-ink-2">
          <LockSimple
            size={20}
            weight="light"
            className="mt-0.5 shrink-0"
            aria-hidden
          />
          Ce niveau s&apos;ouvre après la réussite de l&apos;examen du niveau
          précédent.
        </p>
        <Button asChild variant="secondary">
          <Link href={routes.parcours}>Retour au parcours</Link>
        </Button>
      </>,
    );
  }

  if (s.kind === "in_progress" || s.kind === "needs_finalize") {
    const left =
      s.kind === "in_progress"
        ? Math.max(
            0,
            Math.floor((s.deadlineAt.getTime() - now.getTime()) / 60000),
          )
        : 0;
    return shell(
      "Tentative en cours",
      <>
        <p className="flex gap-3 text-[13.5px] text-ink-2">
          <Timer
            size={20}
            weight="light"
            className="mt-0.5 shrink-0 text-accent"
            aria-hidden
          />
          Il vous reste environ <span className="num text-ink">{left} min</span>
          . Vos réponses ont été enregistrées.
        </p>
        <Button asChild variant="accent" size="lg">
          <Link href={routes.examTake(levelId)}>Reprendre l&apos;examen</Link>
        </Button>
      </>,
      "accent",
    );
  }

  if (!o.examUnlocked) {
    return shell(
      "Examen verrouillé",
      <>
        <p className="text-[13.5px] text-ink-2">
          Réussissez les {o.missingQuizzes.length} quiz restant
          {o.missingQuizzes.length > 1 ? "s" : ""} du niveau (au moins{" "}
          {passScore} %) pour ouvrir l&apos;examen.
        </p>
        <ul className="divide-y divide-line border-y border-line">
          {o.missingQuizzes.map((m) => (
            <li
              key={m.moduleId}
              className="flex items-center justify-between gap-3 py-2.5"
            >
              <span className="min-w-0 text-[13px] text-ink">
                <span className="num mr-2 text-ink-3">{m.moduleId}</span>
                {m.title}
              </span>
              {m.quizUnlocked ? (
                <Link
                  href={routes.quiz(m.moduleId)}
                  className="inline-flex shrink-0 items-center gap-1 text-[12.5px] text-accent hover:underline"
                >
                  Quiz <ArrowRight size={12} aria-hidden />
                </Link>
              ) : (
                <LockSimple
                  size={14}
                  className="shrink-0 text-ink-3"
                  aria-label="Verrouillé"
                />
              )}
            </li>
          ))}
        </ul>
        <AttemptCells used={used} max={o.maxAttempts} />
      </>,
    );
  }

  if (s.kind === "cooldown") {
    return shell(
      "Prochaine tentative",
      <>
        <p className="text-[13.5px] text-ink-2">
          Disponible le {formatDateTime(s.nextAvailableAt)}. Profitez-en pour
          revoir les leçons signalées dans votre correction.
        </p>
        <Countdown
          target={s.nextAvailableAt.toISOString()}
          serverNow={now.toISOString()}
        />
        <AttemptCells used={used} max={o.maxAttempts} />
      </>,
    );
  }

  if (s.kind === "exhausted") {
    return shell(
      "Tentatives épuisées",
      <>
        <p className="text-[13.5px] text-ink-2">
          Les {o.maxAttempts} tentatives ont été utilisées. Votre formateur peut
          réinitialiser vos tentatives après un point sur vos résultats.
        </p>
        <AttemptCells used={used} max={o.maxAttempts} />
      </>,
    );
  }

  return shell(
    used === 0 ? "Prêt pour l'examen" : "Nouvelle tentative possible",
    <>
      <p className="text-[13.5px] text-ink-2">
        Tous les quiz du niveau sont réussis. Prévoyez {minutes} minutes au
        calme : le chronomètre ne s&apos;arrête pas.
      </p>
      <AttemptCells used={used} max={o.maxAttempts} />
      <StartExam
        niveau={niveau}
        attemptNumber={used + 1}
        maxAttempts={o.maxAttempts}
        minutes={minutes}
        questions={questions}
      />
      {used > 0 ? (
        <Badge tone="neutral">
          Meilleur score :{" "}
          {o.bestPercent !== null ? fmtPct(o.bestPercent) : "—"}
        </Badge>
      ) : null}
    </>,
    "accent",
  );
}
