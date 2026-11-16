import { describe, expect, it } from "vitest";
import { gradeQuiz, heartsLeft } from "./quiz";

describe("gradeQuiz", () => {
  const qs = Array.from({ length: 10 }, (_, i) => ({ id: `M01-Q${i}`, answer: 1 }));
  it("réussite à 70 %", () => {
    const r = gradeQuiz(qs, Object.fromEntries(qs.map((q, i) => [q.id, i < 7 ? 1 : 0])));
    expect(r).toMatchObject({ score: 7, total: 10, percent: 70, passed: true, perfect: false });
  });
  it("sans faute", () => expect(gradeQuiz(qs, Object.fromEntries(qs.map((q) => [q.id, 1]))).perfect).toBe(true));
  it("réponses manquantes = fausses", () => expect(gradeQuiz(qs, {}).score).toBe(0));
  it("cœurs non bloquants", () => {
    expect(heartsLeft(1)).toBe(2);
    expect(heartsLeft(5)).toBe(0);
  });
});
