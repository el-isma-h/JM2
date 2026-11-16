/**
 * État d'un apprenant reconstitué depuis la base, puis passé au domaine (règles de déblocage, XP, série).
 *
 *   const snap = await getLearnerSnapshot(user.id);
 *   snap.access.lessons["L001"].accessible; snap.xp.total; snap.streak.current; snap.resume
 *
 * Pas de `server-only` (utilisé aussi par le script de setup) mais à n'importer que côté serveur.
 */
import { and, desc, eq, isNull } from "drizzle-orm";
import { db, schema, type DbOrTx } from "@/db";
import { getStructure } from "@/content/loader";
import {
  computeAccess,
  computeStreak,
  currentLevelId,
  dailyGoalProgress,
  overallProgressPercent,
  resumeTarget,
  totalXp,
  xpRank,
  type AccessMap,
  type DailyGoal,
  type LearnerState,
  type ProgrammeStructure,
  type ResumeTarget,
  type StreakInfo,
  type XpRank,
} from "@/domain";

export async function loadLearnerState(userId: string, conn: DbOrTx = db): Promise<LearnerState> {
  const [progress, quizzes, exams, unlocks] = await Promise.all([
    conn.select({ lessonId: schema.lessonProgress.lessonId, status: schema.lessonProgress.status }).from(schema.lessonProgress).where(eq(schema.lessonProgress.userId, userId)),
    conn
      .select({ moduleId: schema.quizAttempts.moduleId, percent: schema.quizAttempts.percent })
      .from(schema.quizAttempts)
      .where(and(eq(schema.quizAttempts.userId, userId), eq(schema.quizAttempts.passed, true))),
    conn
      .select({ levelId: schema.examAttempts.levelId })
      .from(schema.examAttempts)
      .where(and(eq(schema.examAttempts.userId, userId), eq(schema.examAttempts.passed, true), isNull(schema.examAttempts.voidedAt))),
    conn.select({ scope: schema.unlocks.scope, refId: schema.unlocks.refId }).from(schema.unlocks).where(eq(schema.unlocks.userId, userId)),
  ]);
  return {
    completedLessons: new Set(progress.filter((p) => p.status === "completed").map((p) => p.lessonId)),
    startedLessons: new Set(progress.filter((p) => p.status === "started").map((p) => p.lessonId)),
    passedQuizzes: new Set(quizzes.map((q) => q.moduleId)),
    perfectQuizzes: new Set(quizzes.filter((q) => q.percent >= 100).map((q) => q.moduleId)),
    passedExams: new Set(exams.map((e) => e.levelId)),
    manualUnlocks: {
      modules: new Set(unlocks.filter((u) => u.scope === "module").map((u) => u.refId)),
      levels: new Set(unlocks.filter((u) => u.scope === "level").map((u) => u.refId)),
    },
  };
}

export async function loadAccess(userId: string): Promise<{ structure: ProgrammeStructure; state: LearnerState; access: AccessMap }> {
  const structure = getStructure();
  const state = await loadLearnerState(userId);
  return { structure, state, access: computeAccess(structure, state) };
}

export type LearnerSnapshot = {
  structure: ProgrammeStructure;
  state: LearnerState;
  access: AccessMap;
  xp: { total: number; rank: XpRank; daily: DailyGoal };
  streak: StreakInfo;
  badges: { badgeId: string; at: Date }[];
  resume: ResumeTarget;
  currentLevelId: string | null;
  progressPercent: number;
};

export async function getLearnerSnapshot(userId: string, now = new Date()): Promise<LearnerSnapshot> {
  const [{ structure, state, access }, xpRows, badges, [user]] = await Promise.all([
    loadAccess(userId),
    db.select({ amount: schema.xpEvents.amount, at: schema.xpEvents.at }).from(schema.xpEvents).where(eq(schema.xpEvents.userId, userId)),
    db
      .select({ badgeId: schema.userBadges.badgeId, at: schema.userBadges.at })
      .from(schema.userBadges)
      .where(eq(schema.userBadges.userId, userId))
      .orderBy(desc(schema.userBadges.at)),
    db.select({ dailyGoalXp: schema.users.dailyGoalXp }).from(schema.users).where(eq(schema.users.id, userId)).limit(1),
  ]);
  const total = totalXp(xpRows);
  return {
    structure,
    state,
    access,
    xp: { total, rank: xpRank(total), daily: dailyGoalProgress(xpRows, user?.dailyGoalXp ?? 50, now) },
    streak: computeStreak(
      xpRows.map((r) => r.at),
      now,
    ),
    badges,
    resume: resumeTarget(structure, access),
    currentLevelId: currentLevelId(access),
    progressPercent: overallProgressPercent(access),
  };
}
