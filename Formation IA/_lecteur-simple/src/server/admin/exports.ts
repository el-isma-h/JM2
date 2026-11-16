/**
 * Exports CSV des preuves de réalisation FOAD (route /api/admin/export/[type]).
 * Filtres : période [from, to] (dates incluses, Europe/Paris) et apprenant. Le compte démo et l'équipe sont exclus,
 * sauf si l'apprenant est demandé explicitement.
 */
import "server-only";
import { and, asc, eq, gte, inArray, lte, or, sql, type SQL } from "drizzle-orm";
import { db, schema } from "@/db";
import { getFlatLessons, getProgramme } from "@/content";
import { absoluteUrl, routes } from "@/lib/paths";
import { toCsv, type CsvValue } from "@/lib/csv";
import type { ExportType } from "@/lib/roles";

export type ExportFilters = { from?: Date | null; to?: Date | null; userId?: string | null };

export const EXPORT_META: Record<ExportType, { title: string; description: string; file: string }> = {
  preuves: {
    title: "Preuves de réalisation FOAD",
    description: "Une ligne par apprenant et par leçon : première ouverture, fin, temps passé (total et sur la période), score du quiz du module.",
    file: "preuves-realisation",
  },
  activite: { title: "Relevé d'activité journalier", description: "Une ligne par apprenant et par jour : temps de formation, leçons terminées, quiz, examens, tuteur, connexions.", file: "releve-activite" },
  quiz: { title: "Résultats des quiz", description: "Toutes les tentatives de quiz de module : date, score, pourcentage, réussite.", file: "resultats-quiz" },
  examens: { title: "Tentatives d'examen", description: "Toutes les tentatives d'examen de niveau, y compris annulées : horaires, durée, score, réussite.", file: "tentatives-examen" },
  certificats: { title: "Certificats", description: "Certificats émis et révoqués, avec lien public de vérification.", file: "certificats" },
};

/** « 2026-11-02 » → début de journée à Paris (approximation UTC+1/UTC+2 gérée par Postgres côté requêtes). */
export function parseDay(v: string | null | undefined, endOfDay = false): Date | null {
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const d = new Date(`${v}T${endOfDay ? "23:59:59.999" : "00:00:00"}+01:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function targetUsers(f: ExportFilters) {
  const where: SQL[] = [eq(schema.users.role, "learner")];
  if (f.userId) where.push(eq(schema.users.id, f.userId));
  else where.push(eq(schema.users.isDemo, false));
  return db
    .select({ id: schema.users.id, firstName: schema.users.firstName, lastName: schema.users.lastName, email: schema.users.email })
    .from(schema.users)
    .where(and(...where))
    .orderBy(asc(schema.users.lastName), asc(schema.users.firstName));
}

function inRange(col: Parameters<typeof gte>[0], f: ExportFilters): SQL | undefined {
  const parts: SQL[] = [];
  if (f.from) parts.push(gte(col, f.from));
  if (f.to) parts.push(lte(col, f.to));
  return parts.length ? and(...parts) : undefined;
}

const minutes = (s: number) => Math.round((s / 60) * 100) / 100;

export async function buildExport(type: ExportType, f: ExportFilters): Promise<{ filename: string; csv: string; rows: number }> {
  const users = await targetUsers(f);
  const ids = users.map((u) => u.id);
  const who = new Map(users.map((u) => [u.id, u]));
  const name = (id: string) => {
    const u = who.get(id);
    return u ? `${u.lastName} ${u.firstName}`.trim() : "";
  };
  const email = (id: string) => who.get(id)?.email ?? "";
  const stamp = new Date().toISOString().slice(0, 10);
  const suffix = `${f.from ? `_du-${f.from.toISOString().slice(0, 10)}` : ""}${f.to ? `_au-${f.to.toISOString().slice(0, 10)}` : ""}`;
  const filename = `${EXPORT_META[type].file}${suffix}_${stamp}.csv`;
  let headers: string[] = [];
  let rows: CsvValue[][] = [];

  if (!ids.length) return { filename, csv: toCsv(["Aucun apprenant"], []), rows: 0 };

  if (type === "preuves") {
    const lessons = new Map(getFlatLessons().map((l) => [l.id, l]));
    const range = or(inRange(schema.lessonProgress.firstOpenedAt, f), inRange(schema.lessonProgress.completedAt, f), inRange(schema.lessonProgress.lastSeenAt, f));
    const [progress, periodTime, pings, bestQuiz] = await Promise.all([
      db
        .select()
        .from(schema.lessonProgress)
        .where(and(inArray(schema.lessonProgress.userId, ids), f.from || f.to ? range : undefined)),
      db
        .select({ u: schema.activityLog.userId, l: schema.activityLog.lessonId, s: sql<number>`coalesce(sum(${schema.activityLog.seconds}),0)::int`, n: sql<number>`count(*)::int` })
        .from(schema.activityLog)
        .where(and(inArray(schema.activityLog.userId, ids), eq(schema.activityLog.kind, "lesson_time"), inRange(schema.activityLog.at, f)))
        .groupBy(schema.activityLog.userId, schema.activityLog.lessonId),
      db
        .select({ u: schema.activityLog.userId, l: schema.activityLog.lessonId, n: sql<number>`count(*)::int` })
        .from(schema.activityLog)
        .where(and(inArray(schema.activityLog.userId, ids), eq(schema.activityLog.kind, "tutor")))
        .groupBy(schema.activityLog.userId, schema.activityLog.lessonId),
      db
        .select({ u: schema.quizAttempts.userId, m: schema.quizAttempts.moduleId, best: sql<number>`max(${schema.quizAttempts.percent})`, n: sql<number>`count(*)::int`, first: sql<Date>`min(${schema.quizAttempts.at})` })
        .from(schema.quizAttempts)
        .where(inArray(schema.quizAttempts.userId, ids))
        .groupBy(schema.quizAttempts.userId, schema.quizAttempts.moduleId),
    ]);
    const periodBy = new Map(periodTime.map((p) => [`${p.u}|${p.l}`, p]));
    const tutorBy = new Map(pings.map((p) => [`${p.u}|${p.l}`, Number(p.n)]));
    const quizBy = new Map(bestQuiz.map((q) => [`${q.u}|${q.m}`, q]));
    headers = [
      "Apprenant",
      "E-mail",
      "Niveau",
      "Module",
      "Leçon",
      "Titre de la leçon",
      "Durée prévue (min)",
      "Première ouverture",
      "Terminée le",
      "Statut",
      "Temps passé total (min)",
      "Temps sur la période (min)",
      "Relevés de temps sur la période",
      "Questions au tuteur",
      "Meilleur score quiz du module (%)",
      "Tentatives quiz du module",
    ];
    const sorted = [...progress].sort((a, b) => name(a.userId).localeCompare(name(b.userId), "fr") || (lessons.get(a.lessonId)?.globalIndex ?? 0) - (lessons.get(b.lessonId)?.globalIndex ?? 0));
    rows = sorted.map((p) => {
      const l = lessons.get(p.lessonId);
      const per = periodBy.get(`${p.userId}|${p.lessonId}`);
      const q = l ? quizBy.get(`${p.userId}|${l.moduleId}`) : undefined;
      return [
        name(p.userId),
        email(p.userId),
        l?.levelId ?? "",
        l?.moduleId ?? "",
        p.lessonId,
        l?.title ?? "",
        l?.minutes ?? null,
        p.firstOpenedAt,
        p.completedAt,
        p.status === "completed" ? "Terminée" : "Commencée",
        minutes(p.timeSpentSeconds),
        minutes(Number(per?.s ?? 0)),
        Number(per?.n ?? 0),
        tutorBy.get(`${p.userId}|${p.lessonId}`) ?? 0,
        q ? Number(q.best) : null,
        q ? Number(q.n) : 0,
      ];
    });
  } else if (type === "activite") {
    const day = sql<string>`to_char(${schema.activityLog.at} at time zone 'Europe/Paris', 'YYYY-MM-DD')`;
    const data = await db
      .select({
        u: schema.activityLog.userId,
        day,
        seconds: sql<number>`coalesce(sum(${schema.activityLog.seconds}) filter (where ${schema.activityLog.kind} = 'lesson_time'), 0)::int`,
        lessons: sql<number>`count(*) filter (where ${schema.activityLog.kind} = 'lesson_complete')::int`,
        quizzes: sql<number>`count(*) filter (where ${schema.activityLog.kind} = 'quiz')::int`,
        exams: sql<number>`count(*) filter (where ${schema.activityLog.kind} = 'exam')::int`,
        tutor: sql<number>`count(*) filter (where ${schema.activityLog.kind} = 'tutor')::int`,
        logins: sql<number>`count(*) filter (where ${schema.activityLog.kind} = 'login')::int`,
        distinctLessons: sql<number>`count(distinct ${schema.activityLog.lessonId})::int`,
        first: sql<Date>`min(${schema.activityLog.at})`,
        last: sql<Date>`max(${schema.activityLog.at})`,
      })
      .from(schema.activityLog)
      .where(and(inArray(schema.activityLog.userId, ids), inRange(schema.activityLog.at, f)))
      .groupBy(schema.activityLog.userId, sql`2`)
      .orderBy(sql`2`);
    headers = ["Date", "Apprenant", "E-mail", "Temps de formation (min)", "Leçons consultées", "Leçons terminées", "Quiz passés", "Examens", "Questions au tuteur", "Connexions", "Première activité", "Dernière activité"];
    rows = data
      .sort((a, b) => a.day.localeCompare(b.day) || name(a.u).localeCompare(name(b.u), "fr"))
      .map((d) => [
        d.day.split("-").reverse().join("/"),
        name(d.u),
        email(d.u),
        minutes(Number(d.seconds)),
        Number(d.distinctLessons),
        Number(d.lessons),
        Number(d.quizzes),
        Number(d.exams),
        Number(d.tutor),
        Number(d.logins),
        new Date(d.first),
        new Date(d.last),
      ]);
  } else if (type === "quiz") {
    const modules = new Map(getProgramme().levels.flatMap((l) => l.modules.map((m) => [m.id, { ...m, levelId: l.id }])));
    const data = await db
      .select()
      .from(schema.quizAttempts)
      .where(and(inArray(schema.quizAttempts.userId, ids), inRange(schema.quizAttempts.at, f)))
      .orderBy(asc(schema.quizAttempts.at));
    headers = ["Date", "Apprenant", "E-mail", "Niveau", "Module", "Titre du module", "Bonnes réponses", "Questions", "Score (%)", "Réussi"];
    rows = data.map((q) => [q.at, name(q.userId), email(q.userId), modules.get(q.moduleId)?.levelId ?? "", q.moduleId, modules.get(q.moduleId)?.title ?? "", q.score, q.total, q.percent, q.passed]);
  } else if (type === "examens") {
    const data = await db
      .select()
      .from(schema.examAttempts)
      .where(and(inArray(schema.examAttempts.userId, ids), inRange(schema.examAttempts.startedAt, f)))
      .orderBy(asc(schema.examAttempts.startedAt));
    const counter = new Map<string, number>();
    headers = ["Apprenant", "E-mail", "Niveau", "Tentative n°", "Début", "Échéance", "Soumission", "Durée (min)", "Bonnes réponses", "Score (%)", "Réussi", "Annulée le", "Identifiant"];
    rows = data.map((e) => {
      const key = `${e.userId}|${e.levelId}`;
      const n = e.voidedAt ? null : (counter.get(key) ?? 0) + 1;
      if (n) counter.set(key, n);
      return [
        name(e.userId),
        email(e.userId),
        e.levelId,
        n ?? "annulée",
        e.startedAt,
        e.deadlineAt,
        e.submittedAt,
        e.submittedAt ? minutes((e.submittedAt.getTime() - e.startedAt.getTime()) / 1000) : null,
        e.score,
        e.percent,
        e.passed === null ? "" : e.passed,
        e.voidedAt,
        e.id,
      ];
    });
  } else {
    const levels = new Map(getProgramme().levels.map((l) => [l.id, l]));
    const data = await db
      .select()
      .from(schema.certificates)
      .where(and(inArray(schema.certificates.userId, ids), inRange(schema.certificates.issuedAt, f)))
      .orderBy(asc(schema.certificates.issuedAt));
    headers = ["Numéro", "Apprenant", "E-mail", "Niveau", "Intitulé", "Émis le", "Statut", "Révoqué le", "Vérification"];
    rows = data.map((c) => [c.number, name(c.userId), email(c.userId), c.levelId, levels.get(c.levelId)?.certificate ?? levels.get(c.levelId)?.title ?? "", c.issuedAt, c.revokedAt ? "Révoqué" : "Valide", c.revokedAt, absoluteUrl(routes.verify(c.number))]);
  }
  return { filename, csv: toCsv(headers, rows), rows: rows.length };
}
