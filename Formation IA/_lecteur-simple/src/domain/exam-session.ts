/**
 * Déroulé d'une tentative d'examen (fonctions PURES, complément de exam.ts) :
 * décision de démarrage, payload client (liste blanche de champs : jamais `answer` ni `explanation`),
 * enregistrement des réponses en indices d'origine, correction détaillée après soumission,
 * compétences validées pour le certificat.
 */
import {
  EXAM_GRACE_SECONDS,
  applyExamOrder,
  canSubmitAttempt,
  gradeExam,
  toDisplayedChoice,
  toOriginalChoice,
  type AttemptLike,
  type AttemptStatus,
  type CompetenceScore,
  type ExamOrder,
  type GradeResult,
} from "./exam";

// ---------- Démarrage ----------

export type StartDecision =
  | { kind: "create" }
  | { kind: "resume"; attemptId: string }
  | { kind: "finalize_first"; attemptId: string }
  | { kind: "refused"; reason: "locked" | "passed" | "cooldown" | "exhausted"; nextAvailableAt?: Date };

/** Que faire quand l'apprenant demande à commencer l'examen ? Une seule tentative ouverte à la fois. */
export function decideStart(status: AttemptStatus, examUnlocked: boolean): StartDecision {
  switch (status.kind) {
    case "in_progress":
      return { kind: "resume", attemptId: status.attemptId };
    case "needs_finalize":
      return { kind: "finalize_first", attemptId: status.attemptId };
    case "passed":
      return { kind: "refused", reason: "passed" };
    case "exhausted":
      return { kind: "refused", reason: "exhausted" };
    case "cooldown":
      return { kind: "refused", reason: "cooldown", nextAvailableAt: status.nextAvailableAt };
    case "available":
      return examUnlocked ? { kind: "create" } : { kind: "refused", reason: "locked" };
  }
}

// ---------- Payload client ----------

/** Question telle qu'envoyée au navigateur pendant l'examen. */
export type TakingQuestion = { id: string; type: string; q: string; options: string[]; competence: string };

export type TakingPayload = {
  attemptId: string;
  levelId: string;
  title: string;
  startedAt: string;
  deadlineAt: string;
  /** Horloge serveur au moment du rendu (le client calcule son décalage). */
  serverNow: string;
  graceSeconds: number;
  questions: TakingQuestion[];
  /** Réponses enregistrées, en indices AFFICHÉS. */
  answers: Record<string, number>;
  flagged: string[];
};

type QuestionLike = { id: string; type: string; q: string; options: readonly string[]; competence: string };

type StoredAttempt = AttemptLike & {
  levelId: string;
  questionOrder: string[];
  optionOrders: Record<string, number[]>;
  answers: Record<string, number | null> | null;
  flagged: string[];
};

/**
 * Construit le payload d'une tentative en cours. Liste blanche explicite des champs : même si l'appelant passe
 * des questions complètes (avec `answer` / `explanation`), rien d'autre que l'énoncé et les options ne sort.
 */
export function buildTakingPayload(questions: readonly QuestionLike[], attempt: StoredAttempt, meta: { title: string; now: Date }): TakingPayload {
  const order: ExamOrder = { questionOrder: attempt.questionOrder, optionOrders: attempt.optionOrders };
  const ordered = applyExamOrder(
    questions.map((q) => ({ id: q.id, type: q.type, q: q.q, options: [...q.options], competence: q.competence })),
    order,
  );
  const answers: Record<string, number> = {};
  for (const [qid, original] of Object.entries(attempt.answers ?? {})) {
    const shown = toDisplayedChoice(attempt.optionOrders[qid], original);
    if (shown !== null) answers[qid] = shown;
  }
  return {
    attemptId: attempt.id,
    levelId: attempt.levelId,
    title: meta.title,
    startedAt: attempt.startedAt.toISOString(),
    deadlineAt: attempt.deadlineAt.toISOString(),
    serverNow: meta.now.toISOString(),
    graceSeconds: EXAM_GRACE_SECONDS,
    questions: ordered.map((q) => ({ id: q.id, type: q.type, q: q.q, options: q.options, competence: q.competence })),
    answers,
    flagged: attempt.flagged.filter((id) => attempt.questionOrder.includes(id)),
  };
}

// ---------- Réponses ----------

export type AnswerUpdate = { questionId: string; choice?: number | null; flagged?: boolean };

export type AnswerUpdateResult =
  | { ok: true; answers: Record<string, number | null>; flagged: string[] }
  | { ok: false; reason: "closed" | "unknown_question" | "invalid_choice" };

/**
 * Applique une mise à jour (indices AFFICHÉS → stockage en indices d'origine). Refusée après l'échéance + tolérance.
 * `choice: null` efface la réponse ; `choice` absent ne touche pas à la réponse (marquage seul).
 */
export function applyAnswerUpdate(attempt: StoredAttempt, update: AnswerUpdate, now: Date): AnswerUpdateResult {
  if (!canSubmitAttempt(attempt, now)) return { ok: false, reason: "closed" };
  if (!attempt.questionOrder.includes(update.questionId)) return { ok: false, reason: "unknown_question" };
  const answers = { ...(attempt.answers ?? {}) };
  if (update.choice !== undefined) {
    if (update.choice === null) delete answers[update.questionId];
    else {
      const original = toOriginalChoice(attempt.optionOrders[update.questionId], update.choice);
      if (original === null) return { ok: false, reason: "invalid_choice" };
      answers[update.questionId] = original;
    }
  }
  let flagged = attempt.flagged;
  if (update.flagged !== undefined) {
    const set = new Set(flagged);
    if (update.flagged) set.add(update.questionId);
    else set.delete(update.questionId);
    flagged = attempt.questionOrder.filter((id) => set.has(id));
  }
  return { ok: true, answers, flagged };
}

/** Convertit un lot de réponses AFFICHÉES (envoi final) en indices d'origine ; ignore les entrées invalides. */
export function displayedToOriginalAnswers(attempt: Pick<StoredAttempt, "questionOrder" | "optionOrders">, displayed: Readonly<Record<string, number | null>>): Record<string, number | null> {
  const out: Record<string, number | null> = {};
  for (const qid of attempt.questionOrder) {
    if (!(qid in displayed)) continue;
    const v = displayed[qid];
    if (v === null) continue;
    const original = toOriginalChoice(attempt.optionOrders[qid], v);
    if (original !== null) out[qid] = original;
  }
  return out;
}

// ---------- Correction ----------

type FullQuestion = QuestionLike & { answer: number; explanation: string; lessonId?: string; source?: { title: string; url: string } };

export type CorrectionItem = {
  index: number;
  questionId: string;
  lessonId: string | null;
  competence: string;
  type: string;
  q: string;
  /** Options dans l'ordre vu par l'apprenant. */
  options: string[];
  /** Indices affichés. */
  given: number | null;
  correctIndex: number;
  correct: boolean;
  explanation: string;
  source: { title: string; url: string } | null;
};

export type Correction = GradeResult & { items: CorrectionItem[] };

/** Note la tentative (réponses stockées en indices d'origine) et produit la correction dans l'ordre de l'apprenant. */
export function buildCorrection(questions: readonly FullQuestion[], attempt: Pick<StoredAttempt, "questionOrder" | "optionOrders" | "answers">, passScore: number): Correction {
  const answers = attempt.answers ?? {};
  const byId = new Map(questions.map((q) => [q.id, q]));
  const inAttempt = attempt.questionOrder.map((id) => byId.get(id)).filter((q): q is FullQuestion => q !== undefined);
  const grade = gradeExam(inAttempt, answers, passScore);
  const items = inAttempt.map((q, i): CorrectionItem => {
    const perm = attempt.optionOrders[q.id] ?? q.options.map((_, k) => k);
    const original = answers[q.id] ?? null;
    return {
      index: i + 1,
      questionId: q.id,
      lessonId: q.lessonId ?? null,
      competence: q.competence,
      type: q.type,
      q: q.q,
      options: perm.map((k) => q.options[k]),
      given: toDisplayedChoice(perm, original),
      correctIndex: toDisplayedChoice(perm, q.answer) ?? q.answer,
      correct: original === q.answer,
      explanation: q.explanation,
      source: q.source ? { title: q.source.title, url: q.source.url } : null,
    };
  });
  return { ...grade, items };
}

// ---------- Compétences ----------

/** Lit le tableau « | C1.1 | libellé | » d'un Markdown (niveau.md, référentiel). */
export function parseCompetenceLabels(markdown: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of markdown.split(/\r?\n/)) {
    const m = /^\|\s*(C\d+\.\d+)\s*\|\s*([^|]+?)\s*\|/.exec(line);
    if (m && !out[m[1]]) out[m[1]] = m[2];
  }
  return out;
}

/** Compétences validées (score de la compétence ≥ seuil) — affichées sur le certificat. */
export function validatedCompetences(byCompetence: readonly CompetenceScore[], passScore: number): string[] {
  return byCompetence.filter((c) => c.percent >= passScore).map((c) => c.competence);
}

/** Durée effective d'une tentative en secondes (plafonnée à l'échéance). */
export function attemptDurationSeconds(a: Pick<AttemptLike, "startedAt" | "deadlineAt" | "submittedAt">): number {
  const end = Math.min((a.submittedAt ?? a.deadlineAt).getTime(), a.deadlineAt.getTime());
  return Math.max(0, Math.round((end - a.startedAt.getTime()) / 1000));
}
