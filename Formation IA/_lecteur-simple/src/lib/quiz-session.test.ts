import { describe, expect, it } from "vitest";
import { correctCount, initialQuizState, keyToChoice, mistakeCount, quizProgress, quizReducer, type QuizSessionAction, type QuizSessionState } from "./quiz-session";

const run = (s: QuizSessionState, ...actions: QuizSessionAction[]) => actions.reduce(quizReducer, s);
const ok = { correct: true, answer: 1, explanation: "e" };
const ko = { correct: false, answer: 0, explanation: "e" };

describe("quizReducer", () => {
  it("ne vérifie pas sans choix", () => {
    const s = run(initialQuizState(2), { type: "check" });
    expect(s.phase).toBe("answering");
  });

  it("parcourt sélection → vérification → correction → suivante", () => {
    let s = run(initialQuizState(2), { type: "select", choice: 1 }, { type: "check" });
    expect(s.phase).toBe("checking");
    s = run(s, { type: "select", choice: 3 });
    expect(s.selected).toBe(1); // choix figé pendant la vérification
    s = run(s, { type: "checked", questionId: "Q1", feedback: ok });
    expect(s.phase).toBe("feedback");
    expect(s.choices).toEqual({ Q1: 1 });
    s = run(s, { type: "next" });
    expect(s).toMatchObject({ index: 1, phase: "answering", selected: null });
  });

  it("passe en soumission après la dernière question, puis au résultat", () => {
    let s = run(initialQuizState(1), { type: "select", choice: 0 }, { type: "check" }, { type: "checked", questionId: "Q1", feedback: ko }, { type: "next" });
    expect(s.phase).toBe("submitting");
    s = run(s, { type: "submitted" });
    expect(s.phase).toBe("result");
    expect(mistakeCount(s)).toBe(1);
    expect(correctCount(s)).toBe(0);
  });

  it("une erreur réseau rend la main sans perdre le choix", () => {
    const s = run(initialQuizState(2), { type: "select", choice: 2 }, { type: "check" }, { type: "failed", error: "x" });
    expect(s).toMatchObject({ phase: "answering", selected: 2, error: "x" });
  });

  it("recommencer remet tout à zéro", () => {
    const s = run(initialQuizState(2), { type: "select", choice: 0 }, { type: "check" }, { type: "checked", questionId: "Q1", feedback: ok }, { type: "restart" });
    expect(s).toEqual(initialQuizState(2));
  });

  it("calcule la progression", () => {
    const s = run(initialQuizState(4), { type: "select", choice: 0 }, { type: "check" }, { type: "checked", questionId: "Q1", feedback: ok });
    expect(quizProgress(s)).toBe(0.25);
    expect(quizProgress(initialQuizState(0))).toBe(0);
  });
});

describe("keyToChoice", () => {
  it("associe 1-4 aux options existantes", () => {
    expect(keyToChoice("1", 4)).toBe(0);
    expect(keyToChoice("4", 4)).toBe(3);
    expect(keyToChoice("4", 2)).toBeNull();
    expect(keyToChoice("a", 4)).toBeNull();
    expect(keyToChoice("0", 4)).toBeNull();
  });
});
