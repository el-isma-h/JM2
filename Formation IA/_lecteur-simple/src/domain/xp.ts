/**
 * Barème XP (SPEC § Gamification) : leçon terminée +20, quiz réussi +50 / sans faute +100, examen réussi +300.
 *
 * Chaque récompense est identifiée par (motif, référence) et n'est accordée qu'une fois (index unique
 * `xp_events_unique_award`). Le « sans faute » est un bonus de +50 qui s'ajoute au +50 de réussite :
 * un quiz réussi sans faute rapporte donc 100 XP au total, même s'il est réussi en deux fois.
 */

export const XP = {
  lessonComplete: 20,
  quizPass: 50,
  quizPerfectBonus: 50,
  examPass: 300,
} as const;

export const XP_REASONS = ["lesson_complete", "quiz_pass", "quiz_perfect", "exam_pass"] as const;
export type XpReason = (typeof XP_REASONS)[number];

export type XpAward = { reason: XpReason; refId: string; amount: number };

/** Seuil de réussite des quiz et examens (programme.json : passScore). */
export const DEFAULT_PASS_SCORE = 70;

export function lessonXp(lessonId: string): XpAward[] {
  return [{ reason: "lesson_complete", refId: lessonId, amount: XP.lessonComplete }];
}

/** Récompenses d'une tentative de quiz (à insérer avec ON CONFLICT DO NOTHING). */
export function quizXp(moduleId: string, percent: number, passScore = DEFAULT_PASS_SCORE): XpAward[] {
  if (percent < passScore) return [];
  const awards: XpAward[] = [{ reason: "quiz_pass", refId: moduleId, amount: XP.quizPass }];
  if (percent >= 100) awards.push({ reason: "quiz_perfect", refId: moduleId, amount: XP.quizPerfectBonus });
  return awards;
}

export function examXp(levelId: string, passed: boolean): XpAward[] {
  return passed ? [{ reason: "exam_pass", refId: levelId, amount: XP.examPass }] : [];
}

export function totalXp(events: readonly { amount: number }[]): number {
  return events.reduce((sum, e) => sum + e.amount, 0);
}

/** Paliers d'XP (titres affichés sur le tableau de bord). Purement décoratif : aucun classement entre apprenants. */
export const XP_RANKS = [
  { min: 0, title: "Curieux" },
  { min: 200, title: "Initié" },
  { min: 600, title: "Utilisateur" },
  { min: 1500, title: "Praticien" },
  { min: 3000, title: "Développeur" },
  { min: 5000, title: "Expert" },
] as const;

export type XpRank = { index: number; title: string; min: number; nextMin: number | null; progress: number };

export function xpRank(xp: number): XpRank {
  let index = 0;
  for (let i = 0; i < XP_RANKS.length; i++) if (xp >= XP_RANKS[i].min) index = i;
  const current = XP_RANKS[index];
  const next = XP_RANKS[index + 1] ?? null;
  const progress = next ? Math.min(1, (xp - current.min) / (next.min - current.min)) : 1;
  return { index, title: current.title, min: current.min, nextMin: next ? next.min : null, progress };
}
