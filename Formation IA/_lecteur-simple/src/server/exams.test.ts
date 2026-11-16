/**
 * Tests d'intégration des examens (PostgreSQL local + vrai contenu de la formation).
 * Ignorés si la base n'est pas joignable (bash scripts/dev-db.sh && npm run setup).
 */
import { afterAll, describe, expect, it } from "vitest";
import { eq, inArray } from "drizzle-orm";
import { db, pool, schema } from "@/db";
import { getExam, getLevel } from "@/content/loader";
import { ExamError, getExamOverview, getExamResult, getTakingPayload, saveExamAnswer, startExamAttempt, submitExamAttempt } from "./exams";

let dbUp = false;
try {
  await pool.query("select 1 from exam_attempts limit 1");
  dbUp = true;
} catch {
  dbUp = false;
}

const created: string[] = [];
const T0 = new Date("2026-06-01T08:00:00Z");
const at = (ms: number) => new Date(T0.getTime() + ms);

async function learnerReadyForN1(tag: string) {
  const [u] = await db
    .insert(schema.users)
    .values({ email: `test-exam-${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@formation-ia.local`, firstName: "Test", lastName: tag, passwordHash: "x" })
    .returning();
  created.push(u.id);
  const level = getLevel("N1")!;
  await db.insert(schema.quizAttempts).values(level.modules.map((m) => ({ userId: u.id, moduleId: m.id, score: 10, total: 10, percent: 100, passed: true, answers: [], at: T0 })));
  return u.id;
}

/** Réponses affichées (justes ou fausses) d'une tentative, calculées côté test à partir de l'ordre stocké. */
async function displayedAnswers(attemptId: string, correct: (i: number) => boolean) {
  const [a] = await db.select().from(schema.examAttempts).where(eq(schema.examAttempts.id, attemptId));
  const exam = getExam("N1")!;
  const out: Record<string, number | null> = {};
  a.questionOrder.forEach((qid, i) => {
    const q = exam.questions.find((x) => x.id === qid)!;
    const good = a.optionOrders[qid].indexOf(q.answer);
    out[qid] = correct(i) ? good : (good + 1) % q.options.length;
  });
  return out;
}

describe.skipIf(!dbUp)("examens (intégration)", () => {
  afterAll(async () => {
    if (created.length) await db.delete(schema.users).where(inArray(schema.users.id, created));
  });

  it("refuse de créer une tentative tant que les quiz du niveau ne sont pas réussis", async () => {
    const [u] = await db.insert(schema.users).values({ email: `test-exam-locked-${Date.now()}@formation-ia.local`, passwordHash: "x" }).returning();
    created.push(u.id);
    await expect(startExamAttempt(u.id, "N1", T0)).rejects.toMatchObject({ code: "locked" });
  });

  it("crée la tentative (ordre mélangé, échéance +60 min), reprend la même et n'expose aucune réponse", async () => {
    const uid = await learnerReadyForN1("create");
    const r1 = await startExamAttempt(uid, "N1", T0, () => 0.42);
    expect(r1.resumed).toBe(false);
    const r2 = await startExamAttempt(uid, "N1", at(60_000));
    expect(r2).toEqual({ attemptId: r1.attemptId, resumed: true });

    const [row] = await db.select().from(schema.examAttempts).where(eq(schema.examAttempts.id, r1.attemptId));
    expect(row.deadlineAt.getTime() - row.startedAt.getTime()).toBe(60 * 60_000);
    expect(row.questionOrder).toHaveLength(40);
    expect(Object.keys(row.optionOrders)).toHaveLength(40);

    const payload = (await getTakingPayload(uid, r1.attemptId, at(120_000)))!;
    const json = JSON.stringify(payload);
    expect(json).not.toMatch(/"answer"/);
    expect(json).not.toMatch(/"explanation"/);
    const exam = getExam("N1")!;
    for (const q of exam.questions.slice(0, 10)) expect(json).not.toContain(q.explanation.slice(0, 40));
    expect(payload.questions).toHaveLength(40);
    // Correction inaccessible avant soumission.
    expect(await getExamResult(uid, r1.attemptId, at(120_000))).toBeNull();
  });

  it("sauvegarde automatique puis refus après l'échéance + 30 s", async () => {
    const uid = await learnerReadyForN1("deadline");
    const { attemptId } = await startExamAttempt(uid, "N1", T0);
    const p = (await getTakingPayload(uid, attemptId, T0))!;
    const qid = p.questions[0].id;
    expect((await saveExamAnswer(uid, attemptId, { questionId: qid, choice: 1, flagged: true }, at(59 * 60_000))).ok).toBe(true);
    const reload = (await getTakingPayload(uid, attemptId, at(59 * 60_000)))!;
    expect(reload.answers[qid]).toBe(1);
    expect(reload.flagged).toEqual([qid]);
    const late = await saveExamAnswer(uid, attemptId, { questionId: p.questions[1].id, choice: 0 }, at(60 * 60_000 + 31_000));
    expect(late).toMatchObject({ ok: false, reason: "closed" });
    // Envoi final tardif : les réponses transmises sont ignorées, seules les réponses enregistrées comptent.
    const all = await displayedAnswers(attemptId, () => true);
    const sub = await submitExamAttempt(uid, attemptId, all, at(60 * 60_000 + 45_000));
    expect(sub.late).toBe(true);
    expect(sub.passed).toBe(false);
    const res = (await getExamResult(uid, attemptId, at(61 * 60_000)))!;
    expect(res.correction.items.filter((i) => i.given !== null)).toHaveLength(1);
    expect(res.attempt.submittedAt!.getTime()).toBe(res.attempt.deadlineAt.getTime());
  });

  it("réussite : note, score par compétence, XP +300, certificat, niveau suivant débloqué", async () => {
    const uid = await learnerReadyForN1("pass");
    const { attemptId } = await startExamAttempt(uid, "N1", T0);
    const answers = await displayedAnswers(attemptId, (i) => i % 8 !== 0); // 35/40
    const sub = await submitExamAttempt(uid, attemptId, answers, at(30 * 60_000));
    expect(sub).toMatchObject({ passed: true, percent: 87.5, late: false });
    expect(sub.certificateNumber).toMatch(/^NF-IA-N1-2026-[2-9A-HJKMNP-Z]{6}$/);
    expect(sub.newBadges).toContain("niveau-1");
    const xp = await db.select().from(schema.xpEvents).where(eq(schema.xpEvents.userId, uid));
    expect(xp.find((x) => x.reason === "exam_pass")?.amount).toBe(300);
    const res = (await getExamResult(uid, attemptId, at(31 * 60_000)))!;
    expect(res.correction.score).toBe(35);
    expect(res.correction.byCompetence.reduce((s, c) => s + c.total, 0)).toBe(40);
    expect(res.correction.byCompetence.map((c) => c.competence)).toEqual(["C1.1", "C1.2", "C1.3", "C1.4", "C1.5", "C1.6"]);
    expect(res.competenceLabels["C1.3"]).toMatch(/prompt/i);
    expect(res.nextLevelId).toBe("N2");
    const o = await getExamOverview(uid, "N1", at(32 * 60_000));
    expect(o.status.kind).toBe("passed");
    await expect(startExamAttempt(uid, "N1", at(33 * 60_000))).rejects.toMatchObject({ code: "passed" });
  });

  it("échec : délai de 7 jours, puis refus de la 4e tentative", async () => {
    const uid = await learnerReadyForN1("fail");
    const fail = async (t: Date) => {
      const { attemptId } = await startExamAttempt(uid, "N1", t);
      const answers = await displayedAnswers(attemptId, (i) => i < 20); // 50 %
      const r = await submitExamAttempt(uid, attemptId, answers, new Date(t.getTime() + 20 * 60_000));
      expect(r.passed).toBe(false);
      return r;
    };
    await fail(T0);
    const err = await startExamAttempt(uid, "N1", at(3 * 86_400_000)).catch((e) => e);
    expect(err).toBeInstanceOf(ExamError);
    expect(err.code).toBe("cooldown");
    expect(err.nextAvailableAt.getTime()).toBe(at(20 * 60_000 + 7 * 86_400_000).getTime());
    await fail(at(8 * 86_400_000));
    await fail(at(16 * 86_400_000));
    await expect(startExamAttempt(uid, "N1", at(30 * 86_400_000))).rejects.toMatchObject({ code: "exhausted" });
    const o = await getExamOverview(uid, "N1", at(30 * 86_400_000));
    expect(o.attempts.map((a) => a.number)).toEqual([1, 2, 3]);
  });

  it("tentative abandonnée : clôturée automatiquement à l'échéance avec les réponses enregistrées", async () => {
    const uid = await learnerReadyForN1("abandon");
    const { attemptId } = await startExamAttempt(uid, "N1", T0);
    const o = await getExamOverview(uid, "N1", at(2 * 3_600_000));
    expect(o.status.kind).toBe("cooldown");
    const [row] = await db.select().from(schema.examAttempts).where(eq(schema.examAttempts.id, attemptId));
    expect(row.submittedAt?.getTime()).toBe(row.deadlineAt.getTime());
    expect(row.passed).toBe(false);
  });
});
