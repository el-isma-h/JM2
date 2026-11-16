import { describe, expect, it } from "vitest";
import {
  applyExamOrder,
  buildExamOrder,
  canSubmitAttempt,
  examAttemptStatus,
  examDeadline,
  gradeExam,
  passedAttemptNumber,
  remainingSeconds,
  seedFromString,
  seededRandom,
  toDisplayedChoice,
  toOriginalChoice,
  type AttemptLike,
} from "./exam";

const questions = Array.from({ length: 10 }, (_, i) => ({ id: `Q${i}`, options: ["a", "b", "c", "d"], answer: i % 4, competence: i < 5 ? "C1.1" : "C1.2" }));

describe("mélange", () => {
  it("permutation complète et reproductible avec une graine", () => {
    const o1 = buildExamOrder(questions, seededRandom(seedFromString("attempt-1")));
    const o2 = buildExamOrder(questions, seededRandom(seedFromString("attempt-1")));
    expect(o1).toEqual(o2);
    expect([...o1.questionOrder].sort()).toEqual(questions.map((q) => q.id).sort());
    for (const q of questions) expect([...o1.optionOrders[q.id]].sort()).toEqual([0, 1, 2, 3]);
  });

  it("applyExamOrder permute les options et la conversion affiché ↔ origine est cohérente", () => {
    const order = buildExamOrder(questions, seededRandom(42));
    const shown = applyExamOrder(questions.map(({ id, options }) => ({ id, options })), order);
    expect(shown.map((q) => q.id)).toEqual(order.questionOrder);
    for (const q of shown) {
      const perm = order.optionOrders[q.id];
      q.options.forEach((label, displayed) => {
        const original = toOriginalChoice(perm, displayed)!;
        expect(["a", "b", "c", "d"][original]).toBe(label);
        expect(toDisplayedChoice(perm, original)).toBe(displayed);
      });
    }
    expect(toOriginalChoice([2, 0, 1], null)).toBeNull();
    expect(toOriginalChoice([2, 0, 1], 9)).toBeNull();
  });
});

describe("gradeExam", () => {
  it("score, pourcentage, seuil 70 % et détail par compétence", () => {
    const answers: Record<string, number | null> = {};
    questions.forEach((q, i) => (answers[q.id] = i < 7 ? q.answer : null));
    const r = gradeExam(questions, answers);
    expect(r.score).toBe(7);
    expect(r.percent).toBe(70);
    expect(r.passed).toBe(true);
    expect(r.byCompetence).toEqual([
      { competence: "C1.1", correct: 5, total: 5, percent: 100 },
      { competence: "C1.2", correct: 2, total: 5, percent: 40 },
    ]);
  });
  it("69 % échoue", () => {
    const qs = Array.from({ length: 100 }, (_, i) => ({ id: `q${i}`, answer: 0 }));
    const answers = Object.fromEntries(qs.map((q, i) => [q.id, i < 69 ? 0 : 1]));
    expect(gradeExam(qs, answers).passed).toBe(false);
  });
});

describe("tentatives", () => {
  const t0 = new Date("2026-11-01T10:00:00Z");
  const H = 3_600_000;
  const D = 24 * H;
  const attempt = (i: number, startedAt: Date, extra: Partial<AttemptLike> = {}): AttemptLike => ({
    id: `a${i}`,
    startedAt,
    deadlineAt: examDeadline(startedAt, 60),
    submittedAt: new Date(startedAt.getTime() + 30 * 60_000),
    passed: false,
    voidedAt: null,
    ...extra,
  });

  it("disponible sans tentative", () => expect(examAttemptStatus([], t0)).toEqual({ kind: "available", attemptsUsed: 0, remaining: 3 }));

  it("en cours tant que l'échéance n'est pas passée", () => {
    const a = attempt(1, t0, { submittedAt: null, passed: null });
    const s = examAttemptStatus([a], new Date(t0.getTime() + 59 * 60_000));
    expect(s.kind).toBe("in_progress");
    expect(remainingSeconds(a, new Date(t0.getTime() + 59 * 60_000))).toBe(60);
    expect(canSubmitAttempt(a, new Date(t0.getTime() + 60 * 60_000 + 10_000))).toBe(true);
    expect(canSubmitAttempt(a, new Date(t0.getTime() + 62 * 60_000))).toBe(false);
  });

  it("tentative expirée non soumise : à finaliser", () => {
    const a = attempt(1, t0, { submittedAt: null, passed: null });
    expect(examAttemptStatus([a], new Date(t0.getTime() + 2 * H)).kind).toBe("needs_finalize");
  });

  it("délai de 7 jours après un échec", () => {
    const a = attempt(1, t0);
    const s = examAttemptStatus([a], new Date(t0.getTime() + 6 * D));
    expect(s.kind).toBe("cooldown");
    if (s.kind === "cooldown") expect(s.nextAvailableAt.getTime()).toBe(a.submittedAt!.getTime() + 7 * D);
    expect(examAttemptStatus([a], new Date(t0.getTime() + 8 * D))).toEqual({ kind: "available", attemptsUsed: 1, remaining: 2 });
  });

  it("3 tentatives maximum, les tentatives annulées ne comptent pas", () => {
    const list = [attempt(1, t0), attempt(2, new Date(t0.getTime() + 8 * D)), attempt(3, new Date(t0.getTime() + 16 * D))];
    expect(examAttemptStatus(list, new Date(t0.getTime() + 40 * D))).toEqual({ kind: "exhausted", attemptsUsed: 3 });
    const voided = [...list.slice(0, 2), { ...list[2], voidedAt: new Date() }];
    expect(examAttemptStatus(voided, new Date(t0.getTime() + 40 * D))).toEqual({ kind: "available", attemptsUsed: 2, remaining: 1 });
  });

  it("réussi : plus de tentative, numéro de la tentative réussie", () => {
    const list = [attempt(1, t0, { voidedAt: new Date() }), attempt(2, new Date(t0.getTime() + D)), attempt(3, new Date(t0.getTime() + 9 * D), { passed: true })];
    expect(examAttemptStatus(list, new Date(t0.getTime() + 10 * D))).toEqual({ kind: "passed", attemptId: "a3" });
    expect(passedAttemptNumber(list)).toBe(2);
  });
});
