/**
 * Écritures de gamification et de traçabilité, à appeler par les fonctionnalités (leçon, quiz, examen, tuteur…) :
 *
 *   await awardXp(user.id, lessonXp(lessonId));                 // idempotent (index unique)
 *   await logActivity(user.id, "lesson_complete", { lessonId });
 *   const nouveaux = await syncBadges(user.id);                 // ids des badges gagnés à l'instant (pour l'animation)
 *
 * Pas de `server-only` (utilisé aussi par le script de setup) mais à n'importer que côté serveur.
 */
import { and, count, eq, isNotNull, isNull } from "drizzle-orm";
import { db, schema, type DbOrTx } from "@/db";
import type { ActivityKind } from "@/db/schema";
import { getStructure } from "@/content/loader";
import { computeAccess, computeStreak, evaluateBadges, newBadges, parisHour, passedAttemptNumber, type BadgeContext, type XpAward } from "@/domain";
import { loadLearnerState } from "./learner";

/** Insère les récompenses non encore accordées. Renvoie le total d'XP effectivement ajouté. */
export async function awardXp(userId: string, awards: readonly XpAward[], opts: { at?: Date; conn?: DbOrTx } = {}): Promise<number> {
  if (awards.length === 0) return 0;
  const conn = opts.conn ?? db;
  const rows = await conn
    .insert(schema.xpEvents)
    .values(awards.map((a) => ({ userId, amount: a.amount, reason: a.reason, refId: a.refId, at: opts.at ?? new Date() })))
    .onConflictDoNothing({ target: [schema.xpEvents.userId, schema.xpEvents.reason, schema.xpEvents.refId] })
    .returning({ amount: schema.xpEvents.amount });
  return rows.reduce((s, r) => s + r.amount, 0);
}

/** Trace FOAD (activity_log). */
export async function logActivity(
  userId: string,
  kind: ActivityKind,
  data: { lessonId?: string | null; seconds?: number; refId?: string | null; at?: Date } = {},
  conn: DbOrTx = db,
): Promise<void> {
  await conn.insert(schema.activityLog).values({ userId, kind, lessonId: data.lessonId ?? null, seconds: Math.max(0, Math.round(data.seconds ?? 0)), refId: data.refId ?? null, at: data.at ?? new Date() });
}

/** Contexte d'évaluation des badges, reconstitué depuis la base. */
export async function buildBadgeContext(userId: string, conn: DbOrTx = db): Promise<BadgeContext> {
  const [state, lessons, quizzes, exams, xp, [tutor], [settings]] = await Promise.all([
    loadLearnerState(userId, conn),
    conn
      .select({ completedAt: schema.lessonProgress.completedAt })
      .from(schema.lessonProgress)
      .where(and(eq(schema.lessonProgress.userId, userId), eq(schema.lessonProgress.status, "completed"), isNotNull(schema.lessonProgress.completedAt))),
    conn.select({ moduleId: schema.quizAttempts.moduleId, percent: schema.quizAttempts.percent, passed: schema.quizAttempts.passed }).from(schema.quizAttempts).where(eq(schema.quizAttempts.userId, userId)),
    conn.select().from(schema.examAttempts).where(eq(schema.examAttempts.userId, userId)),
    conn.select({ at: schema.xpEvents.at }).from(schema.xpEvents).where(eq(schema.xpEvents.userId, userId)),
    conn.select({ n: count() }).from(schema.activityLog).where(and(eq(schema.activityLog.userId, userId), eq(schema.activityLog.kind, "tutor"))),
    conn.select({ key: schema.userSettings.aiKeyEncrypted }).from(schema.userSettings).where(eq(schema.userSettings.userId, userId)).limit(1),
  ]);
  const access = computeAccess(getStructure(), state);
  const examPassAttemptNumber: Record<string, number> = {};
  for (const levelId of state.passedExams) {
    const n = passedAttemptNumber(exams.filter((e) => e.levelId === levelId));
    if (n !== null) examPassAttemptNumber[levelId] = n;
  }
  return {
    lessonCompletions: lessons.map((l) => l.completedAt!),
    modulesCompleted: Object.values(access.modules).filter((m) => m.completed).length,
    quizAttempts: quizzes,
    passedExams: state.passedExams,
    examPassAttemptNumber,
    longestStreak: computeStreak(
      xp.map((x) => x.at),
      new Date(),
    ).longest,
    tutorQuestions: Number(tutor?.n ?? 0),
    hasPersonalApiKey: Boolean(settings?.key),
    hourOf: parisHour,
  };
}

/** Attribue les badges mérités qui manquent. Renvoie les ids nouvellement attribués. */
export async function syncBadges(userId: string, opts: { at?: Date; conn?: DbOrTx } = {}): Promise<string[]> {
  const conn = opts.conn ?? db;
  const ctx = await buildBadgeContext(userId, conn);
  const owned = await conn.select({ id: schema.userBadges.badgeId }).from(schema.userBadges).where(eq(schema.userBadges.userId, userId));
  const fresh = newBadges(
    evaluateBadges(ctx),
    owned.map((o) => o.id),
  );
  if (fresh.length) {
    await conn
      .insert(schema.userBadges)
      .values(fresh.map((badgeId) => ({ userId, badgeId, at: opts.at ?? new Date() })))
      .onConflictDoNothing();
  }
  return fresh;
}

/** Tentatives d'examen non annulées d'un niveau (pour examAttemptStatus). */
export async function examAttemptsFor(userId: string, levelId: string, conn: DbOrTx = db) {
  return conn
    .select()
    .from(schema.examAttempts)
    .where(and(eq(schema.examAttempts.userId, userId), eq(schema.examAttempts.levelId, levelId), isNull(schema.examAttempts.voidedAt)));
}
