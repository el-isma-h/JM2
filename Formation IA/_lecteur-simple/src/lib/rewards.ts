/**
 * Récompenses renvoyées par une action qui fait progresser l'apprenant (leçon, quiz…), affichées côté client par
 * `announceRewards()` (src/components/feedback/toaster.tsx). Type sérialisable (server action → client).
 */
import { BADGE_BY_ID } from "@/domain/badges";

export type RewardBadge = { id: string; title: string; description: string; icon: string };
export type Rewards = { xp: number; badges: RewardBadge[] };

export function toRewardBadges(ids: readonly string[]): RewardBadge[] {
  return ids
    .map((id) => BADGE_BY_ID[id])
    .filter(Boolean)
    .map((b) => ({ id: b.id, title: b.title, description: b.description, icon: b.icon }));
}
