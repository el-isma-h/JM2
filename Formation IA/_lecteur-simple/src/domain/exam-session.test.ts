import { describe, expect, it } from "vitest";
import { buildExamOrder, examAttemptStatus, examDeadline, seededRandom, type AttemptLike } from "./exam";
import {
  applyAnswerUpdate,
  attemptDurationSeconds,
  buildCorrection,
  buildTakingPayload,
  decideStart,
  displayedToOriginalAnswers,
  parseCompetenceLabels,
  validatedCompetences,
} from "./exam-session";

const H = 3_600_000;
const D = 24 * H;
const t0 = new Date("2026-11-02T09:00:00Z");

const questions = Array.from({ length: 8 }, (_, i) => ({
  id: `N1-E0${i + 1}`,
  lessonId: `L00${i + 1}`,
  type: "qcm",
  q: `Question ${i + 1} ?`,
  options: ["opt-a", "opt-b", "opt-c", "opt-d"],
  answer: i % 4,
  explanation: `EXPLICATION-SECRETE-${i}`,
  competence: i < 4 ? "C1.1" : "C1.2",
  source: { title: "Source", url: "https://example.org" },
}));

function attempt(i: number, startedAt: Date, extra: Partial<AttemptLike> = {}): AttemptLike {
  return { id: `a${i}`, startedAt, deadlineAt: examDeadline(startedAt, 60), submittedAt: new Date(startedAt.getTime() + 40 * 60_000), passed: false, voidedAt: null, ...extra };
}

function stored(startedAt = t0) {
  const order = buildExamOrder(questions, seededRandom(7));
  return { id: "att", levelId: "N1", startedAt, deadlineAt: examDeadline(startedAt, 60), submittedAt: null, passed: null, voidedAt: null, ...order, answers: {} as Record<string, number | null>, flagged: [] as string[] };
}

describe("création de tentative (decideStart)", () => {
  it("crée une tentative quand l'examen est débloqué et aucune n'existe", () => {
    expect(decideStart(examAttemptStatus([], t0), true)).toEqual({ kind: "create" });
  });
  it("refuse si les quiz du niveau ne sont pas tous réussis", () => {
    expect(decideStart(examAttemptStatus([], t0), false)).toEqual({ kind: "refused", reason: "locked" });
  });
  it("une seule tentative ouverte : reprise de la tentative en cours", () => {
    const open = attempt(1, new Date(t0.getTime() - 10 * 60_000), { submittedAt: null, passed: null });
    expect(decideStart(examAttemptStatus([open], t0), true)).toEqual({ kind: "resume", attemptId: "a1" });
  });
  it("tentative expirée non soumise : clôture avant toute nouvelle tentative", () => {
    const stale = attempt(1, new Date(t0.getTime() - 3 * H), { submittedAt: null, passed: null });
    expect(decideStart(examAttemptStatus([stale], t0), true)).toEqual({ kind: "finalize_first", attemptId: "a1" });
  });
  it("refuse la 4e tentative", () => {
    const three = [attempt(1, new Date(t0.getTime() - 30 * D)), attempt(2, new Date(t0.getTime() - 20 * D)), attempt(3, new Date(t0.getTime() - 10 * D))];
    expect(decideStart(examAttemptStatus(three, t0), true)).toEqual({ kind: "refused", reason: "exhausted" });
  });
  it("les tentatives annulées par un formateur ne comptent pas", () => {
    const three = [attempt(1, new Date(t0.getTime() - 30 * D), { voidedAt: t0 }), attempt(2, new Date(t0.getTime() - 20 * D)), attempt(3, new Date(t0.getTime() - 10 * D))];
    expect(decideStart(examAttemptStatus(three, t0), true).kind).toBe("create");
  });
  it("délai de 7 jours après la soumission d'un échec", () => {
    const last = attempt(1, new Date(t0.getTime() - 2 * D));
    const d = decideStart(examAttemptStatus([last], t0), true);
    expect(d.kind).toBe("refused");
    if (d.kind === "refused") {
      expect(d.reason).toBe("cooldown");
      expect(d.nextAvailableAt!.getTime()).toBe(last.submittedAt!.getTime() + 7 * D);
    }
    const justBefore = new Date(last.submittedAt!.getTime() + 7 * D - 1000);
    const justAfter = new Date(last.submittedAt!.getTime() + 7 * D);
    expect(decideStart(examAttemptStatus([last], justBefore), true).kind).toBe("refused");
    expect(decideStart(examAttemptStatus([last], justAfter), true).kind).toBe("create");
  });
  it("examen déjà réussi : pas de nouvelle tentative", () => {
    expect(decideStart(examAttemptStatus([attempt(1, t0, { passed: true })], t0), true)).toEqual({ kind: "refused", reason: "passed" });
  });
});

describe("payload client : aucune bonne réponse ni explication", () => {
  it("liste blanche des champs même si l'appelant passe des questions complètes", () => {
    const a = stored();
    const p = buildTakingPayload(questions, a, { title: "Examen", now: t0 });
    const json = JSON.stringify(p);
    expect(json).not.toMatch(/"answer"/);
    expect(json).not.toMatch(/"explanation"/);
    expect(json).not.toContain("EXPLICATION-SECRETE");
    expect(json).not.toContain("example.org");
    for (const q of p.questions) expect(Object.keys(q).sort()).toEqual(["competence", "id", "options", "q", "type"]);
    expect(p.questions.map((q) => q.id)).toEqual(a.questionOrder);
    expect(p.deadlineAt).toBe(new Date(t0.getTime() + 60 * 60_000).toISOString());
  });
  it("réponses enregistrées renvoyées en indices AFFICHÉS (reprise après rechargement)", () => {
    const a = stored();
    const qid = a.questionOrder[0];
    const r = applyAnswerUpdate(a, { questionId: qid, choice: 2 }, t0);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.answers[qid]).toBe(a.optionOrders[qid][2]);
    const p = buildTakingPayload(questions, { ...a, answers: r.answers }, { title: "", now: t0 });
    expect(p.answers[qid]).toBe(2);
  });
});

describe("sauvegarde et échéance", () => {
  it("accepte jusqu'à l'échéance + 30 s, refuse ensuite", () => {
    const a = stored();
    const qid = a.questionOrder[1];
    const at = (ms: number) => new Date(a.deadlineAt.getTime() + ms);
    expect(applyAnswerUpdate(a, { questionId: qid, choice: 1 }, at(-1000)).ok).toBe(true);
    expect(applyAnswerUpdate(a, { questionId: qid, choice: 1 }, at(30_000)).ok).toBe(true);
    expect(applyAnswerUpdate(a, { questionId: qid, choice: 1 }, at(30_001))).toEqual({ ok: false, reason: "closed" });
  });
  it("refuse une question hors tentative ou un indice invalide ; marquage « à revoir »", () => {
    const a = stored();
    expect(applyAnswerUpdate(a, { questionId: "N2-E01", choice: 0 }, t0)).toEqual({ ok: false, reason: "unknown_question" });
    expect(applyAnswerUpdate(a, { questionId: a.questionOrder[0], choice: 9 }, t0)).toEqual({ ok: false, reason: "invalid_choice" });
    const r = applyAnswerUpdate(a, { questionId: a.questionOrder[3], flagged: true }, t0);
    expect(r.ok && r.flagged).toEqual([a.questionOrder[3]]);
  });
  it("tentative soumise : plus aucune écriture", () => {
    const a = { ...stored(), submittedAt: t0 };
    expect(applyAnswerUpdate(a, { questionId: a.questionOrder[0], choice: 0 }, t0)).toEqual({ ok: false, reason: "closed" });
  });
});

describe("notation et score par compétence", () => {
  it("note en indices d'origine, détaille par compétence et réordonne la correction", () => {
    const a = stored();
    // Réponses affichées → origine ; justes pour C1.1, fausses pour 2 questions C1.2, 1 sans réponse.
    const displayed: Record<string, number | null> = {};
    for (const q of questions) {
      const perm = a.optionOrders[q.id];
      const good = perm.indexOf(q.answer);
      if (q.competence === "C1.1") displayed[q.id] = good;
      else if (q.id === "N1-E05" || q.id === "N1-E06") displayed[q.id] = (good + 1) % 4;
      else if (q.id === "N1-E07") displayed[q.id] = good;
      else displayed[q.id] = null;
    }
    const answers = displayedToOriginalAnswers(a, displayed);
    const c = buildCorrection(questions, { ...a, answers }, 70);
    expect(c.score).toBe(5);
    expect(c.total).toBe(8);
    expect(c.percent).toBe(62.5);
    expect(c.passed).toBe(false);
    expect(c.byCompetence).toEqual([
      { competence: "C1.1", correct: 4, total: 4, percent: 100 },
      { competence: "C1.2", correct: 1, total: 4, percent: 25 },
    ]);
    expect(validatedCompetences(c.byCompetence, 70)).toEqual(["C1.1"]);
    expect(c.items.map((i) => i.questionId)).toEqual(a.questionOrder);
    const e8 = c.items.find((i) => i.questionId === "N1-E08")!;
    expect(e8.given).toBeNull();
    for (const it of c.items) expect(it.options[it.correctIndex]).toBe(questions.find((q) => q.id === it.questionId)!.options[questions.find((q) => q.id === it.questionId)!.answer]);
  });
  it("lit les libellés de compétences de niveau.md", () => {
    const md = "| Code | Compétence |\n|---|---|\n| C1.1 | Expliquer un LLM |\n| C1.2 | Choisir l'outil | x |\n| M01 | Titre | L001 |";
    expect(parseCompetenceLabels(md)).toEqual({ "C1.1": "Expliquer un LLM", "C1.2": "Choisir l'outil" });
  });
  it("durée plafonnée à l'échéance", () => {
    expect(attemptDurationSeconds({ startedAt: t0, deadlineAt: examDeadline(t0, 60), submittedAt: new Date(t0.getTime() + 2 * H) })).toBe(3600);
  });
});
