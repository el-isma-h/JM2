import { describe, expect, it } from "vitest";
import { emptyLearnerState, type LearnerState, type ProgrammeStructure } from "./types";
import { canAccessLesson, canOpenExam, canTakeQuiz, computeAccess, currentLevelId, overallProgressPercent, resumeTarget } from "./unlock";

const structure: ProgrammeStructure = {
  levels: [
    { id: "N1", modules: [ { id: "M01", lessons: ["L001", "L002"] }, { id: "M02", lessons: ["L003", "L004"] } ] },
    { id: "N2", modules: [ { id: "M03", lessons: ["L005"] }, { id: "M04", lessons: ["L006"] } ] },
  ],
};

type StateInput = {
  completedLessons?: string[];
  startedLessons?: string[];
  passedQuizzes?: string[];
  perfectQuizzes?: string[];
  passedExams?: string[];
  modules?: string[];
  levels?: string[];
};

function state(p: StateInput = {}): LearnerState {
  const s = emptyLearnerState();
  return {
    completedLessons: new Set(p.completedLessons ?? s.completedLessons),
    startedLessons: new Set(p.startedLessons ?? s.startedLessons),
    passedQuizzes: new Set(p.passedQuizzes ?? s.passedQuizzes),
    perfectQuizzes: new Set(p.perfectQuizzes ?? s.perfectQuizzes),
    passedExams: new Set(p.passedExams ?? s.passedExams),
    manualUnlocks: { modules: new Set(p.modules ?? []), levels: new Set(p.levels ?? []) },
  };
}

describe("computeAccess", () => {
  it("nouvel apprenant : seule la 1re leçon de N1 est disponible", () => {
    const m = computeAccess(structure, state());
    expect(m.levels.N1.unlocked).toBe(true);
    expect(m.levels.N2.unlocked).toBe(false);
    expect(m.modules.M01.unlocked).toBe(true);
    expect(m.modules.M02.unlocked).toBe(false);
    expect(m.lessons.L001.state).toBe("available");
    expect(m.lessons.L002.state).toBe("locked");
    expect(canTakeQuiz(m, "M01")).toBe(false);
    expect(canOpenExam(m, "N1")).toBe(false);
  });

  it("leçons séquentielles et état en cours", () => {
    const m = computeAccess(structure, state({ completedLessons: ["L001"], startedLessons: ["L002"] }));
    expect(m.lessons.L001.state).toBe("completed");
    expect(m.lessons.L002.state).toBe("in_progress");
    expect(m.modules.M01.state).toBe("in_progress");
    expect(canAccessLesson(m, "L003")).toBe(false);
  });

  it("quiz débloqué après toutes les leçons, module suivant après réussite du quiz", () => {
    const m1 = computeAccess(structure, state({ completedLessons: ["L001", "L002"] }));
    expect(m1.modules.M01.quizUnlocked).toBe(true);
    expect(m1.modules.M02.unlocked).toBe(false);
    const m2 = computeAccess(structure, state({ completedLessons: ["L001", "L002"], passedQuizzes: ["M01"] }));
    expect(m2.modules.M01.completed).toBe(true);
    expect(m2.modules.M01.state).toBe("completed");
    expect(m2.modules.M02.unlocked).toBe(true);
    expect(m2.lessons.L003.state).toBe("available");
  });

  it("module parfait si quiz sans faute", () => {
    const m = computeAccess(structure, state({ completedLessons: ["L001", "L002"], passedQuizzes: ["M01"], perfectQuizzes: ["M01"] }));
    expect(m.modules.M01.state).toBe("perfect");
    expect(m.modules.M01.quizState).toBe("perfect");
  });

  it("examen après tous les quiz du niveau ; niveau suivant après l'examen", () => {
    const base = { completedLessons: ["L001", "L002", "L003", "L004"], passedQuizzes: ["M01", "M02"] };
    const m1 = computeAccess(structure, state(base));
    expect(m1.levels.N1.examUnlocked).toBe(true);
    expect(m1.levels.N2.unlocked).toBe(false);
    const m2 = computeAccess(structure, state({ ...base, passedExams: ["N1"] }));
    expect(m2.levels.N1.state).toBe("completed");
    expect(m2.levels.N2.unlocked).toBe(true);
    expect(m2.modules.M03.unlocked).toBe(true);
    expect(m2.modules.M04.unlocked).toBe(false);
  });

  it("déblocage manuel de niveau : ouvre le niveau et son 1er module seulement", () => {
    const m = computeAccess(structure, state({ levels: ["N2"] }));
    expect(m.levels.N2.unlocked).toBe(true);
    expect(m.levels.N2.manuallyUnlocked).toBe(true);
    expect(m.modules.M03.unlocked).toBe(true);
    expect(m.modules.M04.unlocked).toBe(false);
  });

  it("déblocage manuel de module : l'ouvre même si son niveau est verrouillé", () => {
    const m = computeAccess(structure, state({ modules: ["M04"] }));
    expect(m.levels.N2.unlocked).toBe(false);
    expect(m.modules.M04.unlocked).toBe(true);
    expect(m.lessons.L006.state).toBe("available");
  });

  it("une leçon terminée reste accessible", () => {
    const m = computeAccess(structure, state({ completedLessons: ["L006"] }));
    expect(canAccessLesson(m, "L006")).toBe(true);
  });
});

describe("resumeTarget / currentLevelId / progression", () => {
  it("reprend la leçon en cours en priorité", () => {
    const s = state({ completedLessons: ["L001"], startedLessons: ["L002"] });
    expect(resumeTarget(structure, computeAccess(structure, s))).toEqual({ kind: "lesson", lessonId: "L002", moduleId: "M01", levelId: "N1" });
  });
  it("propose le quiz puis l'examen", () => {
    const q = computeAccess(structure, state({ completedLessons: ["L001", "L002"] }));
    expect(resumeTarget(structure, q)).toEqual({ kind: "quiz", moduleId: "M01", levelId: "N1" });
    const e = computeAccess(structure, state({ completedLessons: ["L001", "L002", "L003", "L004"], passedQuizzes: ["M01", "M02"] }));
    expect(resumeTarget(structure, e)).toEqual({ kind: "exam", levelId: "N1" });
    expect(currentLevelId(e)).toBe("N1");
  });
  it("pourcentage global", () => {
    const m = computeAccess(structure, state({ completedLessons: ["L001", "L002", "L003"] }));
    expect(overallProgressPercent(m)).toBe(50);
  });
});
