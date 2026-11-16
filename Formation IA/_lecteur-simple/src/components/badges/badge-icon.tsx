/**
 * Icône d'un badge (nom phosphor du catalogue domain/badges.ts). Utilisable en composant serveur ET client
 * (import « ssr » de phosphor : pas de contexte React).
 */
import {
  BookOpen,
  Books,
  Brain,
  CalendarCheck,
  Certificate,
  ChatCircleDots,
  Code,
  Crosshair,
  Crown,
  Flame,
  Footprints,
  Key,
  Lightning,
  Medal,
  MoonStars,
  Question,
  Seal,
  SquaresFour,
  SunHorizon,
  Target,
  Trophy,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";

export const BADGE_ICONS: Record<string, Icon> = {
  BookOpen,
  Books,
  Brain,
  CalendarCheck,
  Certificate,
  ChatCircleDots,
  Code,
  Crosshair,
  Crown,
  Flame,
  Footprints,
  Key,
  Lightning,
  Medal,
  MoonStars,
  Question,
  SquaresFour,
  SunHorizon,
  Target,
  Trophy,
};

export function BadgeIcon({ name, size = 22, weight = "light", className }: { name: string; size?: number; weight?: "light" | "regular" | "fill" | "duotone"; className?: string }) {
  const I = BADGE_ICONS[name] ?? Seal;
  return <I size={size} weight={weight} className={className} aria-hidden />;
}
