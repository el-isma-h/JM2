import { describe, expect, it } from "vitest";
import { BADGES, evaluateBadges, newBadges, type BadgeContext } from "./badges";
import { parisHour } from "./streak";

const base: BadgeContext = {
  lessonCompletions: [],
  modulesCompleted: 0,
  quizAttempts: [],
  passedExams: new Set(),
  examPassAttemptNumber: {},
  longestStreak: 0,
  tutorQuestions: 0,
  hasPersonalApiKey: false,
  hourOf: parisHour,
};

describe("catalogue", () => {
  it("au moins 15 badges, identifiants uniques", () => {
    expect(BADGES.length).toBeGreaterThanOrEqual(15);
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
  });
});

describe("evaluateBadges", () => {
  it("aucun badge au départ", () => expect(evaluateBadges(base)).toEqual([]));

  it("première leçon, paliers de leçons", () => {
    const d = new Date("2026-11-02T10:00:00Z");
    expect(evaluateBadges({ ...base, lessonCompletions: [d] })).toContain("premiere-lecon");
    const ten = evaluateBadges({ ...base, lessonCompletions: Array(10).fill(d) });
    expect(ten).toEqual(expect.arrayContaining(["premiere-lecon", "lecons-10"]));
    expect(ten).not.toContain("lecons-50");
    expect(evaluateBadges({ ...base, lessonCompletions: Array(150).fill(d) })).toContain("lecons-150");
  });

  it("quiz : premier, sans-faute, précision", () => {
    const attempts = ["M01", "M02", "M03", "M04", "M05"].map((moduleId) => ({ moduleId, percent: 100, passed: true }));
    const r = evaluateBadges({ ...base, quizAttempts: attempts });
    expect(r).toEqual(expect.arrayContaining(["premier-quiz", "sans-faute", "sans-faute-5"]));
    const failed = evaluateBadges({ ...base, quizAttempts: [{ moduleId: "M01", percent: 40, passed: false }] });
    expect(failed).not.toContain("premier-quiz");
  });

  it("séries 3 / 7 / 30", () => {
    expect(evaluateBadges({ ...base, longestStreak: 7 })).toEqual(["serie-3", "serie-7"]);
    expect(evaluateBadges({ ...base, longestStreak: 30 })).toContain("serie-30");
  });

  it("oiseau de nuit et lève-tôt (heure de Paris)", () => {
    // 00 h 30 Paris en hiver = 23 h 30 UTC la veille
    expect(evaluateBadges({ ...base, lessonCompletions: [new Date("2026-01-14T23:30:00Z")] })).toContain("oiseau-de-nuit");
    // 6 h Paris en hiver = 5 h UTC
    expect(evaluateBadges({ ...base, lessonCompletions: [new Date("2026-01-15T05:00:00Z")] })).toContain("leve-tot");
  });

  it("niveaux, premier coup, module, tuteur, clé API", () => {
    const r = evaluateBadges({
      ...base,
      passedExams: new Set(["N1", "N2"]),
      examPassAttemptNumber: { N1: 1, N2: 2 },
      modulesCompleted: 1,
      tutorQuestions: 1,
      hasPersonalApiKey: true,
    });
    expect(r).toEqual(expect.arrayContaining(["niveau-1", "niveau-2", "examen-premier-coup", "module-termine", "tuteur-consulte", "cle-api"]));
    expect(r).not.toContain("niveau-3");
    expect(evaluateBadges({ ...base, passedExams: new Set(["N1"]), examPassAttemptNumber: { N1: 2 } })).not.toContain("examen-premier-coup");
  });

  it("newBadges ne renvoie que les manquants", () => expect(newBadges(["a", "b"], ["a"])).toEqual(["b"]));
});
