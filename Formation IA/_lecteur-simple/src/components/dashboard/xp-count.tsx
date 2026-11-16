"use client";

/**
 * Total d'XP qui compte jusqu'à sa valeur. La valeur finale est rendue côté serveur ET client (pas d'écart
 * d'hydratation, même en mouvement réduit) ; le comptage est joué au montage en écrivant directement dans le DOM.
 */
import * as React from "react";
import { animate, useReducedMotion } from "motion/react";
import { formatNumber } from "@/lib/utils";

export function XpCount({ value }: { value: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduce || value <= 0) return;
    const controls = animate(0, value, {
      duration: 0.7,
      ease: [0.165, 0.84, 0.44, 1],
      onUpdate: (v) => {
        el.textContent = formatNumber(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, reduce]);
  return (
    <span ref={ref} className="num">
      {formatNumber(value)}
    </span>
  );
}
