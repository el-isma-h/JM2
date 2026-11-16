import { describe, expect, it } from "vitest";
import { computeAccess } from "./unlock";
import { emptyLearnerState, type LearnerState, type ProgrammeStructure } from "./types";
import { buildLevelPath, isDone, levelPercent, nextMilestone, nodeKey, pathOffset } from "./path";

const structure: ProgrammeStructure = {
  levels: [
    { id: "N1", modules: [{ id: "M01", lessons: ["L001", "L002"] }, { id: "M02", lessons: ["L003"] }] },
    { id: "N2", modules: [{ id: "M03", lessons: ["L004"] }] },
  ],
};

function state(p: Partial<Omit<LearnerState, "manualUnlocks">> = {}): LearnerState {
  return { ...emptyLearnerState(), ...p };
}

describe("pathOffset", () => {
  it("dessine une vague bornée qui se répète tous les 8 pas", () => {
    for (let i = 0; i < 24; i++) {
      expect(Math.abs(pathOffset(i))).toBeLessThanOrEqual(1);
      expect(pathOffset(i)).toBe(pathOffset(i + 8));
    }
    expect(pathOffset(0)).toBe(0);
    expect(pathOffset(2)).toBeGreaterThan(0);
    expect(pathOffset(6)).toBeLessThan(0);
  });
});

describe("buildLevelPath", () => {
  it("produit leçons + quiz par module puis l'examen, avec des index continus", () => {
    const path = buildLevelPath(structure, computeAccess(structure, state()), "N1")!;
    const keys = [...path.modules.flatMap((m) => m.nodes), path.exam].map(nodeKey);
    expect(keys).toEqual(["lesson:L001", "lesson:L002", "quiz:M01", "lesson:L003", "quiz:M02", "exam:N1"]);
    expect(path.exam.index).toBe(5);
    expect(path.totalNodes).toBe(6);
  });

  it("au départ : 1re leçon actuelle et disponible, le reste verrouillé", () => {
    const path = buildLevelPath(structure, computeAccess(structure, state()), "N1")!;
    expect(path.currentKey).toBe("lesson:L001");
    expect(path.modules[0].nodes[1].state).toBe("locked");
    expect(path.modules[0].nodes[2].accessible).toBe(false);
    expect(path.exam.state).toBe("locked");
  });

  it("la leçon en cours a priorité sur une leçon disponible", () => {
    const s = state({ completedLessons: new Set(["L001"]), startedLessons: new Set(["L002"]) });
    const path = buildLevelPath(structure, computeAccess(structure, s), "N1")!;
    expect(path.currentKey).toBe("lesson:L002");
    expect(path.doneNodes).toBe(1);
  });

  it("quiz disponible après les leçons, parfait si 100 %, examen ouvert après tous les quiz", () => {
    const s = state({ completedLessons: new Set(["L001", "L002", "L003"]), passedQuizzes: new Set(["M01", "M02"]), perfectQuizzes: new Set(["M01"]) });
    const path = buildLevelPath(structure, computeAccess(structure, s), "N1")!;
    expect(path.modules[0].nodes[2].state).toBe("perfect");
    expect(path.modules[1].nodes[1].state).toBe("completed");
    expect(path.exam.state).toBe("available");
    expect(path.currentKey).toBe("exam:N1");
  });

  it("niveau verrouillé : aucun nœud actuel", () => {
    const path = buildLevelPath(structure, computeAccess(structure, state()), "N2")!;
    expect(path.currentKey).toBeNull();
    expect(path.modules[0].nodes.every((n) => n.state === "locked")).toBe(true);
  });

  it("niveau inconnu → null", () => {
    expect(buildLevelPath(structure, computeAccess(structure, state()), "N9")).toBeNull();
  });
});

describe("nextMilestone", () => {
  it("annonce le quiz du module en cours avec le nombre de leçons restantes", () => {
    const s = state({ completedLessons: new Set(["L001"]) });
    expect(nextMilestone(structure, computeAccess(structure, s))).toEqual({ kind: "quiz", moduleId: "M01", levelId: "N1", lessonsLeft: 1, unlocked: false });
  });

  it("annonce l'examen quand tous les quiz du niveau sont réussis", () => {
    const s = state({ completedLessons: new Set(["L001", "L002", "L003"]), passedQuizzes: new Set(["M01", "M02"]) });
    expect(nextMilestone(structure, computeAccess(structure, s))).toEqual({ kind: "exam", levelId: "N1", unlocked: true });
  });

  it("passe au niveau suivant une fois l'examen réussi, null quand tout est fini", () => {
    const s = state({ completedLessons: new Set(["L001", "L002", "L003"]), passedQuizzes: new Set(["M01", "M02"]), passedExams: new Set(["N1"]) });
    expect(nextMilestone(structure, computeAccess(structure, s))).toMatchObject({ kind: "quiz", moduleId: "M03", levelId: "N2" });
    const all = state({ completedLessons: new Set(["L001", "L002", "L003", "L004"]), passedQuizzes: new Set(["M01", "M02", "M03"]), passedExams: new Set(["N1", "N2"]) });
    expect(nextMilestone(structure, computeAccess(structure, all))).toBeNull();
  });
});

describe("levelPercent / isDone", () => {
  it("calcule le pourcentage de leçons du niveau", () => {
    const access = computeAccess(structure, state({ completedLessons: new Set(["L001"]) }));
    expect(levelPercent(access, "N1")).toBe(33);
    expect(levelPercent(access, "N2")).toBe(0);
    expect(levelPercent(access, "N9")).toBe(0);
  });
  it("terminé ou parfait comptent comme faits", () => {
    expect(isDone("completed")).toBe(true);
    expect(isDone("perfect")).toBe(true);
    expect(isDone("in_progress")).toBe(false);
  });
});
