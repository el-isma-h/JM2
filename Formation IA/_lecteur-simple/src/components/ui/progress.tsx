"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Barre de progression animée (remplissage au montage). `value` entre 0 et `max` (défaut 100).
 * `initial` identique serveur / client (pas d'écart d'hydratation) ; en mouvement réduit, transition instantanée.
 * Ton : accent (défaut), ok, warn. Hauteur fine (4 px) façon NEXT Capital ; `size="lg"` = 8 px.
 */
export function Progress({
  value,
  max = 100,
  tone = "accent",
  size = "sm",
  label,
  className,
}: {
  value: number;
  max?: number;
  tone?: "accent" | "ok" | "warn";
  size?: "sm" | "lg";
  label?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const pct = Math.max(0, Math.min(100, max > 0 ? (value / max) * 100 : 0));
  const color = tone === "ok" ? "bg-ok" : tone === "warn" ? "bg-warn" : "bg-accent";
  return (
    <ProgressPrimitive.Root
      value={value}
      max={max}
      aria-label={label}
      className={cn("relative w-full overflow-hidden bg-bg-muted", size === "lg" ? "h-2" : "h-1", className)}
    >
      <ProgressPrimitive.Indicator asChild>
        <motion.span
          className={cn("block h-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={reduce ? { duration: 0 } : { duration: 0.9, ease: [0.165, 0.84, 0.44, 1] }}
        />
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
}

/** Anneau de progression (objectif du jour, série). */
export function ProgressRing({ value, max = 100, size = 56, stroke = 3, children, className }: { value: number; max?: number; size?: number; stroke?: number; children?: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  return (
    <span className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }} role="img" aria-label={`${Math.round(pct * 100)} %`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-muted)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="butt"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={reduce ? { duration: 0 } : { duration: 1, ease: [0.165, 0.84, 0.44, 1] }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">{children}</span>
    </span>
  );
}
