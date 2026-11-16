"use client";

/** Flamme de la série : vacille quand la série est active aujourd'hui, braise grise sinon. */
import { motion, useReducedMotion } from "motion/react";
import { Flame } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function StreakFlame({ days, activeToday, size = 44 }: { days: number; activeToday: boolean; size?: number }) {
  const reduce = useReducedMotion();
  const lit = days > 0;
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} aria-hidden>
      {lit && activeToday ? (
        <motion.span
          className="absolute inset-x-[22%] bottom-[8%] top-[30%] bg-warn/30 blur-md"
          animate={reduce ? undefined : { opacity: [0.5, 0.9, 0.6], scaleY: [1, 1.15, 0.95] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
      <motion.span
        className={cn("relative", lit ? (activeToday ? "text-warn" : "text-warn/60") : "text-ink-3")}
        style={{ transformOrigin: "50% 90%" }}
        animate={lit && activeToday && !reduce ? { rotate: [-3, 3, -2, 2, -3], scaleY: [1, 1.06, 0.98, 1.04, 1] } : undefined}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Flame size={size} weight={lit ? "fill" : "light"} />
      </motion.span>
    </span>
  );
}
