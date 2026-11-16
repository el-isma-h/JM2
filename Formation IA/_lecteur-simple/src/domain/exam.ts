/**
 * Examens de niveau (SPEC § Examens) : 60 min chronométrées côté serveur, 3 tentatives maximum par niveau,
 * 7 jours d'attente entre deux tentatives, ordre des questions ET des options mélangé, correction côté serveur.
 *
 * Mélange : `optionOrders[qid]` est une permutation `affiché → origine` : l'option affichée en position i
 * est l'option d'origine `perm[i]`. Le client répond en indices AFFICHÉS ; le serveur convertit avec
 * `toOriginalChoice` puis corrige avec `gradeExam` (qui travaille en indices d'origine).
 */

export const EXAM_MAX_ATTEMPTS = 3;
export const EXAM_COOLDOWN_DAYS = 7;
export const EXAM_DEFAULT_MINUTES = 60;
/** Tolérance réseau à la soumission après l'échéance. */
export const EXAM_GRACE_SECONDS = 30;

const DAY_MS = 86_400_000;

// ---------- Hasard reproductible ----------

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Graine 32 bits à partir d'une chaîne (FNV-1a). */
export function seedFromString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mélange de Fisher-Yates (copie). */
export function shuffle<T>(items: readonly T[], rand: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- Ordre d'une tentative ----------

export type ExamOrder = { questionOrder: string[]; optionOrders: Record<string, number[]> };

/** Construit l'ordre mélangé d'une nouvelle tentative (à stocker dans exam_attempts). */
export function buildExamOrder(questions: readonly { id: string; options: readonly unknown[] }[], rand: () => number = Math.random): ExamOrder {
  const questionOrder = shuffle(
    questions.map((q) => q.id),
    rand,
  );
  const optionOrders: Record<string, number[]> = {};
  for (const q of questions) {
    optionOrders[q.id] = shuffle(
      q.options.map((_, i) => i),
      rand,
    );
  }
  return { questionOrder, optionOrders };
}

/** Questions dans l'ordre de la tentative, options permutées. Ne lit que `id` et `options` : passer des questions publiques. */
export function applyExamOrder<Q extends { id: string; options: readonly string[] }>(questions: readonly Q[], order: ExamOrder): (Q & { options: string[] })[] {
  const byId = new Map(questions.map((q) => [q.id, q]));
  return order.questionOrder
    .map((id) => byId.get(id))
    .filter((q): q is Q => q !== undefined)
    .map((q) => {
      const perm = order.optionOrders[q.id] ?? q.options.map((_, i) => i);
      return { ...q, options: perm.map((i) => q.options[i]) };
    });
}

/** Indice affiché → indice d'origine (null si hors bornes ou sans réponse). */
export function toOriginalChoice(perm: readonly number[] | undefined, displayed: number | null | undefined): number | null {
  if (displayed === null || displayed === undefined || !Number.isInteger(displayed)) return null;
  if (!perm) return displayed;
  return perm[displayed] ?? null;
}

/** Indice d'origine → indice affiché (pour réafficher une réponse enregistrée). */
export function toDisplayedChoice(perm: readonly number[] | undefined, original: number | null | undefined): number | null {
  if (original === null || original === undefined) return null;
  if (!perm) return original;
  const i = perm.indexOf(original);
  return i === -1 ? null : i;
}

// ---------- Correction ----------

export type GradableQuestion = { id: string; answer: number; competence?: string };

export type CompetenceScore = { competence: string; correct: number; total: number; percent: number };

export type GradeResult = {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  byCompetence: CompetenceScore[];
  details: { questionId: string; choice: number | null; answer: number; correct: boolean }[];
};

export function percentOf(score: number, total: number): number {
  return total === 0 ? 0 : Math.round((score / total) * 1000) / 10;
}

/** Corrige à partir de réponses en indices D'ORIGINE. Les questions sans réponse comptent faux. */
export function gradeExam(questions: readonly GradableQuestion[], answers: Readonly<Record<string, number | null | undefined>>, passScore = 70): GradeResult {
  const details = questions.map((q) => {
    const choice = answers[q.id] ?? null;
    return { questionId: q.id, choice, answer: q.answer, correct: choice === q.answer };
  });
  const score = details.filter((d) => d.correct).length;
  const total = questions.length;
  const percent = percentOf(score, total);

  const comp = new Map<string, { correct: number; total: number }>();
  questions.forEach((q, i) => {
    const key = q.competence ?? "—";
    const c = comp.get(key) ?? { correct: 0, total: 0 };
    c.total++;
    if (details[i].correct) c.correct++;
    comp.set(key, c);
  });
  const byCompetence = [...comp.entries()]
    .map(([competence, c]) => ({ competence, ...c, percent: percentOf(c.correct, c.total) }))
    .sort((a, b) => a.competence.localeCompare(b.competence, "fr", { numeric: true }));

  return { score, total, percent, passed: percent >= passScore, byCompetence, details };
}

// ---------- Tentatives ----------

export type AttemptLike = {
  id: string;
  startedAt: Date;
  deadlineAt: Date;
  submittedAt: Date | null;
  passed: boolean | null;
  voidedAt: Date | null;
};

export type AttemptStatus =
  | { kind: "passed"; attemptId: string }
  /** Tentative en cours, à reprendre (pas de nouvelle tentative). */
  | { kind: "in_progress"; attemptId: string; deadlineAt: Date }
  /** Tentative expirée non soumise : à clôturer côté serveur (soumission automatique) avant toute autre action. */
  | { kind: "needs_finalize"; attemptId: string }
  | { kind: "available"; attemptsUsed: number; remaining: number }
  | { kind: "cooldown"; attemptsUsed: number; remaining: number; nextAvailableAt: Date }
  | { kind: "exhausted"; attemptsUsed: number };

export function isAttemptOpen(a: AttemptLike, now: Date): boolean {
  return a.submittedAt === null && a.voidedAt === null && now.getTime() <= a.deadlineAt.getTime() + EXAM_GRACE_SECONDS * 1000;
}

/** Peut-on encore enregistrer une soumission pour cette tentative ? (échéance + tolérance) */
export function canSubmitAttempt(a: AttemptLike, now: Date): boolean {
  return isAttemptOpen(a, now);
}

/** Secondes restantes à afficher (jamais négatif). */
export function remainingSeconds(a: Pick<AttemptLike, "deadlineAt">, now: Date): number {
  return Math.max(0, Math.floor((a.deadlineAt.getTime() - now.getTime()) / 1000));
}

export function examDeadline(startedAt: Date, timeLimitMinutes = EXAM_DEFAULT_MINUTES): Date {
  return new Date(startedAt.getTime() + timeLimitMinutes * 60_000);
}

/**
 * État des tentatives d'un apprenant pour UN niveau. Les tentatives annulées (`voidedAt`) sont ignorées.
 * Délai : 7 jours à compter de la fin (soumission ou échéance) de la dernière tentative.
 */
export function examAttemptStatus(
  attempts: readonly AttemptLike[],
  now: Date,
  opts: { maxAttempts?: number; cooldownDays?: number } = {},
): AttemptStatus {
  const max = opts.maxAttempts ?? EXAM_MAX_ATTEMPTS;
  const cooldown = (opts.cooldownDays ?? EXAM_COOLDOWN_DAYS) * DAY_MS;
  const valid = attempts.filter((a) => a.voidedAt === null).sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());

  const passed = valid.find((a) => a.passed === true);
  if (passed) return { kind: "passed", attemptId: passed.id };

  const open = valid.find((a) => isAttemptOpen(a, now));
  if (open) return { kind: "in_progress", attemptId: open.id, deadlineAt: open.deadlineAt };

  const unfinalized = valid.find((a) => a.submittedAt === null);
  if (unfinalized) return { kind: "needs_finalize", attemptId: unfinalized.id };

  const used = valid.length;
  if (used >= max) return { kind: "exhausted", attemptsUsed: used };
  const last = valid.at(-1);
  if (last) {
    const end = (last.submittedAt ?? last.deadlineAt).getTime();
    const nextAvailableAt = new Date(end + cooldown);
    if (now < nextAvailableAt) return { kind: "cooldown", attemptsUsed: used, remaining: max - used, nextAvailableAt };
  }
  return { kind: "available", attemptsUsed: used, remaining: max - used };
}

/** Numéro (1-based) de la tentative réussie parmi les tentatives non annulées, ou null. */
export function passedAttemptNumber(attempts: readonly AttemptLike[]): number | null {
  const valid = attempts.filter((a) => a.voidedAt === null).sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());
  const i = valid.findIndex((a) => a.passed === true);
  return i === -1 ? null : i + 1;
}
