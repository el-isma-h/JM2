"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Fondu doux entre les pages. */
export function TransitionPage({ children }: { children: ReactNode }) {
  const chemin = usePathname();
  const reduit = useReducedMotion();
  return (
    <motion.div key={chemin} initial={reduit ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}>
      {children}
    </motion.div>
  );
}
