/**
 * Chemin « Duolingo » d'un niveau : suite ordonnée de nœuds (leçons, quiz de fin de module, examen de fin de niveau)
 * dérivée de `computeAccess` (aucune règle de déblocage nouvelle ici), avec un décalage horizontal sinueux et le
 * nœud « actuel » (celui vers lequel on fait défiler et qui pulse).
 */
import type { AccessMap } from "./unlock";
import type { LevelId, ModuleId, NodeState, ProgrammeStructure } from "./types";

export type PathNodeKind = "lesson" | "quiz" | "exam";

export type PathNode = {
  kind: PathNodeKind;
  /** LessonId (leçon), ModuleId (quiz) ou LevelId (examen). */
  id: string;
  moduleId: ModuleId | null;
  state: NodeState;
  accessible: boolean;
  /** Décalage horizontal normalisé (-1 … 1) : multiplié par l'amplitude à l'affichage. */
  offset: number;
  /** Rang du nœud dans le chemin du niveau (0-based). */
  index: number;
};

export type PathModule = { moduleId: ModuleId; nodes: PathNode[] };

export type LevelPath = {
  levelId: LevelId;
  modules: PathModule[];
  exam: PathNode;
  /** Clé (`nodeKey`) du nœud actuel, null si le niveau est verrouillé ou entièrement terminé. */
  currentKey: string | null;
  totalNodes: number;
  doneNodes: number;
};

/** Motif sinueux sur 8 pas : centre → droite → centre → gauche (forme en S répétée). */
const WAVE = [0, 0.55, 0.95, 0.55, 0, -0.55, -0.95, -0.55] as const;

export function pathOffset(index: number): number {
  const i = ((index % WAVE.length) + WAVE.length) % WAVE.length;
  return WAVE[i];
}

export function nodeKey(n: Pick<PathNode, "kind" | "id">): string {
  return `${n.kind}:${n.id}`;
}

export function isDone(state: NodeState): boolean {
  return state === "completed" || state === "perfect";
}

export function buildLevelPath(structure: ProgrammeStructure, access: AccessMap, levelId: LevelId): LevelPath | null {
  const level = structure.levels.find((l) => l.id === levelId);
  const la = access.levels[levelId];
  if (!level || !la) return null;

  let index = 0;
  const all: PathNode[] = [];
  const push = (n: Omit<PathNode, "offset" | "index">): PathNode => {
    const node = { ...n, offset: pathOffset(index), index };
    index++;
    all.push(node);
    return node;
  };

  const modules: PathModule[] = level.modules.map((mod) => {
    const nodes: PathNode[] = mod.lessons.map((lessonId) => {
      const l = access.lessons[lessonId];
      return push({ kind: "lesson", id: lessonId, moduleId: mod.id, state: l.state, accessible: l.accessible });
    });
    const ma = access.modules[mod.id];
    nodes.push(push({ kind: "quiz", id: mod.id, moduleId: mod.id, state: ma.quizState, accessible: ma.quizUnlocked || ma.quizPassed }));
    return { moduleId: mod.id, nodes };
  });

  const examState: NodeState = la.examPassed ? "completed" : la.examUnlocked ? "available" : "locked";
  const exam = push({ kind: "exam", id: levelId, moduleId: null, state: examState, accessible: la.examUnlocked || la.examPassed });

  const current = all.find((n) => n.state === "in_progress") ?? all.find((n) => n.state === "available") ?? null;

  return {
    levelId,
    modules,
    exam,
    currentKey: current ? nodeKey(current) : null,
    totalNodes: all.length,
    doneNodes: all.filter((n) => isDone(n.state)).length,
  };
}

export type Milestone =
  | { kind: "quiz"; moduleId: ModuleId; levelId: LevelId; lessonsLeft: number; unlocked: boolean }
  | { kind: "exam"; levelId: LevelId; unlocked: true }
  | null;

/**
 * Prochain jalon (quiz de module ou examen de niveau) à passer dans le premier niveau ouvert non réussi.
 * `lessonsLeft` : leçons à terminer avant que le quiz ne s'ouvre.
 */
export function nextMilestone(structure: ProgrammeStructure, access: AccessMap): Milestone {
  for (const level of structure.levels) {
    const la = access.levels[level.id];
    if (!la?.unlocked || la.examPassed) continue;
    for (const mod of level.modules) {
      const ma = access.modules[mod.id];
      if (!ma.quizPassed) {
        return { kind: "quiz", moduleId: mod.id, levelId: level.id, lessonsLeft: ma.lessonsTotal - ma.lessonsCompleted, unlocked: ma.quizUnlocked };
      }
    }
    if (la.examUnlocked) return { kind: "exam", levelId: level.id, unlocked: true };
  }
  return null;
}

/** Pourcentage de leçons terminées d'un niveau (0-100, arrondi). */
export function levelPercent(access: AccessMap, levelId: LevelId): number {
  const la = access.levels[levelId];
  if (!la || la.lessonsTotal === 0) return 0;
  return Math.round((la.lessonsCompleted / la.lessonsTotal) * 100);
}
