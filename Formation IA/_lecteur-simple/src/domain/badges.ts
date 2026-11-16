/**
 * Catalogue des badges et règles d'obtention. `evaluateBadges(ctx)` renvoie la liste des badges mérités ;
 * la couche serveur (`syncBadges`) insère ceux qui manquent dans `user_badges` (jamais de retrait).
 *
 * `icon` est le nom d'une icône @phosphor-icons/react (voir components/badges/badge-icon.tsx).
 */

export type BadgeCategory = "progression" | "regularite" | "maitrise" | "certification" | "exploration";

export type BadgeDef = {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: BadgeCategory;
};

export const BADGES = [
  { id: "premiere-lecon", title: "Premier pas", description: "Terminer votre première leçon.", icon: "Footprints", category: "progression" },
  { id: "lecons-10", title: "Lancé", description: "Terminer 10 leçons.", icon: "BookOpen", category: "progression" },
  { id: "lecons-50", title: "Assidu", description: "Terminer 50 leçons.", icon: "Books", category: "progression" },
  { id: "lecons-150", title: "Intégrale", description: "Terminer les 150 leçons de la formation.", icon: "Crown", category: "progression" },
  { id: "module-termine", title: "Module bouclé", description: "Terminer toutes les leçons d'un module et réussir son quiz.", icon: "SquaresFour", category: "progression" },
  { id: "premier-quiz", title: "Premier quiz", description: "Réussir votre premier quiz de module.", icon: "Question", category: "maitrise" },
  { id: "sans-faute", title: "Sans faute", description: "Obtenir 100 % à un quiz de module.", icon: "Target", category: "maitrise" },
  { id: "sans-faute-5", title: "Précision", description: "Obtenir 100 % à cinq quiz de module différents.", icon: "Crosshair", category: "maitrise" },
  { id: "serie-3", title: "Trois jours", description: "Apprendre trois jours d'affilée.", icon: "Flame", category: "regularite" },
  { id: "serie-7", title: "Une semaine", description: "Apprendre sept jours d'affilée.", icon: "CalendarCheck", category: "regularite" },
  { id: "serie-30", title: "Un mois", description: "Apprendre trente jours d'affilée.", icon: "Medal", category: "regularite" },
  { id: "oiseau-de-nuit", title: "Oiseau de nuit", description: "Terminer une leçon entre minuit et 5 h.", icon: "MoonStars", category: "regularite" },
  { id: "leve-tot", title: "Lève-tôt", description: "Terminer une leçon entre 5 h et 7 h.", icon: "SunHorizon", category: "regularite" },
  { id: "niveau-1", title: "Utilisateur IA certifié", description: "Réussir l'examen du niveau 1.", icon: "Certificate", category: "certification" },
  { id: "niveau-2", title: "Praticien IA", description: "Réussir l'examen du niveau 2.", icon: "Lightning", category: "certification" },
  { id: "niveau-3", title: "Développeur IA", description: "Réussir l'examen du niveau 3.", icon: "Code", category: "certification" },
  { id: "niveau-4", title: "Expert IA", description: "Réussir l'examen du niveau 4.", icon: "Brain", category: "certification" },
  { id: "examen-premier-coup", title: "Du premier coup", description: "Réussir un examen de niveau dès la première tentative.", icon: "Trophy", category: "certification" },
  { id: "tuteur-consulte", title: "Bonne question", description: "Poser une première question au tuteur IA.", icon: "ChatCircleDots", category: "exploration" },
  { id: "cle-api", title: "Autonome", description: "Configurer votre propre clé API.", icon: "Key", category: "exploration" },
] as const satisfies readonly BadgeDef[];

export type BadgeId = (typeof BADGES)[number]["id"];

export const BADGE_BY_ID: Record<string, BadgeDef> = Object.fromEntries(BADGES.map((b) => [b.id, b]));

export type BadgeContext = {
  /** Dates de fin des leçons terminées. */
  lessonCompletions: readonly Date[];
  /** Nombre de modules terminés (leçons + quiz réussi). */
  modulesCompleted: number;
  /** Tentatives de quiz (au moins `moduleId`, `percent`, `passed`). */
  quizAttempts: readonly { moduleId: string; percent: number; passed: boolean }[];
  /** Niveaux dont l'examen est réussi. */
  passedExams: ReadonlySet<string>;
  /** Pour chaque niveau réussi : numéro (1-based) de la tentative réussie, hors tentatives annulées. */
  examPassAttemptNumber: Readonly<Record<string, number>>;
  /** Plus longue série de jours. */
  longestStreak: number;
  tutorQuestions: number;
  hasPersonalApiKey: boolean;
  /** Heure (0-23, Europe/Paris) d'un instant : injectée pour garder le domaine pur et testable. */
  hourOf: (d: Date) => number;
};

export function evaluateBadges(ctx: BadgeContext): BadgeId[] {
  const earned: BadgeId[] = [];
  const add = (id: BadgeId, cond: boolean) => {
    if (cond) earned.push(id);
  };
  const lessons = ctx.lessonCompletions.length;
  const perfectModules = new Set(ctx.quizAttempts.filter((a) => a.percent >= 100).map((a) => a.moduleId));
  const hours = ctx.lessonCompletions.map(ctx.hourOf);

  add("premiere-lecon", lessons >= 1);
  add("lecons-10", lessons >= 10);
  add("lecons-50", lessons >= 50);
  add("lecons-150", lessons >= 150);
  add("module-termine", ctx.modulesCompleted >= 1);
  add("premier-quiz", ctx.quizAttempts.some((a) => a.passed));
  add("sans-faute", perfectModules.size >= 1);
  add("sans-faute-5", perfectModules.size >= 5);
  add("serie-3", ctx.longestStreak >= 3);
  add("serie-7", ctx.longestStreak >= 7);
  add("serie-30", ctx.longestStreak >= 30);
  add("oiseau-de-nuit", hours.some((h) => h >= 0 && h < 5));
  add("leve-tot", hours.some((h) => h >= 5 && h < 7));
  add("niveau-1", ctx.passedExams.has("N1"));
  add("niveau-2", ctx.passedExams.has("N2"));
  add("niveau-3", ctx.passedExams.has("N3"));
  add("niveau-4", ctx.passedExams.has("N4"));
  add("examen-premier-coup", Object.values(ctx.examPassAttemptNumber).some((n) => n === 1));
  add("tuteur-consulte", ctx.tutorQuestions >= 1);
  add("cle-api", ctx.hasPersonalApiKey);
  return earned;
}

/** Badges mérités qui ne sont pas encore attribués. */
export function newBadges(earned: readonly string[], owned: readonly string[]): string[] {
  const have = new Set(owned);
  return earned.filter((id) => !have.has(id));
}
