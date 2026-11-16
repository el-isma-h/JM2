"use client";

import { motion, useReducedMotion } from "motion/react";

/** Décor filaire : cercles concentriques tracés à l'apparition (à la K8), très fins. */
export function Cercles({ className = "", n = 7, couleur = "currentColor", opacite = 0.22 }: { className?: string; n?: number; couleur?: string; opacite?: number }) {
  const reduit = useReducedMotion();
  return (
    <svg viewBox="0 0 800 800" className={className} aria-hidden="true" style={{ color: couleur, opacity: opacite }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = 60 + i * (340 / n);
        return <motion.circle key={i} cx="400" cy="400" r={r} fill="none" stroke="currentColor" strokeWidth="0.8"
          initial={reduit ? false : { pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 2.2, delay: i * 0.12, ease: [0.165, 0.84, 0.44, 1] }} />;
      })}
    </svg>
  );
}
