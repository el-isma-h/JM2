/**
 * Écritures de progression des leçons et quiz (périmètre parcours) :
 *
 *   await addLessonTime(user.id, "L001", 30, minutes)    // ping /api/time (plafonné, voir domain/lesson-time.ts)
 *   await completeLesson(user.id, "L001")                // +20 XP, preuve FOAD, badges
 *   await recordQuizAttempt(user.id, "M01", result)      // quiz_attempts, XP, preuve FOAD, badges
 *
 * L'appelant vérifie l'accès (computeAccess) avant d'appeler ces fonctions.
 */
import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { lessonXp, quizXp, type QuizResult } from "@/domain";
import { acceptedTimeIncrement } from "@/domain/lesson-time";
import { awardXp, logActivity, syncBadges } from "./gamification";

/** Ajoute le temps d'un ping (crée la ligne « started » au premier passage). Renvoie les secondes retenues. */
export async function addLessonTime(userId: string, lessonId: string, claimed: number, plannedMinutes: number, now = new Date()): Promise<{ accepted: number; total: number }> {
  return db.transaction(async (tx) => {
    await tx.insert(schema.lessonProgress).values({ userId, lessonId, status: "started", firstOpenedAt: now }).onConflictDoNothing();
    const [row] = await tx
      .select()
      .from(schema.lessonProgress)
      .where(and(eq(schema.lessonProgress.userId, userId), eq(schema.lessonProgress.lessonId, lessonId)))
      .for("update");
    const accepted = acceptedTimeIncrement({ claimed, alreadySpent: row.timeSpentSeconds, plannedMinutes, lastSeenAt: row.lastSeenAt, now });
    // lastSeenAt n'avance que sur un ping réel : le ping d'ouverture (0 s) ne doit pas réduire le suivant.
    if (claimed > 0 || !row.lastSeenAt) {
      await tx
        .update(schema.lessonProgress)
        .set({ timeSpentSeconds: sql`${schema.lessonProgress.timeSpentSeconds} + ${accepted}`, lastSeenAt: now })
        .where(and(eq(schema.lessonProgress.userId, userId), eq(schema.lessonProgress.lessonId, lessonId)));
    }
    if (accepted > 0) await logActivity(userId, "lesson_time", { lessonId, seconds: accepted, at: now }, tx);
    return { accepted, total: row.timeSpentSeconds + accepted };
  });
}

/** « J'ai terminé la leçon » (idempotent). Renvoie l'XP gagné et les badges obtenus à l'instant. */
export async function completeLesson(userId: string, lessonId: string, now = new Date()): Promise<{ alreadyDone: boolean; xp: number; badges: string[] }> {
  return db.transaction(async (tx) => {
    await tx.insert(schema.lessonProgress).values({ userId, lessonId, status: "started", firstOpenedAt: now }).onConflictDoNothing();
    const updated = await tx
      .update(schema.lessonProgress)
      .set({ status: "completed", completedAt: now })
      .where(and(eq(schema.lessonProgress.userId, userId), eq(schema.lessonProgress.lessonId, lessonId), eq(schema.lessonProgress.status, "started")))
      .returning({ lessonId: schema.lessonProgress.lessonId });
    if (updated.length === 0) return { alreadyDone: true, xp: 0, badges: [] };
    const xp = await awardXp(userId, lessonXp(lessonId), { at: now, conn: tx });
    await logActivity(userId, "lesson_complete", { lessonId, at: now }, tx);
    const badges = await syncBadges(userId, { at: now, conn: tx });
    return { alreadyDone: false, xp, badges };
  });
}

/** Enregistre une tentative de quiz déjà corrigée côté serveur. */
export async function recordQuizAttempt(userId: string, moduleId: string, result: QuizResult, passScore: number, now = new Date()): Promise<{ attemptId: string; xp: number; badges: string[] }> {
  return db.transaction(async (tx) => {
    const [attempt] = await tx
      .insert(schema.quizAttempts)
      .values({ userId, moduleId, score: result.score, total: result.total, percent: result.percent, passed: result.passed, answers: result.answers, at: now })
      .returning({ id: schema.quizAttempts.id });
    const xp = await awardXp(userId, quizXp(moduleId, result.percent, passScore), { at: now, conn: tx });
    await logActivity(userId, "quiz", { refId: moduleId, at: now }, tx);
    const badges = await syncBadges(userId, { at: now, conn: tx });
    return { attemptId: attempt.id, xp, badges };
  });
}

/** Temps cumulé et statut d'une leçon pour l'apprenant (null si jamais ouverte). */
export async function getLessonProgress(userId: string, lessonId: string) {
  const [row] = await db
    .select()
    .from(schema.lessonProgress)
    .where(and(eq(schema.lessonProgress.userId, userId), eq(schema.lessonProgress.lessonId, lessonId)))
    .limit(1);
  return row ?? null;
}
