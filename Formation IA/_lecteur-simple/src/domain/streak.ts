/**
 * Série de jours (streak) et objectif quotidien, calculés à partir des `xp_events`, en jours calendaires
 * du fuseau Europe/Paris (une leçon terminée à 23 h 30 à Paris compte pour ce jour-là, même s'il est 22 h 30 UTC).
 *
 * Règle : la série courante compte les jours consécutifs avec au moins un gain d'XP, en terminant aujourd'hui
 * ou hier (la série n'est pas perdue tant que la journée en cours n'est pas finie).
 */

export const TIME_ZONE = "Europe/Paris";

const dayFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
const hourFormatter = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "2-digit", hourCycle: "h23" });

/** Clé de jour « AAAA-MM-JJ » à Paris. */
export function parisDayKey(d: Date): string {
  return dayFormatter.format(d);
}

/** Heure (0-23) à Paris. */
export function parisHour(d: Date): number {
  return Number(hourFormatter.format(d)) % 24;
}

/** Décale une clé de jour de `delta` jours (arithmétique de calendrier, indépendante des changements d'heure). */
export function shiftDayKey(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + delta));
  return t.toISOString().slice(0, 10);
}

export type StreakInfo = {
  /** Jours consécutifs jusqu'à aujourd'hui (ou hier si rien aujourd'hui). */
  current: number;
  longest: number;
  activeToday: boolean;
  /** Jours actifs (clés AAAA-MM-JJ), triés. */
  activeDays: string[];
};

export function computeStreak(dates: readonly Date[], now: Date): StreakInfo {
  const days = new Set(dates.map(parisDayKey));
  const sorted = [...days].sort();
  const today = parisDayKey(now);
  const activeToday = days.has(today);

  let current = 0;
  let cursor = activeToday ? today : shiftDayKey(today, -1);
  while (days.has(cursor)) {
    current++;
    cursor = shiftDayKey(cursor, -1);
  }

  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const key of sorted) {
    run = prev !== null && shiftDayKey(prev, 1) === key ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = key;
  }

  return { current, longest, activeToday, activeDays: sorted };
}

export type DailyGoal = { goal: number; earned: number; reached: boolean; progress: number };

/** XP gagnés aujourd'hui (jour de Paris) face à l'objectif quotidien. */
export function dailyGoalProgress(events: readonly { amount: number; at: Date }[], goal: number, now: Date): DailyGoal {
  const today = parisDayKey(now);
  const earned = events.filter((e) => parisDayKey(e.at) === today).reduce((s, e) => s + e.amount, 0);
  const safeGoal = Math.max(1, goal);
  return { goal: safeGoal, earned, reached: earned >= safeGoal, progress: Math.min(1, earned / safeGoal) };
}

/** Objectifs quotidiens proposés dans le profil. */
export const DAILY_GOAL_OPTIONS = [
  { xp: 20, label: "Détente — 1 leçon" },
  { xp: 50, label: "Régulier — 2 leçons" },
  { xp: 100, label: "Intensif — 1 module" },
  { xp: 150, label: "Marathon" },
] as const;
