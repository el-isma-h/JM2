/**
 * Examens de niveau — service serveur (SPEC § Examens).
 *
 *   getExamOverview(userId, "N1")        état + historique pour /examen/[niveau]
 *   startExamAttempt(userId, "N1")       crée (ou reprend) LA tentative ouverte — verrou consultatif par apprenant/niveau
 *   getTakingPayload(userId, attemptId)  questions publiques mélangées + réponses enregistrées (jamais answer/explanation)
 *   saveExamAnswer(...)                  sauvegarde automatique, refusée après échéance + 30 s
 *   submitExamAttempt(...)               correction serveur ; réussite → XP +300, certificat, badges, niveau suivant
 *   getExamResult(userId, attemptId)     correction détaillée, uniquement après soumission
 *
 * Toutes les fonctions acceptent `now` (tests). Les tentatives expirées non soumises sont clôturées (« finalisées »)
 * avec les réponses enregistrées avant toute nouvelle action.
 */
import "server-only";
import { and, asc, eq, gte, lte, sql } from "drizzle-orm";
import { db, schema, type DbOrTx } from "@/db";
import type { ExamAttempt } from "@/db/schema";
import { getExam, getLevel, getStructure } from "@/content/loader";
import {
  EXAM_COOLDOWN_DAYS,
  EXAM_MAX_ATTEMPTS,
  buildExamOrder,
  canSubmitAttempt,
  computeAccess,
  examAttemptStatus,
  examDeadline,
  examXp,
  type AttemptStatus,
} from "@/domain";
import {
  applyAnswerUpdate,
  attemptDurationSeconds,
  buildCorrection,
  buildTakingPayload,
  decideStart,
  displayedToOriginalAnswers,
  parseCompetenceLabels,
  validatedCompetences,
  type AnswerUpdate,
  type Correction,
  type TakingPayload,
} from "@/domain/exam-session";
import { awardXp, logActivity, syncBadges } from "./gamification";
import { issueCertificate } from "./certificates";
import { loadLearnerState } from "./learner";

export class ExamError extends Error {
  constructor(
    public code: "not_found" | "locked" | "passed" | "cooldown" | "exhausted" | "closed" | "no_exam",
    message: string,
    public nextAvailableAt?: Date,
  ) {
    super(message);
  }
}

const lockKey = (userId: string, levelId: string) => sql`select pg_advisory_xact_lock(hashtext(${`exam:${userId}:${levelId}`}))`;

async function attemptsOf(userId: string, levelId: string, conn: DbOrTx = db): Promise<ExamAttempt[]> {
  return conn
    .select()
    .from(schema.examAttempts)
    .where(and(eq(schema.examAttempts.userId, userId), eq(schema.examAttempts.levelId, levelId)))
    .orderBy(asc(schema.examAttempts.startedAt));
}

/** Libellés des compétences du niveau (tableau de niveau.md). */
export function competenceLabels(levelId: string): Record<string, string> {
  const level = getLevel(levelId);
  return level ? parseCompetenceLabels(level.intro) : {};
}

// ---------- Clôture ----------

type Graded = { attempt: ExamAttempt; correction: Correction; newBadges: string[]; certificateNumber: string | null };

/** Note et clôture une tentative (dans une transaction déjà verrouillée). */
async function gradeAndClose(tx: DbOrTx, attempt: ExamAttempt, submittedAt: Date): Promise<Omit<Graded, "newBadges">> {
  const exam = getExam(attempt.levelId);
  if (!exam) throw new ExamError("no_exam", "Examen introuvable.");
  const correction = buildCorrection(exam.questions, attempt, exam.passScore);
  const [row] = await tx
    .update(schema.examAttempts)
    .set({ submittedAt, score: correction.score, percent: correction.percent, passed: correction.passed })
    .where(and(eq(schema.examAttempts.id, attempt.id), sql`${schema.examAttempts.submittedAt} is null`))
    .returning();
  const closed = row ?? attempt;
  await logActivity(attempt.userId, "exam", { refId: attempt.levelId, seconds: attemptDurationSeconds(closed), at: submittedAt }, tx);
  let certificateNumber: string | null = null;
  if (correction.passed) {
    await awardXp(attempt.userId, examXp(attempt.levelId, true), { at: submittedAt, conn: tx });
    const cert = await issueCertificate({ userId: attempt.userId, levelId: attempt.levelId, examAttemptId: attempt.id, issuedAt: submittedAt }, tx);
    certificateNumber = cert.number;
  }
  return { attempt: closed, correction, certificateNumber };
}

/** Clôture les tentatives expirées (échéance + tolérance dépassées) non soumises, avec les réponses enregistrées. */
export async function finalizeExpiredAttempts(userId: string, levelId: string, now = new Date()): Promise<number> {
  const stale = (await attemptsOf(userId, levelId)).filter((a) => a.submittedAt === null && a.voidedAt === null && !canSubmitAttempt(a, now));
  if (!stale.length) return 0;
  let passed = false;
  await db.transaction(async (tx) => {
    await tx.execute(lockKey(userId, levelId));
    for (const a of stale) {
      const [fresh] = await tx.select().from(schema.examAttempts).where(eq(schema.examAttempts.id, a.id)).for("update");
      if (!fresh || fresh.submittedAt) continue;
      const r = await gradeAndClose(tx, fresh, fresh.deadlineAt);
      passed ||= r.correction.passed;
    }
  });
  if (passed) await syncBadges(userId, { at: now });
  return stale.length;
}

// ---------- Vue d'ensemble ----------

export type ExamOverview = {
  levelId: string;
  levelUnlocked: boolean;
  examUnlocked: boolean;
  /** Quiz du niveau non encore réussis (pour l'état verrouillé). */
  missingQuizzes: { moduleId: string; title: string; quizUnlocked: boolean }[];
  status: AttemptStatus;
  attempts: (ExamAttempt & { number: number | null })[];
  maxAttempts: number;
  cooldownDays: number;
  certificate: { number: string; issuedAt: Date } | null;
  bestPercent: number | null;
};

export async function getExamOverview(userId: string, levelId: string, now = new Date()): Promise<ExamOverview> {
  await finalizeExpiredAttempts(userId, levelId, now);
  const structure = getStructure();
  const [state, attempts, [cert]] = await Promise.all([
    loadLearnerState(userId),
    attemptsOf(userId, levelId),
    db
      .select({ number: schema.certificates.number, issuedAt: schema.certificates.issuedAt })
      .from(schema.certificates)
      .where(and(eq(schema.certificates.userId, userId), eq(schema.certificates.levelId, levelId), sql`${schema.certificates.revokedAt} is null`))
      .limit(1),
  ]);
  const access = computeAccess(structure, state);
  const la = access.levels[levelId];
  const level = getLevel(levelId);
  const missingQuizzes = (level?.modules ?? [])
    .filter((m) => !access.modules[m.id]?.quizPassed)
    .map((m) => ({ moduleId: m.id, title: m.title, quizUnlocked: access.modules[m.id]?.quizUnlocked ?? false }));
  let n = 0;
  const numbered = attempts.map((a) => ({ ...a, number: a.voidedAt ? null : ++n }));
  const percents = attempts.filter((a) => !a.voidedAt && a.percent !== null).map((a) => a.percent!);
  return {
    levelId,
    levelUnlocked: la?.unlocked ?? false,
    examUnlocked: la?.examUnlocked ?? false,
    missingQuizzes,
    status: examAttemptStatus(attempts, now),
    attempts: numbered,
    maxAttempts: EXAM_MAX_ATTEMPTS,
    cooldownDays: EXAM_COOLDOWN_DAYS,
    certificate: cert ?? null,
    bestPercent: percents.length ? Math.max(...percents) : null,
  };
}

// ---------- Démarrage ----------

/** Crée la tentative (ordre mélangé, échéance = début + durée) ou renvoie la tentative déjà ouverte. */
export async function startExamAttempt(userId: string, levelId: string, now = new Date(), rand: () => number = Math.random): Promise<{ attemptId: string; resumed: boolean }> {
  const exam = getExam(levelId);
  if (!exam) throw new ExamError("no_exam", "Examen introuvable.");
  await finalizeExpiredAttempts(userId, levelId, now);
  // État pédagogique lu hors transaction (une connexion de transaction n'accepte pas de requêtes parallèles).
  const access = computeAccess(getStructure(), await loadLearnerState(userId));
  return db.transaction(async (tx) => {
    await tx.execute(lockKey(userId, levelId));
    const attempts = await attemptsOf(userId, levelId, tx);
    const decision = decideStart(examAttemptStatus(attempts, now), access.levels[levelId]?.examUnlocked ?? false);
    if (decision.kind === "resume") return { attemptId: decision.attemptId, resumed: true };
    if (decision.kind === "finalize_first") throw new ExamError("closed", "Une tentative précédente est en cours de clôture. Réessayez.");
    if (decision.kind === "refused") {
      const messages = {
        locked: "Réussissez tous les quiz du niveau pour débloquer l'examen.",
        passed: "Vous avez déjà réussi cet examen.",
        cooldown: "Le délai de 7 jours entre deux tentatives n'est pas écoulé.",
        exhausted: "Les 3 tentatives de cet examen ont été utilisées.",
      } as const;
      throw new ExamError(decision.reason, messages[decision.reason], decision.nextAvailableAt);
    }
    const order = buildExamOrder(exam.questions, rand);
    const [row] = await tx
      .insert(schema.examAttempts)
      .values({ userId, levelId, startedAt: now, deadlineAt: examDeadline(now, exam.timeLimitMinutes), questionOrder: order.questionOrder, optionOrders: order.optionOrders, answers: {}, flagged: [] })
      .returning({ id: schema.examAttempts.id });
    return { attemptId: row.id, resumed: false };
  });
}

// ---------- Passage ----------

async function ownAttempt(userId: string, attemptId: string, conn: DbOrTx = db, forUpdate = false): Promise<ExamAttempt | null> {
  if (!/^[0-9a-f-]{36}$/i.test(attemptId)) return null;
  const q = conn
    .select()
    .from(schema.examAttempts)
    .where(and(eq(schema.examAttempts.id, attemptId), eq(schema.examAttempts.userId, userId)));
  const [row] = forUpdate ? await q.for("update") : await q;
  return row ?? null;
}

/** Tentative ouverte du niveau (null s'il n'y en a pas). */
export async function openAttemptFor(userId: string, levelId: string, now = new Date()): Promise<ExamAttempt | null> {
  await finalizeExpiredAttempts(userId, levelId, now);
  return (await attemptsOf(userId, levelId)).find((a) => a.voidedAt === null && canSubmitAttempt(a, now)) ?? null;
}

/** Payload client d'une tentative ouverte. Ne contient ni `answer` ni `explanation`. */
export function takingPayloadFor(attempt: ExamAttempt, now = new Date()): TakingPayload {
  const exam = getExam(attempt.levelId);
  if (!exam) throw new ExamError("no_exam", "Examen introuvable.");
  return buildTakingPayload(exam.questions, { ...attempt, flagged: attempt.flagged ?? [] }, { title: exam.title, now });
}

export async function getTakingPayload(userId: string, attemptId: string, now = new Date()): Promise<TakingPayload | null> {
  const a = await ownAttempt(userId, attemptId);
  if (!a || a.voidedAt || !canSubmitAttempt(a, now)) return null;
  return takingPayloadFor(a, now);
}

export type SaveResult = { ok: true; serverNow: string } | { ok: false; reason: "closed" | "unknown_question" | "invalid_choice" | "not_found"; serverNow: string };

/** Sauvegarde automatique d'un lot de réponses / marquages (appliqués dans l'ordre, tout ou rien). */
export async function saveExamAnswers(userId: string, attemptId: string, updates: readonly AnswerUpdate[], now = new Date()): Promise<SaveResult> {
  return db.transaction(async (tx) => {
    const a = await ownAttempt(userId, attemptId, tx, true);
    if (!a || a.voidedAt) return { ok: false, reason: "not_found", serverNow: now.toISOString() };
    let cur = { ...a, flagged: a.flagged ?? [] };
    for (const u of updates) {
      const r = applyAnswerUpdate(cur, u, now);
      if (!r.ok) return { ok: false, reason: r.reason, serverNow: now.toISOString() };
      cur = { ...cur, answers: r.answers, flagged: r.flagged };
    }
    await tx.update(schema.examAttempts).set({ answers: cur.answers, flagged: cur.flagged }).where(eq(schema.examAttempts.id, a.id));
    return { ok: true, serverNow: now.toISOString() };
  });
}

/** Sauvegarde automatique d'une réponse et/ou du marquage « à revoir ». */
export async function saveExamAnswer(userId: string, attemptId: string, update: AnswerUpdate, now = new Date()): Promise<SaveResult> {
  return saveExamAnswers(userId, attemptId, [update], now);
}

export type SubmitResult = { attemptId: string; levelId: string; passed: boolean; percent: number; late: boolean; newBadges: string[]; certificateNumber: string | null };

/**
 * Soumission. `finalAnswers` (indices affichés) n'est pris en compte que si la soumission arrive avant
 * l'échéance + 30 s ; au-delà, seules les réponses déjà enregistrées comptent (`late: true`).
 */
export async function submitExamAttempt(userId: string, attemptId: string, finalAnswers: Record<string, number | null> | null, now = new Date()): Promise<SubmitResult> {
  let levelId = "";
  const out = await db.transaction(async (tx) => {
    const peek = await ownAttempt(userId, attemptId, tx);
    if (!peek || peek.voidedAt) throw new ExamError("not_found", "Tentative introuvable.");
    levelId = peek.levelId;
    await tx.execute(lockKey(userId, peek.levelId));
    const a = (await ownAttempt(userId, attemptId, tx, true))!;
    if (a.submittedAt) {
      return { attempt: a, late: false, passed: a.passed ?? false, percent: a.percent ?? 0, certificateNumber: null as string | null };
    }
    const inTime = canSubmitAttempt(a, now);
    let current = a;
    if (inTime && finalAnswers) {
      const merged = { ...(a.answers ?? {}), ...displayedToOriginalAnswers(a, finalAnswers) };
      for (const [qid, v] of Object.entries(finalAnswers)) if (v === null) delete merged[qid];
      [current] = await tx.update(schema.examAttempts).set({ answers: merged }).where(eq(schema.examAttempts.id, a.id)).returning();
    }
    const submittedAt = inTime ? now : a.deadlineAt;
    const r = await gradeAndClose(tx, current, submittedAt);
    return { attempt: r.attempt, late: !inTime, passed: r.correction.passed, percent: r.correction.percent, certificateNumber: r.certificateNumber };
  });
  const newBadges = out.passed ? await syncBadges(userId, { at: out.attempt.submittedAt ?? now }) : [];
  return { attemptId, levelId, passed: out.passed, percent: out.percent, late: out.late, newBadges, certificateNumber: out.certificateNumber };
}

// ---------- Résultat ----------

export type ExamResult = {
  attempt: ExamAttempt & { number: number };
  levelId: string;
  levelTitle: string;
  examTitle: string;
  passScore: number;
  correction: Correction;
  competenceLabels: Record<string, string>;
  durationSeconds: number;
  /** Prochaine tentative possible (échec) ; null si épuisé ou réussi. */
  next: { kind: "date"; at: Date } | { kind: "now" } | { kind: "exhausted" } | null;
  attemptsLeft: number;
  certificateNumber: string | null;
  badgesEarned: string[];
  nextLevelId: string | null;
};

/** Correction détaillée — uniquement pour une tentative SOUMISE de l'apprenant. */
export async function getExamResult(userId: string, attemptId: string, now = new Date()): Promise<ExamResult | null> {
  const a0 = await ownAttempt(userId, attemptId);
  if (!a0) return null;
  if (!a0.submittedAt) await finalizeExpiredAttempts(userId, a0.levelId, now);
  const a = (await ownAttempt(userId, attemptId))!;
  if (!a.submittedAt) return null;
  const exam = getExam(a.levelId);
  const level = getLevel(a.levelId);
  if (!exam || !level) return null;
  const all = await attemptsOf(userId, a.levelId);
  const valid = all.filter((x) => !x.voidedAt);
  const number = valid.findIndex((x) => x.id === a.id) + 1;
  const status = examAttemptStatus(all, now);
  const next: ExamResult["next"] = a.passed
    ? null
    : status.kind === "cooldown"
      ? { kind: "date", at: status.nextAvailableAt }
      : status.kind === "exhausted"
        ? { kind: "exhausted" }
        : status.kind === "available"
          ? { kind: "now" }
          : null;
  const [[cert], badges] = await Promise.all([
    db
      .select({ number: schema.certificates.number })
      .from(schema.certificates)
      .where(and(eq(schema.certificates.examAttemptId, a.id), sql`${schema.certificates.revokedAt} is null`))
      .limit(1),
    a.passed
      ? db
          .select({ id: schema.userBadges.badgeId })
          .from(schema.userBadges)
          .where(and(eq(schema.userBadges.userId, userId), gte(schema.userBadges.at, a.startedAt), lte(schema.userBadges.at, new Date(a.submittedAt.getTime() + 120_000))))
      : Promise.resolve([] as { id: string }[]),
  ]);
  const levels = getStructure().levels;
  const li = levels.findIndex((l) => l.id === a.levelId);
  return {
    attempt: { ...a, number: number || 1 },
    levelId: a.levelId,
    levelTitle: level.title,
    examTitle: exam.title,
    passScore: exam.passScore,
    correction: buildCorrection(exam.questions, a, exam.passScore),
    competenceLabels: parseCompetenceLabels(level.intro),
    durationSeconds: attemptDurationSeconds(a),
    next,
    attemptsLeft: Math.max(0, EXAM_MAX_ATTEMPTS - valid.length),
    certificateNumber: cert?.number ?? null,
    badgesEarned: badges.map((b) => b.id),
    nextLevelId: a.passed && li >= 0 && li < levels.length - 1 ? levels[li + 1].id : null,
  };
}

/** Compétences validées par la tentative ayant délivré un certificat (pour le PDF). */
export async function certificateCompetences(examAttemptId: string | null, levelId: string): Promise<{ code: string; label: string }[]> {
  const labels = competenceLabels(levelId);
  const exam = getExam(levelId);
  let codes = Object.keys(labels);
  if (examAttemptId && exam) {
    const [a] = await db.select().from(schema.examAttempts).where(eq(schema.examAttempts.id, examAttemptId)).limit(1);
    if (a?.submittedAt) codes = validatedCompetences(buildCorrection(exam.questions, a, exam.passScore).byCompetence, exam.passScore);
  }
  if (!codes.length && exam) codes = Object.keys(exam.competences);
  return codes.map((code) => ({ code, label: labels[code] ?? code }));
}
