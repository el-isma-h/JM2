/**
 * Temps passé sur une leçon (preuve FOAD) : le client envoie un ping toutes les 30 s quand l'onglet est visible ;
 * le serveur n'accepte que ce qui est plausible :
 * - un ping ne compte jamais plus de TIME_PING_SECONDS (+ tolérance) ;
 * - pas plus que le temps réellement écoulé depuis le ping précédent (pas d'accélération par pings rapprochés) ;
 * - le cumul est plafonné à 1,5 × la durée prévue de la leçon.
 */

export const TIME_PING_SECONDS = 30;
export const TIME_PING_TOLERANCE = 5;
export const TIME_CAP_FACTOR = 1.5;

/** Plafond (secondes) du temps comptabilisé pour une leçon de `plannedMinutes`. */
export function lessonTimeCap(plannedMinutes: number): number {
  return Math.max(0, Math.round(Math.max(0, plannedMinutes) * 60 * TIME_CAP_FACTOR));
}

export function acceptedTimeIncrement(input: {
  /** Secondes déclarées par le client pour ce ping. */
  claimed: number;
  /** Cumul déjà enregistré pour cette leçon. */
  alreadySpent: number;
  plannedMinutes: number;
  /** Dernier ping accepté (null pour le premier). */
  lastSeenAt: Date | null;
  now: Date;
}): number {
  const claimed = Number.isFinite(input.claimed) ? Math.floor(input.claimed) : 0;
  let accepted = Math.min(Math.max(0, claimed), TIME_PING_SECONDS + TIME_PING_TOLERANCE);
  if (input.lastSeenAt) {
    const elapsed = Math.floor((input.now.getTime() - input.lastSeenAt.getTime()) / 1000);
    accepted = Math.min(accepted, Math.max(0, elapsed + TIME_PING_TOLERANCE));
  }
  const room = lessonTimeCap(input.plannedMinutes) - Math.max(0, input.alreadySpent);
  return Math.max(0, Math.min(accepted, room));
}
