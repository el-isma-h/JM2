import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, Path } from "@phosphor-icons/react/ssr";
import { requireUser } from "@/server/auth";
import { loadAccess } from "@/server/learner";
import { getLessonProgress } from "@/server/progress";
import { findProgrammeModule, getLesson, getLessonNavigation, getLevel } from "@/content";
import { canAccessLesson } from "@/domain";
import { lessonTimeCap } from "@/domain/lesson-time";
import { lessonIdFromParam, routes } from "@/lib/paths";
import { stripLessonPreamble } from "@/lib/lesson-text";
import { formatMinutes } from "@/lib/utils";
import { Markdown } from "@/components/markdown/markdown";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/motion";
import { ReadingArticle, TableOfContents, TimeTracker } from "@/components/lecon/reading";
import { CompleteLesson } from "@/components/lecon/complete-lesson";
import { TutorSlot } from "@/components/tutor/slot";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const lessonId = lessonIdFromParam(id);
  const lesson = lessonId ? getLesson(lessonId) : null;
  return { title: lesson ? `${lesson.id} — ${lesson.title}` : "Leçon" };
}

export default async function LeconPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const lessonId = lessonIdFromParam(id);
  const lesson = lessonId ? getLesson(lessonId) : null;
  if (!lesson || !lessonId) notFound();

  const { access } = await loadAccess(user.id);
  const found = findProgrammeModule(lesson.module);
  const level = getLevel(lesson.level);
  const moduleTitle = found?.module.title ?? lesson.module;
  const levelLabel = level ? `Niveau ${level.index}` : lesson.level;
  const breadcrumb = (
    <nav className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3" aria-label="Fil d'Ariane">
      <Link href={routes.parcours} className="hover:text-ink">
        Parcours
      </Link>
      <span aria-hidden>/</span>
      <Link href={routes.level(lesson.level)} className="hover:text-ink">
        {levelLabel}
      </Link>
      <span aria-hidden>/</span>
      <span>Module {lesson.module.slice(1)}</span>
      <span aria-hidden>/</span>
      <span>{lesson.id}</span>
    </nav>
  );

  if (!canAccessLesson(access, lessonId)) {
    return (
      <div className="mx-auto max-w-[640px] py-10">
        {breadcrumb}
        <div className="mt-8 border border-line bg-bg-elev p-8 sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center border border-dashed border-line-strong bg-bg-sunken text-ink-3">
            <Lock size={22} aria-hidden />
          </span>
          <h1 className="mt-6 text-[24px] text-ink">Leçon verrouillée</h1>
          <p className="mt-3 text-[14px] text-ink-2">
            « {lesson.title} » s&apos;ouvrira quand vous aurez terminé l&apos;étape précédente du parcours. Les leçons d&apos;un module se suivent, et
            chaque module s&apos;ouvre après la réussite du quiz du précédent.
          </p>
          <Button asChild className="mt-8">
            <Link href={routes.level(lesson.level)}>
              <Path size={15} aria-hidden /> Voir où j&apos;en suis
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const [progress, nav] = [await getLessonProgress(user.id, lessonId), getLessonNavigation(lessonId)];
  const state = access.lessons[lessonId].state;
  const toc = lesson.headings.filter((h) => h.depth === 2).map((h) => ({ id: h.id, text: h.text }));
  const nextAccessible = nav?.next ? canAccessLesson(access, nav.next.id) : false;
  const quizOpen = nav?.isLastOfModule ? access.modules[lesson.module]?.quizUnlocked : false;
  const nextStep = nav?.isLastOfModule
    ? quizOpen
      ? { href: routes.quiz(lesson.module), label: "Passer le quiz du module" }
      : null
    : nav?.next && nextAccessible
      ? { href: routes.lesson(nav.next.id), label: "Leçon suivante" }
      : null;

  return (
    <div>
      <FadeIn>
        <header className="border-b border-line pb-8">
          {breadcrumb}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
              Leçon {lesson.indexInModule} du module
            </span>
            <StatusBadge status={state} />
          </div>
          <h1 className="mt-4 max-w-[24ch] text-[25px] leading-[1.06] text-ink sm:text-[38px]">{lesson.title}</h1>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[12.5px]">
            <div>
              <dt className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink-3">Module</dt>
              <dd className="mt-1 max-w-[36ch] text-ink">{moduleTitle}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink-3">Durée prévue</dt>
              <dd className="num mt-1 text-ink">{formatMinutes(lesson.minutes)}</dd>
            </div>
            <div>
              <dt className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink-3">Temps passé</dt>
              <dd className="mt-1 text-ink">
                <TimeTracker lessonId={lessonId} initialSeconds={progress?.timeSpentSeconds ?? 0} capSeconds={lessonTimeCap(lesson.minutes)} />
              </dd>
            </div>
            {lesson.skills.length ? (
              <div>
                <dt className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink-3">Compétences</dt>
                <dd className="num mt-1 text-ink">{lesson.skills.join(", ")}</dd>
              </div>
            ) : null}
          </dl>
          {lesson.objectives.length ? (
            <div className="mt-8 max-w-[704px] border-l-2 border-accent bg-accent-soft px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Objectifs</p>
              <ul className="mt-3 space-y-2 text-[13.5px] text-ink">
                {lesson.objectives.map((o) => (
                  <li key={o} className="flex gap-3">
                    <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-accent" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </header>
      </FadeIn>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px] xl:gap-14">
        <div className="min-w-0">
          <div className="mb-8">
            <TableOfContents items={toc} variant="inline" />
          </div>
          <ReadingArticle>
            <Markdown source={stripLessonPreamble(lesson.body)} className="[&>h2:first-child]:mt-0 [&>h2:first-child]:border-t-0 [&>h2:first-child]:pt-0" />
          </ReadingArticle>

          {lesson.sources.length ? (
            <section className="mt-14 max-w-[704px] border-t border-line pt-6" aria-labelledby="sources">
              <h2 id="sources" className="font-mono text-[10px] font-medium tracking-[0.22em] text-ink-3">
                Sources de la leçon
              </h2>
              <ul className="mt-3 space-y-1.5 text-[13px]">
                {lesson.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-accent underline decoration-1 underline-offset-4 hover:decoration-2">
                      {s.title}
                    </a>
                    {s.lang ? <span className="ml-2 font-mono text-[10px] uppercase text-ink-3">{s.lang}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-12 max-w-[704px]">
            <CompleteLesson lessonId={lessonId} completedAt={progress?.completedAt ? progress.completedAt.toISOString() : null} next={nextStep} />
          </div>

          <nav className="mt-6 grid max-w-[704px] gap-px border border-line bg-line sm:grid-cols-2" aria-label="Leçons précédente et suivante">
            {nav?.prev ? (
              <Link href={routes.lesson(nav.prev.id)} className="group flex flex-col gap-1 bg-bg p-5 transition-colors hover:bg-bg-sunken">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
                  <ArrowLeft size={12} aria-hidden /> Précédente · {nav.prev.id}
                </span>
                <span className="text-[13px] text-ink">{nav.prev.title}</span>
              </Link>
            ) : (
              <span className="bg-bg p-5" />
            )}
            {nav?.next ? (
              nextAccessible ? (
                <Link href={routes.lesson(nav.next.id)} className="group flex flex-col items-end gap-1 bg-bg p-5 text-right transition-colors hover:bg-bg-sunken">
                  <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
                    Suivante · {nav.next.id} <ArrowRight size={12} aria-hidden />
                  </span>
                  <span className="text-[13px] text-ink">{nav.next.title}</span>
                </Link>
              ) : (
                <span className="flex flex-col items-end gap-1 bg-bg p-5 text-right" aria-disabled="true">
                  <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
                    Suivante · {nav.next.id} <Lock size={12} aria-hidden />
                  </span>
                  <span className="text-[13px] text-ink-3">{nav.isLastOfModule ? "Après le quiz du module" : "Terminez cette leçon pour l'ouvrir"}</span>
                </span>
              )
            ) : (
              <span className="bg-bg p-5" />
            )}
          </nav>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-10">
            <TableOfContents items={toc} variant="aside" />
          </div>
        </aside>
      </div>

      <TutorSlot lessonId={lessonId} />
    </div>
  );
}
