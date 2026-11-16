import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Certificate, DownloadSimple, Lightning, SealCheck } from "@phosphor-icons/react/ssr";
import { requireUser } from "@/server/auth";
import { getExamResult } from "@/server/exams";
import { getFlatLessons } from "@/content";
import { BADGE_BY_ID, XP } from "@/domain";
import { levelIdFromParam, routes, withBase } from "@/lib/paths";
import { formatDateTime, formatSeconds } from "@/lib/utils";
import { PageHeader, Panel } from "@/components/ui/surface";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn, Pop } from "@/components/ui/motion";
import { BadgeIcon } from "@/components/badges/badge-icon";
import { ResultHero } from "@/components/exam/result-hero";
import { ScoreRule } from "@/components/exam/score-rule";
import { CorrectionList } from "@/components/exam/correction-list";

export const metadata: Metadata = { title: "Résultat de l'examen" };
export const dynamic = "force-dynamic";

export default async function ExamResultPage({ params, searchParams }: { params: Promise<{ niveau: string; tentative: string }>; searchParams: Promise<{ celebrer?: string }> }) {
  const [{ niveau, tentative }, sp] = await Promise.all([params, searchParams]);
  const user = await requireUser();
  const levelId = levelIdFromParam(niveau);
  if (!levelId) notFound();
  const r = await getExamResult(user.id, tentative);
  if (!r) {
    // Tentative inconnue, d'un autre apprenant, ou pas encore soumise : la correction reste cachée.
    redirect(routes.exam(levelId));
  }
  if (r.levelId !== levelId) redirect(routes.examResult(r.levelId, r.attempt.id));
  const { correction: c, passScore } = r;
  const needed = Math.ceil((passScore / 100) * c.total);
  const lessons = getFlatLessons();
  const cited = new Set(c.items.map((i) => i.lessonId));
  const lessonTitles = Object.fromEntries(lessons.filter((l) => cited.has(l.id)).map((l) => [l.id, l.title]));
  const lessonHref = Object.fromEntries(lessons.filter((l) => cited.has(l.id)).map((l) => [l.id, routes.lesson(l.id)]));
  const toReview = [...new Set(c.items.filter((i) => !i.correct && i.lessonId).map((i) => i.lessonId!))].slice(0, 6);
  const levelIndex = Number(levelId.slice(1));

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Parcours", href: routes.parcours }, { label: levelId, href: routes.level(levelId) }, { label: "Examen", href: routes.exam(levelId) }, { label: `Tentative ${r.attempt.number}` }]}
        title={c.passed ? `Niveau ${levelIndex} réussi` : "Pas encore cette fois"}
        description={c.passed ? "Votre certificat est délivré et le niveau suivant est ouvert." : `Il manquait ${Math.max(1, needed - c.score)} bonne${needed - c.score > 1 ? "s" : ""} réponse${needed - c.score > 1 ? "s" : ""}. La correction ci-dessous vous montre quoi revoir.`}
        actions={<StatusBadge status={c.passed ? "passed" : "failed"} />}
      />

      {/* Score */}
      <section className="grid min-w-0 gap-8 border-b border-line pb-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
        <ResultHero percent={c.percent} passScore={passScore} passed={c.passed} celebrateNow={sp.celebrer === "1"} cleanHref={routes.examResult(levelId, r.attempt.id)} />
        <dl className="grid grid-cols-2 content-start gap-px self-start border border-line bg-line">
          {[
            { k: "Bonnes réponses", v: `${c.score} / ${c.total}` },
            { k: "Seuil", v: `${needed} / ${c.total}` },
            { k: "Durée", v: formatSeconds(r.durationSeconds) },
            { k: "Tentative", v: `${r.attempt.number} sur 3` },
          ].map((x) => (
            <div key={x.k} className="bg-bg px-4 py-3.5">
              <dt className="text-[12px] text-ink-3">{x.k}</dt>
              <dd className="num mt-1 text-[18px] text-ink">{x.v}</dd>
            </div>
          ))}
          <div className="col-span-2 bg-bg px-4 py-3 text-[12px] text-ink-3">Envoyée le {formatDateTime(r.attempt.submittedAt)}{r.attempt.submittedAt && r.attempt.submittedAt.getTime() >= r.attempt.deadlineAt.getTime() ? " · envoi automatique à la fin du temps" : ""}</div>
        </dl>
      </section>

      {/* Suite */}
      {c.passed ? (
        <section className="grid gap-px border-b border-line bg-line sm:grid-cols-3" aria-label="Récompenses">
          <Pop delay={1.3} className="bg-bg px-5 py-6">
            <Certificate size={26} weight="light" className="text-accent" aria-hidden />
            <p className="mt-3 text-[13.5px] font-medium text-ink">Certificat délivré</p>
            {r.certificateNumber ? (
              <>
                <p className="num mt-1 text-[13px] text-ink-2">{r.certificateNumber}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild variant="accent" size="sm">
                    <a href={withBase(routes.api.certificatePdf(r.certificateNumber))}>
                      <DownloadSimple size={13} aria-hidden /> PDF
                    </a>
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={routes.verify(r.certificateNumber)}>Vérifier</Link>
                  </Button>
                </div>
              </>
            ) : (
              <p className="mt-1 text-[13px] text-ink-2">Un certificat actif existe déjà pour ce niveau.</p>
            )}
          </Pop>
          <Pop delay={1.4} className="bg-bg px-5 py-6">
            <Lightning size={26} weight="light" className="text-accent" aria-hidden />
            <p className="mt-3 text-[13.5px] font-medium text-ink">
              <span className="num">+{XP.examPass}</span> XP
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {r.badgesEarned.length ? (
                r.badgesEarned.map((id) => (
                  <span key={id} className="inline-flex items-center gap-1.5 border border-accent px-2 py-1 text-[12px] text-accent" title={BADGE_BY_ID[id]?.description}>
                    <BadgeIcon name={BADGE_BY_ID[id]?.icon ?? ""} size={14} /> {BADGE_BY_ID[id]?.title ?? id}
                  </span>
                ))
              ) : (
                <span className="text-[13px] text-ink-2">Badges de certification déjà obtenus.</span>
              )}
            </div>
          </Pop>
          <Pop delay={1.5} className="bg-bg px-5 py-6">
            <SealCheck size={26} weight="light" className="text-accent" aria-hidden />
            {r.nextLevelId ? (
              <>
                <p className="mt-3 text-[13.5px] font-medium text-ink">Niveau {r.nextLevelId.slice(1)} ouvert</p>
                <Button asChild variant="primary" size="sm" className="mt-4">
                  <Link href={routes.level(r.nextLevelId)}>
                    Commencer <ArrowRight size={13} aria-hidden />
                  </Link>
                </Button>
              </>
            ) : (
              <p className="mt-3 text-[13.5px] font-medium text-ink">Formation complète : les quatre niveaux sont validés.</p>
            )}
          </Pop>
        </section>
      ) : (
        <FadeIn delay={0.2}>
          <section className="grid gap-6 border-b border-line py-8 md:grid-cols-2" aria-label="Prochaine étape">
            <div className="min-w-0">
              <h2 className="text-[15px] text-ink">Prochaine tentative</h2>
              <p className="mt-3 max-w-[52ch] text-[13.5px] text-ink-2">
                {r.next?.kind === "date" ? (
                  <>
                    Possible à partir du <span className="text-ink">{formatDateTime(r.next.at)}</span>. Il vous reste {r.attemptsLeft} tentative{r.attemptsLeft > 1 ? "s" : ""}.
                  </>
                ) : r.next?.kind === "now" ? (
                  <>Vous pouvez la passer dès maintenant. Il vous reste {r.attemptsLeft} tentative{r.attemptsLeft > 1 ? "s" : ""}.</>
                ) : (
                  <>Les trois tentatives ont été utilisées. Votre formateur peut faire le point avec vous et réinitialiser vos tentatives.</>
                )}
              </p>
              <p className="mt-4 max-w-[52ch] font-serif text-[18px] italic leading-snug text-ink-2">Une semaine suffit souvent : revoyez les leçons ci-contre, puis refaites leurs quiz.</p>
            </div>
            {toReview.length ? (
              <div className="min-w-0">
                <h2 className="text-[15px] text-ink">Leçons à revoir</h2>
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {toReview.map((id) => (
                    <li key={id}>
                      <Link href={routes.lesson(id)} className="flex items-center gap-3 py-2.5 text-[13px] text-ink transition-colors hover:text-accent">
                        <span className="num w-10 shrink-0 text-ink-3">{id}</span>
                        <span className="min-w-0 flex-1 truncate">{lessonTitles[id]}</span>
                        <ArrowRight size={12} className="shrink-0 text-ink-3" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        </FadeIn>
      )}

      {/* Compétences */}
      <section className="py-10" aria-labelledby="competences">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="competences" className="text-[15px] text-ink">
            Score par compétence
          </h2>
          <p className="text-[12px] text-ink-3">Trait vertical : seuil de {passScore} %</p>
        </div>
        <Panel>
          <ul className="divide-y divide-line">
            {c.byCompetence.map((comp, i) => (
              <li key={comp.competence} className="grid gap-x-6 gap-y-2 px-5 py-4 md:grid-cols-[64px_minmax(0,1fr)_minmax(180px,260px)_72px] md:items-center">
                <span className="num text-[13px] text-ink">{comp.competence}</span>
                <span className="text-[13px] leading-snug text-ink-2">{r.competenceLabels[comp.competence] ?? ""}</span>
                <ScoreRule value={comp.percent} threshold={passScore} delay={0.3 + i * 0.06} label={`${comp.competence} : ${comp.percent} %`} />
                <span className="num text-[13px] text-ink md:text-right">
                  {comp.correct}/{comp.total}
                  <span className="ml-2 text-ink-3">{Math.round(comp.percent)} %</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      {/* Correction */}
      <section className="pb-6" aria-labelledby="correction">
        <h2 id="correction" className="mb-5 text-[15px] text-ink">
          Correction détaillée
        </h2>
        <CorrectionList items={c.items} lessonTitles={lessonTitles} lessonHref={lessonHref} />
        <div className="mt-8">
          <Button asChild variant="secondary">
            <Link href={routes.exam(levelId)}>Retour à l&apos;examen</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
