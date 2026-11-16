"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Règle graduée 0–100 avec le cran du seuil de réussite : signature visuelle des examens
 * (score global en grand, score par compétence en petit). Remplissage animé au montage.
 */
export function ScoreRule({
  value,
  threshold = 70,
  size = "sm",
  label,
  delay = 0,
  className,
}: {
  value: number;
  threshold?: number;
  size?: "sm" | "lg";
  label?: string;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const pct = Math.max(0, Math.min(100, value));
  const passed = pct >= threshold;
  const lg = size === "lg";
  return (
    <div className={cn("relative w-full", lg ? "pb-6" : "", className)} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={label}>
      <div className={cn("relative w-full border border-line-strong bg-bg-sunken", lg ? "h-4" : "h-2")}>
        <motion.div
          className={cn("absolute inset-y-0 left-0", passed ? "bg-accent" : "bg-ink-3")}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={reduce ? { duration: 0 } : { duration: lg ? 1.4 : 0.8, ease: [0.165, 0.84, 0.44, 1], delay }}
        />
        {/* Cran du seuil */}
        <span aria-hidden className={cn("absolute bg-ink", lg ? "-inset-y-2 w-px" : "-inset-y-1 w-px")} style={{ left: `${threshold}%` }} />
      </div>
      {lg ? (
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-5">
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${i * 10}%` }}>
              <span className={cn("w-px bg-line-strong", i % 5 === 0 ? "h-2" : "h-1")} />
              {i % 5 === 0 ? <span className="num mt-0.5 text-[10px] text-ink-3">{i * 10}</span> : null}
            </span>
          ))}
          <span className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${threshold}%` }}>
            <span className="h-2 w-px bg-ink" />
            <span className="num mt-0.5 bg-bg px-1 text-[10px] font-medium text-ink">seuil {threshold}</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}
