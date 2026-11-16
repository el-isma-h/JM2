"use server";

/**
 * Server actions du parcours : fin de leçon, vérification d'une question de quiz, soumission du quiz.
 * Chaque action revérifie la session et l'accès (domaine) ; la correction se fait ici, jamais côté client.
 */
import { z } from "zod";
import { getLessonNavigation, getModule, getQuiz } from "@/content";
import { canAccessLesson, canTakeQuiz, computeAccess, gradeQuiz } from "@/domain";
import { getSession } from "@/server/auth";
import { loadAccess } from "@/server/learner";
import { completeLesson, recordQuizAttempt } from "@/server/progress";
import { sharedLimiter } from "@/lib/rate-limit";
import { routes } from "@/lib/paths";
import { toRewardBadges, type Rewards } from "@/lib/rewards";
import { getStructure } from "@/content/loader";
import { loadLearnerState } from "@/server/learner";
import type { QuestionFeedback } from "@/lib/quiz-session";

type Fail = { ok: false; error: string };

const lessonIdSchema = z.string().regex(/^L\d{3}$/);
const moduleIdSchema = z.string().regex(/^M\d{2}$/);

const checkLimiter = sharedLimiter("quiz-check", { limit: 240, windowMs: 60_000 });

export type CompleteLessonResult = { ok: true; alreadyDone: boolean; rewards: Rewards; nextHref: string | null; nextLabel: string | null } | Fail;

export async function completeLessonAction(lessonId: string): Promise<CompleteLessonResult> {
  const user = await getSession();
  if (!user) return { ok: false, error: "Session expirée : reconnectez-vous." };
  const parsed = lessonIdSchema.safeParse(lessonId);
  if (!parsed.success) return { ok: false, error: "Leçon inconnue." };
  const { access } = await loadAccess(user.id);
  if (!canAccessLesson(access, parsed.data)) return { ok: false, error: "Cette leçon n'est pas encore débloquée." };

  const r = await completeLesson(user.id, parsed.data);
  const nav = getLessonNavigation(parsed.data);
  let nextHref: string | null = null;
  let nextLabel: string | null = null;
  if (nav?.isLastOfModule) {
    nextHref = routes.quiz(nav.moduleId);
    nextLabel = "Passer le quiz du module";
  } else if (nav?.next) {
    nextHref = routes.lesson(nav.next.id);
    nextLabel = "Leçon suivante";
  }
  return { ok: true, alreadyDone: r.alreadyDone, rewards: { xp: r.xp, badges: toRewardBadges(r.badges) }, nextHref, nextLabel };
}

export type CheckAnswerResult = ({ ok: true } & QuestionFeedback) | Fail;

/** Corrige UNE question déjà répondue (la réponse n'est révélée qu'après le choix de l'apprenant). */
export async function checkQuizAnswerAction(moduleId: string, questionId: string, choice: number): Promise<CheckAnswerResult> {
  const user = await getSession();
  if (!user) return { ok: false, error: "Session expirée : reconnectez-vous." };
  if (!moduleIdSchema.safeParse(moduleId).success || typeof questionId !== "string" || !Number.isInteger(choice) || choice < 0) return { ok: false, error: "Requête invalide." };
  if (!checkLimiter.hit(user.id).allowed) return { ok: false, error: "Trop de requêtes : patientez quelques secondes." };
  const { access } = await loadAccess(user.id);
  if (!canTakeQuiz(access, moduleId)) return { ok: false, error: "Ce quiz n'est pas encore débloqué." };
  const q = getQuiz(moduleId)?.questions.find((x) => x.id === questionId);
  if (!q || choice >= q.options.length) return { ok: false, error: "Question inconnue." };
  return { ok: true, correct: choice === q.answer, answer: q.answer, explanation: q.explanation, source: q.source ?? null };
}

export type SubmitQuizResult =
  | {
      ok: true;
      score: number;
      total: number;
      percent: number;
      passed: boolean;
      perfect: boolean;
      passScore: number;
      rewards: Rewards;
      /** Module suivant débloqué par cette réussite (première fois), sinon null. */
      unlockedModule: { id: string; title: string } | null;
      continueHref: string;
      continueLabel: string;
    }
  | Fail;

export async function submitQuizAction(moduleId: string, choices: Record<string, number>): Promise<SubmitQuizResult> {
  const user = await getSession();
  if (!user) return { ok: false, error: "Session expirée : reconnectez-vous." };
  if (!moduleIdSchema.safeParse(moduleId).success || typeof choices !== "object" || choices === null) return { ok: false, error: "Requête invalide." };
  const { access, structure } = await loadAccess(user.id);
  if (!canTakeQuiz(access, moduleId)) return { ok: false, error: "Ce quiz n'est pas encore débloqué." };
  const quiz = getQuiz(moduleId);
  if (!quiz) return { ok: false, error: "Quiz introuvable." };

  const clean: Record<string, number | null> = {};
  for (const q of quiz.questions) {
    const c = choices[q.id];
    clean[q.id] = Number.isInteger(c) && c >= 0 && c < q.options.length ? c : null;
  }
  const result = gradeQuiz(quiz.questions, clean, quiz.passScore);
  const r = await recordQuizAttempt(user.id, moduleId, result, quiz.passScore);

  // Module suivant : nouvellement ouvert si la réussite vient de le débloquer.
  const level = structure.levels.find((l) => l.modules.some((m) => m.id === moduleId))!;
  const idx = level.modules.findIndex((m) => m.id === moduleId);
  const nextModuleId = level.modules[idx + 1]?.id ?? null;
  let unlockedModule: { id: string; title: string } | null = null;
  if (nextModuleId && !access.modules[nextModuleId].unlocked) {
    const after = computeAccess(getStructure(), await loadLearnerState(user.id));
    if (after.modules[nextModuleId].unlocked) unlockedModule = { id: nextModuleId, title: getModule(nextModuleId)?.title ?? nextModuleId };
  }

  let continueHref: string = routes.level(level.id);
  let continueLabel = "Retour au parcours";
  if (result.passed && nextModuleId) {
    const first = level.modules[idx + 1].lessons[0];
    continueHref = routes.lesson(first);
    continueLabel = "Module suivant";
  } else if (result.passed && !nextModuleId) {
    continueHref = routes.exam(level.id);
    continueLabel = "Voir l'examen du niveau";
  }

  return {
    ok: true,
    score: result.score,
    total: result.total,
    percent: result.percent,
    passed: result.passed,
    perfect: result.perfect,
    passScore: quiz.passScore,
    rewards: { xp: r.xp, badges: toRewardBadges(r.badges) },
    unlockedModule,
    continueHref,
    continueLabel,
  };
}
