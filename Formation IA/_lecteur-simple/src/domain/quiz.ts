/**
 * Quiz de module : correction (indices d'origine, pas de mélange imposé par la SPEC) et vies « non bloquantes ».
 */
import { percentOf } from "./exam";
import { DEFAULT_PASS_SCORE } from "./xp";

export type QuizGradable = { id: string; answer: number };

export type QuizResult = {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  perfect: boolean;
  answers: { questionId: string; choice: number | null; correct: boolean }[];
};

export function isCorrect(q: QuizGradable, choice: number | null | undefined): boolean {
  return choice !== null && choice !== undefined && choice === q.answer;
}

export function gradeQuiz(questions: readonly QuizGradable[], choices: Readonly<Record<string, number | null | undefined>>, passScore = DEFAULT_PASS_SCORE): QuizResult {
  const answers = questions.map((q) => {
    const choice = choices[q.id] ?? null;
    return { questionId: q.id, choice, correct: isCorrect(q, choice) };
  });
  const score = answers.filter((a) => a.correct).length;
  const percent = percentOf(score, questions.length);
  return { score, total: questions.length, percent, passed: percent >= passScore, perfect: questions.length > 0 && score === questions.length, answers };
}

/** Cœurs affichés pendant le quiz : décoratifs, le quiz continue même à 0 (« non bloquants »). */
export const QUIZ_HEARTS = 3;

export function heartsLeft(mistakes: number, hearts = QUIZ_HEARTS): number {
  return Math.max(0, hearts - mistakes);
}
