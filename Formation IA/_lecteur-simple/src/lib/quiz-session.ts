/**
 * Machine d'état du lecteur de quiz (/quiz/[module]), côté client. Pure : testée sans React.
 *
 * Phases : `answering` (choix possible) → `checking` (vérification serveur en cours) → `feedback` (correction
 * affichée) → question suivante… → `submitting` → `result`. La correction vient TOUJOURS du serveur
 * (server action) : le client ne connaît la bonne réponse d'une question qu'après l'avoir validée.
 */
import type { SourceRef } from "@/content/types";

export type QuestionFeedback = { correct: boolean; answer: number; explanation: string; source?: SourceRef | null };

export type QuizPhase = "answering" | "checking" | "feedback" | "submitting" | "result";

export type QuizSessionState = {
  total: number;
  index: number;
  phase: QuizPhase;
  /** Choix courant (index d'option) avant validation. */
  selected: number | null;
  /** Réponses validées : questionId → index choisi. */
  choices: Record<string, number>;
  feedback: Record<string, QuestionFeedback>;
  error: string | null;
};

export type QuizSessionAction =
  | { type: "select"; choice: number }
  | { type: "check" }
  | { type: "checked"; questionId: string; feedback: QuestionFeedback }
  | { type: "failed"; error: string }
  | { type: "next" }
  | { type: "submitted" }
  | { type: "restart" };

export function initialQuizState(total: number): QuizSessionState {
  return { total, index: 0, phase: "answering", selected: null, choices: {}, feedback: {}, error: null };
}

export function quizReducer(s: QuizSessionState, a: QuizSessionAction): QuizSessionState {
  switch (a.type) {
    case "select":
      return s.phase === "answering" ? { ...s, selected: a.choice, error: null } : s;
    case "check":
      return s.phase === "answering" && s.selected !== null ? { ...s, phase: "checking", error: null } : s;
    case "checked":
      if (s.phase !== "checking" || s.selected === null) return s;
      return { ...s, phase: "feedback", choices: { ...s.choices, [a.questionId]: s.selected }, feedback: { ...s.feedback, [a.questionId]: a.feedback } };
    case "failed":
      return { ...s, phase: s.phase === "submitting" ? "submitting" : "answering", error: a.error };
    case "next":
      if (s.phase !== "feedback") return s;
      if (s.index + 1 >= s.total) return { ...s, phase: "submitting", selected: null };
      return { ...s, index: s.index + 1, phase: "answering", selected: null };
    case "submitted":
      return { ...s, phase: "result", error: null };
    case "restart":
      return initialQuizState(s.total);
  }
}

export function correctCount(s: QuizSessionState): number {
  return Object.values(s.feedback).filter((f) => f.correct).length;
}

export function mistakeCount(s: QuizSessionState): number {
  return Object.values(s.feedback).filter((f) => !f.correct).length;
}

/** Progression affichée (0-1) : questions validées / total. */
export function quizProgress(s: QuizSessionState): number {
  if (s.total === 0) return 0;
  return Object.keys(s.feedback).length / s.total;
}

/** Touche clavier → index d'option (« 1 » à « 9 »), null sinon ou hors limites. */
export function keyToChoice(key: string, optionsCount: number): number | null {
  if (!/^[1-9]$/.test(key)) return null;
  const n = Number(key) - 1;
  return n < optionsCount ? n : null;
}
