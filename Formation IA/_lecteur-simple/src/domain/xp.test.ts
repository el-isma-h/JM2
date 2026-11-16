import { describe, expect, it } from "vitest";
import { XP, examXp, lessonXp, quizXp, totalXp, xpRank } from "./xp";

describe("barème XP", () => {
  it("leçon +20", () => expect(lessonXp("L001")).toEqual([{ reason: "lesson_complete", refId: "L001", amount: 20 }]));
  it("quiz échoué : 0", () => expect(quizXp("M01", 60)).toEqual([]));
  it("quiz réussi : +50", () => expect(totalXp(quizXp("M01", 70))).toBe(50));
  it("quiz sans faute : +100 au total", () => {
    const a = quizXp("M01", 100);
    expect(totalXp(a)).toBe(100);
    expect(a.map((x) => x.reason)).toEqual(["quiz_pass", "quiz_perfect"]);
  });
  it("examen réussi +300", () => {
    expect(totalXp(examXp("N1", true))).toBe(XP.examPass);
    expect(examXp("N1", false)).toEqual([]);
  });
  it("paliers", () => {
    expect(xpRank(0).title).toBe("Curieux");
    const r = xpRank(400);
    expect(r.title).toBe("Initié");
    expect(r.nextMin).toBe(600);
    expect(r.progress).toBeCloseTo(0.5);
    expect(xpRank(99999).nextMin).toBeNull();
  });
});
