/**
 * Lectures de l'espace d'administration : indicateurs, liste des apprenants, fiche détaillée.
 * Les états d'avancement sont reconstitués en lot (une requête par table) puis passés au domaine.
 */
import "server-only";
import { and, desc, eq, gte, inArray, isNull, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { getExam, getFlatLessons, getStructure } from "@/content";
import { computeAccess, currentLevelId, gradeExam, overallProgressPercent, parisDayKey, shiftDayKey, type AccessMap, type LearnerState } from "@/domain";
import { adminActionsFor } from "./audit";

const DAY = 86_400_000;

export type LearnerRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "learner" | "trainer" | "admin";
  isDemo: boolean;
  disabled: boolean;
  createdAt: Date;
  currentLevel: string | null;
  progress: number;
  completedLessons: number;
  seconds: number;
  lastActivity: Date | null;
  certificates: number;
};

/** États d'avancement de plusieurs utilisateurs (équivalent groupé de loadLearnerState). */
async function loadStates(userIds: string[]): Promise<Map<string, LearnerState>> {
  const map = new Map<string, LearnerState>();
  if (!userIds.length) return map;
  const [progress, quizzes, exams, unlocks] = await Promise.all([
    db.select({ u: schema.lessonProgress.userId, l: schema.lessonProgress.lessonId, s: schema.lessonProgress.status }).from(schema.lessonProgress).where(inArray(schema.lessonProgress.userId, userIds)),
    db
      .select({ u: schema.quizAttempts.userId, m: schema.quizAttempts.moduleId, p: schema.quizAttempts.percent })
      .from(schema.quizAttempts)
      .where(and(inArray(schema.quizAttempts.userId, userIds), eq(schema.quizAttempts.passed, true))),
    db
      .select({ u: schema.examAttempts.userId, l: schema.examAttempts.levelId })
      .from(schema.examAttempts)
      .where(and(inArray(schema.examAttempts.userId, userIds), eq(schema.examAttempts.passed, true), isNull(schema.examAttempts.voidedAt))),
    db.select({ u: schema.unlocks.userId, s: schema.unlocks.scope, r: schema.unlocks.refId }).from(schema.unlocks).where(inArray(schema.unlocks.userId, userIds)),
  ]);
  for (const id of userIds) {
    map.set(id, {
      completedLessons: new Set(),
      startedLessons: new Set(),
      passedQuizzes: new Set(),
      perfectQuizzes: new Set(),
      passedExams: new Set(),
      manualUnlocks: { modules: new Set(), levels: new Set() },
    });
  }
  const get = (u: string) => map.get(u)! as { [K in keyof LearnerState]: LearnerState[K] extends ReadonlySet<string> ? Set<string> : { modules: Set<string>; levels: Set<string> } };
  for (const p of progress) (p.s === "completed" ? get(p.u).completedLessons : get(p.u).startedLessons).add(p.l);
  for (const q of quizzes) {
    get(q.u).passedQuizzes.add(q.m);
    if (q.p >= 100) get(q.u).perfectQuizzes.add(q.m);
  }
  for (const e of exams) get(e.u).passedExams.add(e.l);
  for (const x of unlocks) (x.s === "module" ? get(x.u).manualUnlocks.modules : get(x.u).manualUnlocks.levels).add(x.r);
  return map;
}

export async function listLearners(opts: { includeStaff?: boolean } = {}): Promise<LearnerRow[]> {
  const users = await db
    .select()
    .from(schema.users)
    .where(opts.includeStaff ? undefined : eq(schema.users.role, "learner"))
    .orderBy(schema.users.lastName, schema.users.firstName);
  const ids = users.map((u) => u.id);
  if (!ids.length) return [];
  const [states, time, last, certs] = await Promise.all([
    loadStates(ids),
    db
      .select({ u: schema.lessonProgress.userId, s: sql<number>`coalesce(sum(${schema.lessonProgress.timeSpentSeconds}), 0)::int` })
      .from(schema.lessonProgress)
      .where(inArray(schema.lessonProgress.userId, ids))
      .groupBy(schema.lessonProgress.userId),
    db
      .select({ u: schema.activityLog.userId, at: sql<Date>`max(${schema.activityLog.at})` })
      .from(schema.activityLog)
      .where(inArray(schema.activityLog.userId, ids))
      .groupBy(schema.activityLog.userId),
    db
      .select({ u: schema.certificates.userId, n: sql<number>`count(*)::int` })
      .from(schema.certificates)
      .where(and(inArray(schema.certificates.userId, ids), isNull(schema.certificates.revokedAt)))
      .groupBy(schema.certificates.userId),
  ]);
  const structure = getStructure();
  const timeBy = new Map(time.map((t) => [t.u, Number(t.s)]));
  const lastBy = new Map(last.map((t) => [t.u, t.at ? new Date(t.at) : null]));
  const certBy = new Map(certs.map((t) => [t.u, Number(t.n)]));
  return users.map((u) => {
    const state = states.get(u.id)!;
    const access = computeAccess(structure, state);
    return {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      isDemo: u.isDemo,
      disabled: Boolean(u.disabledAt),
      createdAt: u.createdAt,
      currentLevel: currentLevelId(access),
      progress: overallProgressPercent(access),
      completedLessons: state.completedLessons.size,
      seconds: timeBy.get(u.id) ?? 0,
      lastActivity: lastBy.get(u.id) ?? null,
      certificates: certBy.get(u.id) ?? 0,
    };
  });
}

export type DashboardData = {
  learners: number;
  active7: number;
  active30: number;
  totalSeconds: number;
  lessonsCompleted: number;
  quiz: { attempts: number; passed: number };
  exams: { attempts: number; passed: number };
  certificates: number;
  daily: { day: string; active: number; seconds: number }[];
  levels: { levelId: string; learners: number }[];
  toRemind: LearnerRow[];
  recentExams: { id: string; userId: string; name: string; levelId: string; percent: number | null; passed: boolean | null; submittedAt: Date | null }[];
};

export async function getDashboard(now = new Date()): Promise<DashboardData> {
  const learnerRows = await listLearners();
  const learnerIds = learnerRows.map((l) => l.id);
  const since30 = new Date(now.getTime() - 30 * DAY);
  const since7 = new Date(now.getTime() - 7 * DAY);
  const onlyLearners = sql`${schema.users.role} = 'learner'`;

  const [quiz, exams, certs, dailyRows, recentExams] = await Promise.all([
    db
      .select({ n: sql<number>`count(*)::int`, ok: sql<number>`count(*) filter (where ${schema.quizAttempts.passed})::int` })
      .from(schema.quizAttempts)
      .innerJoin(schema.users, eq(schema.users.id, schema.quizAttempts.userId))
      .where(onlyLearners),
    db
      .select({ n: sql<number>`count(*)::int`, ok: sql<number>`count(*) filter (where ${schema.examAttempts.passed})::int` })
      .from(schema.examAttempts)
      .innerJoin(schema.users, eq(schema.users.id, schema.examAttempts.userId))
      .where(and(onlyLearners, isNull(schema.examAttempts.voidedAt), sql`${schema.examAttempts.submittedAt} is not null`)),
    db.select({ n: sql<number>`count(*)::int` }).from(schema.certificates).where(isNull(schema.certificates.revokedAt)),
    db
      .select({
        day: sql<string>`to_char(${schema.activityLog.at} at time zone 'Europe/Paris', 'YYYY-MM-DD')`,
        active: sql<number>`count(distinct ${schema.activityLog.userId})::int`,
        seconds: sql<number>`coalesce(sum(${schema.activityLog.seconds}) filter (where ${schema.activityLog.kind} = 'lesson_time'), 0)::int`,
      })
      .from(schema.activityLog)
      .innerJoin(schema.users, eq(schema.users.id, schema.activityLog.userId))
      .where(and(onlyLearners, gte(schema.activityLog.at, since30)))
      .groupBy(sql`1`),
    db
      .select({ e: schema.examAttempts, firstName: schema.users.firstName, lastName: schema.users.lastName })
      .from(schema.examAttempts)
      .innerJoin(schema.users, eq(schema.users.id, schema.examAttempts.userId))
      .where(and(onlyLearners, sql`${schema.examAttempts.submittedAt} is not null`, isNull(schema.examAttempts.voidedAt)))
      .orderBy(desc(schema.examAttempts.submittedAt))
      .limit(6),
  ]);

  const byDay = new Map(dailyRows.map((r) => [r.day, r]));
  const today = parisDayKey(now);
  const daily = Array.from({ length: 30 }, (_, i) => {
    const day = shiftDayKey(today, i - 29);
    const r = byDay.get(day);
    return { day, active: Number(r?.active ?? 0), seconds: Number(r?.seconds ?? 0) };
  });

  const levelCounts = new Map<string, number>();
  for (const l of learnerRows) if (l.currentLevel) levelCounts.set(l.currentLevel, (levelCounts.get(l.currentLevel) ?? 0) + 1);
  const levels = getStructure().levels.map((lv) => ({ levelId: lv.id, learners: levelCounts.get(lv.id) ?? 0 }));

  const active = (since: Date) => learnerRows.filter((l) => l.lastActivity && l.lastActivity >= since).length;
  const toRemind = learnerRows
    .filter((l) => !l.disabled && l.progress < 100 && (l.lastActivity ? l.lastActivity < since7 : l.createdAt < since7))
    .sort((a, b) => (a.lastActivity?.getTime() ?? 0) - (b.lastActivity?.getTime() ?? 0));

  return {
    learners: learnerIds.length,
    active7: active(since7),
    active30: active(since30),
    totalSeconds: learnerRows.reduce((s, l) => s + l.seconds, 0),
    lessonsCompleted: learnerRows.reduce((s, l) => s + l.completedLessons, 0),
    quiz: { attempts: Number(quiz[0]?.n ?? 0), passed: Number(quiz[0]?.ok ?? 0) },
    exams: { attempts: Number(exams[0]?.n ?? 0), passed: Number(exams[0]?.ok ?? 0) },
    certificates: Number(certs[0]?.n ?? 0),
    daily,
    levels,
    toRemind,
    recentExams: recentExams.map((r) => ({
      id: r.e.id,
      userId: r.e.userId,
      name: `${r.firstName} ${r.lastName}`.trim(),
      levelId: r.e.levelId,
      percent: r.e.percent,
      passed: r.e.passed,
      submittedAt: r.e.submittedAt,
    })),
  };
}

// ---------- Fiche apprenant ----------

export async function getLearnerDetail(userId: string, now = new Date()) {
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
  if (!user) return null;
  const since90 = new Date(now.getTime() - 190 * DAY);
  const [states, progress, quizzes, exams, certificates, unlocks, badges, daily, xp, actions, settings] = await Promise.all([
    loadStates([userId]),
    db.select().from(schema.lessonProgress).where(eq(schema.lessonProgress.userId, userId)),
    db.select().from(schema.quizAttempts).where(eq(schema.quizAttempts.userId, userId)).orderBy(desc(schema.quizAttempts.at)),
    db.select().from(schema.examAttempts).where(eq(schema.examAttempts.userId, userId)).orderBy(desc(schema.examAttempts.startedAt)),
    db.select().from(schema.certificates).where(eq(schema.certificates.userId, userId)).orderBy(desc(schema.certificates.issuedAt)),
    db.select().from(schema.unlocks).where(eq(schema.unlocks.userId, userId)),
    db.select().from(schema.userBadges).where(eq(schema.userBadges.userId, userId)).orderBy(desc(schema.userBadges.at)),
    db
      .select({
        day: sql<string>`to_char(${schema.activityLog.at} at time zone 'Europe/Paris', 'YYYY-MM-DD')`,
        seconds: sql<number>`coalesce(sum(${schema.activityLog.seconds}) filter (where ${schema.activityLog.kind} = 'lesson_time'), 0)::int`,
        lessons: sql<number>`count(*) filter (where ${schema.activityLog.kind} = 'lesson_complete')::int`,
        quizzes: sql<number>`count(*) filter (where ${schema.activityLog.kind} = 'quiz')::int`,
        exams: sql<number>`count(*) filter (where ${schema.activityLog.kind} = 'exam')::int`,
        tutor: sql<number>`count(*) filter (where ${schema.activityLog.kind} = 'tutor')::int`,
        logins: sql<number>`count(*) filter (where ${schema.activityLog.kind} = 'login')::int`,
      })
      .from(schema.activityLog)
      .where(and(eq(schema.activityLog.userId, userId), gte(schema.activityLog.at, since90)))
      .groupBy(sql`1`)
      .orderBy(sql`1 desc`),
    db.select({ n: sql<number>`coalesce(sum(${schema.xpEvents.amount}), 0)::int` }).from(schema.xpEvents).where(eq(schema.xpEvents.userId, userId)),
    adminActionsFor(userId),
    db.select({ provider: schema.userSettings.aiProvider, key: schema.userSettings.aiKeyEncrypted }).from(schema.userSettings).where(eq(schema.userSettings.userId, userId)).limit(1),
  ]);
  const structure = getStructure();
  const state = states.get(userId)!;
  const access: AccessMap = computeAccess(structure, state);
  const flat = getFlatLessons();
  const progressBy = new Map(progress.map((p) => [p.lessonId, p]));

  const examDetails = exams.map((e) => {
    let byCompetence: { competence: string; correct: number; total: number; percent: number }[] = [];
    if (e.submittedAt && e.answers) {
      const exam = getExam(e.levelId);
      if (exam) byCompetence = gradeExam(exam.questions, e.answers, exam.passScore).byCompetence;
    }
    return { ...e, byCompetence, durationSeconds: e.submittedAt ? Math.round((e.submittedAt.getTime() - e.startedAt.getTime()) / 1000) : null };
  });

  return {
    user,
    access,
    structure,
    state,
    progressPercent: overallProgressPercent(access),
    currentLevel: currentLevelId(access),
    totalXp: Number(xp[0]?.n ?? 0),
    totalSeconds: progress.reduce((s, p) => s + p.timeSpentSeconds, 0),
    lessons: flat.map((l) => ({ ...l, progress: progressBy.get(l.id) ?? null })),
    quizzes,
    exams: examDetails,
    certificates,
    unlocks,
    badges,
    daily: daily.map((d) => ({ ...d, seconds: Number(d.seconds) })),
    actions,
    hasPersonalKey: Boolean(settings[0]?.key),
  };
}

export type LearnerDetail = NonNullable<Awaited<ReturnType<typeof getLearnerDetail>>>;
