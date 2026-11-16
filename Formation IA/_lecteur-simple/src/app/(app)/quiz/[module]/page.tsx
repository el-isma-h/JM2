import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { Lock, Path } from "@phosphor-icons/react/ssr";
import { requireUser } from "@/server/auth";
import { loadAccess } from "@/server/learner";
import { db, schema } from "@/db";
import { getModule, getPublicQuiz, getLevel } from "@/content";
import { canTakeQuiz } from "@/domain";
import { moduleIdFromParam, routes } from "@/lib/paths";
import { formatDate, plural } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { QuizRunner } from "@/components/quiz/quiz-runner";

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const { module } = await params;
  const id = moduleIdFromParam(module);
  const mod = id ? getModule(id) : null;
  return { title: mod ? `Quiz ${mod.id} — ${mod.title}` : "Quiz du module" };
}

export default async function QuizModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const user = await requireUser();
  const moduleId = moduleIdFromParam(module);
  const mod = moduleId ? getModule(moduleId) : null;
  if (!mod || !moduleId) notFound();
  const quiz = getPublicQuiz(moduleId);
  if (!quiz) notFound();
  const level = getLevel(mod.level);
  const levelHref = routes.level(mod.level);

  const { access } = await loadAccess(user.id);
  const ma = access.modules[moduleId];

  const header = (
    <div className="mx-auto mb-8 max-w-[720px]">
      <nav className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3" aria-label="Fil d'Ariane">
        <Link href={routes.parcours} className="hover:text-ink">
          Parcours
        </Link>
        <span aria-hidden>/</span>
        <Link href={levelHref} className="hover:text-ink">
          {level ? `Niveau ${level.index}` : mod.level}
        </Link>
        <span aria-hidden>/</span>
        <span>Quiz du module {mod.id.slice(1)}</span>
      </nav>
      <h1 className="mt-4 text-[22px] text-ink sm:text-[28px]">{mod.title}</h1>
    </div>
  );

  if (!canTakeQuiz(access, moduleId)) {
    const left = ma ? ma.lessonsTotal - ma.lessonsCompleted : 0;
    return (
      <div className="py-6">
        {header}
        <div className="mx-auto max-w-[720px] border border-line bg-bg-elev p-8 sm:p-10">
          <span className="flex h-12 w-12 rotate-45 items-center justify-center border border-dashed border-line-strong bg-bg-sunken text-ink-3">
            <Lock size={20} className="-rotate-45" aria-hidden />
          </span>
          <h2 className="mt-7 text-[20px] text-ink">Quiz verrouillé</h2>
          <p className="mt-3 text-[14px] text-ink-2">
            {ma?.unlocked ? `Terminez encore ${plural(left, "leçon")} du module pour ouvrir le quiz.` : "Ce module n'est pas encore ouvert : réussissez le quiz du module précédent."}
          </p>
          <Button asChild className="mt-8">
            <Link href={levelHref}>
              <Path size={15} aria-hidden /> Retour au chemin
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const [best] = await db
    .select({ percent: schema.quizAttempts.percent, at: schema.quizAttempts.at })
    .from(schema.quizAttempts)
    .where(and(eq(schema.quizAttempts.userId, user.id), eq(schema.quizAttempts.moduleId, moduleId)))
    .orderBy(desc(schema.quizAttempts.percent), desc(schema.quizAttempts.at))
    .limit(1);

  return (
    <div className="py-2">
      {header}
      <p className="mx-auto -mt-5 mb-8 max-w-[720px] text-[12.5px] text-ink-3">
        {plural(quiz.questions.length, "question")} · réussite à {quiz.passScore} % · essais illimités
        {best ? ` · meilleur score : ${Math.round(best.percent)} % (${formatDate(best.at)})` : ""}
      </p>
      <QuizRunner moduleId={moduleId} moduleTitle={`Quiz du module ${mod.id.slice(1)}`} questions={quiz.questions} exitHref={levelHref} />
    </div>
  );
}
