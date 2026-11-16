/**
 * Types structurels du domaine. Le domaine est PUR : il ne lit ni fichiers, ni base, ni horloge implicite
 * (l'heure courante est toujours passée en paramètre `now`). La couche contenu (`@/content`) fournit
 * `ProgrammeStructure` via `getStructure()` ; la couche serveur (`@/server/learner`) fournit `LearnerState`.
 */

export type LessonId = string; // "L001"
export type ModuleId = string; // "M01"
export type LevelId = string; // "N1"

/** Squelette ordonné du programme : niveaux → modules → leçons (ordre = ordre pédagogique). */
export type ProgrammeStructure = {
  levels: {
    id: LevelId;
    modules: {
      id: ModuleId;
      lessons: LessonId[];
    }[];
  }[];
};

/** État d'avancement d'un apprenant, tel que reconstitué depuis la base. */
export type LearnerState = {
  /** Leçons marquées « J'ai terminé ». */
  completedLessons: ReadonlySet<LessonId>;
  /** Leçons ouvertes mais non terminées. */
  startedLessons: ReadonlySet<LessonId>;
  /** Modules dont le quiz a été réussi au moins une fois (≥ seuil). */
  passedQuizzes: ReadonlySet<ModuleId>;
  /** Modules dont le quiz a été réussi sans faute au moins une fois. */
  perfectQuizzes: ReadonlySet<ModuleId>;
  /** Niveaux dont l'examen a été réussi. */
  passedExams: ReadonlySet<LevelId>;
  /** Déblocages manuels (table `unlocks`). */
  manualUnlocks: {
    modules: ReadonlySet<ModuleId>;
    levels: ReadonlySet<LevelId>;
  };
};

/** États d'un nœud du chemin (SPEC : verrouillé / disponible / en cours / terminé / parfait). */
export type NodeState = "locked" | "available" | "in_progress" | "completed" | "perfect";

export function emptyLearnerState(): LearnerState {
  return {
    completedLessons: new Set(),
    startedLessons: new Set(),
    passedQuizzes: new Set(),
    perfectQuizzes: new Set(),
    passedExams: new Set(),
    manualUnlocks: { modules: new Set(), levels: new Set() },
  };
}
