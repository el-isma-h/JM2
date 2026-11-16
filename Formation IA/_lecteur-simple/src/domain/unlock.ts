/**
 * Règles de déblocage du parcours (SPEC § « Parcours ») :
 *
 * - Niveau : N1 toujours ouvert ; le niveau suivant s'ouvre quand l'examen du niveau précédent est réussi,
 *   ou par déblocage manuel du niveau.
 * - Module : le 1er module d'un niveau ouvert est ouvert ; le module suivant s'ouvre quand le quiz du module
 *   précédent est réussi (≥ 70 %) ; un déblocage manuel de module l'ouvre quel que soit l'état de son niveau.
 *   Un déblocage manuel de niveau ouvre le niveau (donc son 1er module), la suite se fait normalement.
 * - Leçon : dans un module ouvert, les leçons se suivent (la 1re est disponible, la suivante après « J'ai terminé »
 *   sur la précédente). Une leçon terminée reste toujours accessible.
 * - Quiz de module : disponible quand le module est ouvert et toutes ses leçons terminées.
 * - Examen de niveau : disponible quand le niveau est ouvert et tous les quiz du niveau réussis
 *   (les règles de tentatives sont dans exam.ts).
 */
import type { LearnerState, LessonId, LevelId, ModuleId, NodeState, ProgrammeStructure } from "./types";

/** Leçons séquentielles dans un module (comportement « Duolingo »). */
export const SEQUENTIAL_LESSONS = true;

export type LessonAccess = { id: LessonId; moduleId: ModuleId; levelId: LevelId; state: NodeState; accessible: boolean };

export type ModuleAccess = {
  id: ModuleId;
  levelId: LevelId;
  unlocked: boolean;
  /** Ouvert par un admin/formateur. */
  manuallyUnlocked: boolean;
  lessonsCompleted: number;
  lessonsTotal: number;
  quizUnlocked: boolean;
  quizPassed: boolean;
  quizPerfect: boolean;
  /** Toutes les leçons terminées ET quiz réussi. */
  completed: boolean;
  /** État du nœud « module » sur le chemin. */
  state: NodeState;
  quizState: NodeState;
};

export type LevelAccess = {
  id: LevelId;
  unlocked: boolean;
  manuallyUnlocked: boolean;
  examUnlocked: boolean;
  examPassed: boolean;
  modulesCompleted: number;
  modulesTotal: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  state: NodeState;
};

export type AccessMap = {
  levels: Record<LevelId, LevelAccess>;
  modules: Record<ModuleId, ModuleAccess>;
  lessons: Record<LessonId, LessonAccess>;
  /** Ordres pour itérer sans re-parcourir la structure. */
  levelOrder: LevelId[];
  moduleOrder: ModuleId[];
  lessonOrder: LessonId[];
};

function lessonState(id: LessonId, s: LearnerState, accessible: boolean): NodeState {
  if (s.completedLessons.has(id)) return "completed";
  if (!accessible) return "locked";
  return s.startedLessons.has(id) ? "in_progress" : "available";
}

/** Calcule l'accès à tous les nœuds du programme pour un apprenant. */
export function computeAccess(structure: ProgrammeStructure, s: LearnerState): AccessMap {
  const map: AccessMap = { levels: {}, modules: {}, lessons: {}, levelOrder: [], moduleOrder: [], lessonOrder: [] };

  structure.levels.forEach((level, li) => {
    const prevLevel = li > 0 ? structure.levels[li - 1] : null;
    const manualLevel = s.manualUnlocks.levels.has(level.id);
    const levelUnlocked = li === 0 || manualLevel || (prevLevel !== null && s.passedExams.has(prevLevel.id));

    let modulesCompleted = 0;
    let levelLessonsCompleted = 0;
    let levelLessonsTotal = 0;
    let allQuizzesPassed = level.modules.length > 0;

    level.modules.forEach((mod, mi) => {
      const prevModule = mi > 0 ? level.modules[mi - 1] : null;
      const manualModule = s.manualUnlocks.modules.has(mod.id);
      const unlocked =
        manualModule || (levelUnlocked && (mi === 0 || (prevModule !== null && s.passedQuizzes.has(prevModule.id))));

      let previousDone = true;
      let completedCount = 0;
      for (const lessonId of mod.lessons) {
        const done = s.completedLessons.has(lessonId);
        const accessible = done || (unlocked && (!SEQUENTIAL_LESSONS || previousDone));
        map.lessons[lessonId] = { id: lessonId, moduleId: mod.id, levelId: level.id, state: lessonState(lessonId, s, accessible), accessible };
        map.lessonOrder.push(lessonId);
        if (done) completedCount++;
        previousDone = done;
      }

      const allLessonsDone = completedCount === mod.lessons.length;
      const quizPassed = s.passedQuizzes.has(mod.id);
      const quizPerfect = s.perfectQuizzes.has(mod.id);
      const quizUnlocked = unlocked && allLessonsDone;
      const completed = allLessonsDone && quizPassed;
      if (completed) modulesCompleted++;
      if (!quizPassed) allQuizzesPassed = false;
      levelLessonsCompleted += completedCount;
      levelLessonsTotal += mod.lessons.length;

      const quizState: NodeState = quizPerfect ? "perfect" : quizPassed ? "completed" : quizUnlocked ? "available" : "locked";
      const state: NodeState = !unlocked
        ? completed
          ? quizPerfect
            ? "perfect"
            : "completed"
          : "locked"
        : completed
          ? quizPerfect
            ? "perfect"
            : "completed"
          : completedCount > 0 || mod.lessons.some((l) => s.startedLessons.has(l))
            ? "in_progress"
            : "available";

      map.modules[mod.id] = {
        id: mod.id,
        levelId: level.id,
        unlocked,
        manuallyUnlocked: manualModule,
        lessonsCompleted: completedCount,
        lessonsTotal: mod.lessons.length,
        quizUnlocked,
        quizPassed,
        quizPerfect,
        completed,
        state,
        quizState,
      };
      map.moduleOrder.push(mod.id);
    });

    const examPassed = s.passedExams.has(level.id);
    const examUnlocked = levelUnlocked && allQuizzesPassed;
    const levelState: NodeState = examPassed
      ? "completed"
      : !levelUnlocked
        ? "locked"
        : levelLessonsCompleted > 0 || level.modules.some((m) => s.passedQuizzes.has(m.id))
          ? "in_progress"
          : "available";

    map.levels[level.id] = {
      id: level.id,
      unlocked: levelUnlocked,
      manuallyUnlocked: manualLevel,
      examUnlocked,
      examPassed,
      modulesCompleted,
      modulesTotal: level.modules.length,
      lessonsCompleted: levelLessonsCompleted,
      lessonsTotal: levelLessonsTotal,
      state: levelState,
    };
    map.levelOrder.push(level.id);
  });

  return map;
}

export function canAccessLesson(map: AccessMap, lessonId: LessonId): boolean {
  return map.lessons[lessonId]?.accessible ?? false;
}

export function canTakeQuiz(map: AccessMap, moduleId: ModuleId): boolean {
  return map.modules[moduleId]?.quizUnlocked ?? false;
}

/** L'examen est-il débloqué (hors règles de tentatives, voir exam.ts) ? */
export function canOpenExam(map: AccessMap, levelId: LevelId): boolean {
  return map.levels[levelId]?.examUnlocked ?? false;
}

export type ResumeTarget =
  | { kind: "lesson"; lessonId: LessonId; moduleId: ModuleId; levelId: LevelId }
  | { kind: "quiz"; moduleId: ModuleId; levelId: LevelId }
  | { kind: "exam"; levelId: LevelId }
  | { kind: "done" };

/**
 * « Reprendre » : prochaine action utile dans l'ordre pédagogique.
 * Priorité : leçon en cours, puis 1re leçon disponible, quiz disponible non réussi, examen disponible non réussi.
 */
export function resumeTarget(structure: ProgrammeStructure, map: AccessMap): ResumeTarget {
  for (const id of map.lessonOrder) {
    const l = map.lessons[id];
    if (l.state === "in_progress") return { kind: "lesson", lessonId: id, moduleId: l.moduleId, levelId: l.levelId };
  }
  for (const level of structure.levels) {
    for (const mod of level.modules) {
      for (const lessonId of mod.lessons) {
        const l = map.lessons[lessonId];
        if (l.state === "available") return { kind: "lesson", lessonId, moduleId: mod.id, levelId: level.id };
      }
      const m = map.modules[mod.id];
      if (m.quizUnlocked && !m.quizPassed) return { kind: "quiz", moduleId: mod.id, levelId: level.id };
    }
    const lv = map.levels[level.id];
    if (lv.examUnlocked && !lv.examPassed) return { kind: "exam", levelId: level.id };
  }
  return { kind: "done" };
}

/** Niveau « en cours » : premier niveau ouvert dont l'examen n'est pas réussi (sinon le dernier). */
export function currentLevelId(map: AccessMap): LevelId | null {
  for (const id of map.levelOrder) {
    const lv = map.levels[id];
    if (lv.unlocked && !lv.examPassed) return id;
  }
  return map.levelOrder.at(-1) ?? null;
}

/** Pourcentage global de leçons terminées (0-100, arrondi). */
export function overallProgressPercent(map: AccessMap): number {
  const total = map.lessonOrder.length;
  if (total === 0) return 0;
  const done = map.lessonOrder.filter((id) => map.lessons[id].state === "completed").length;
  return Math.round((done / total) * 100);
}
