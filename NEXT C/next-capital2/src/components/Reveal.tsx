"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Révélation à l'entrée dans la fenêtre. Repli : le contenu est affiché après 2,5 s
 * même sans détection de visibilité (captures pleine page, navigateurs sans IntersectionObserver).
 */
export function Reveal({ children, delai = 0, className, y = 24, style }: { children: ReactNode; delai?: number; className?: string; y?: number; style?: CSSProperties }) {
  const reduit = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const enVue = useInView(ref, { once: true, margin: "-60px" });
  const [force, setForce] = useState(false);
  useEffect(() => { const id = setTimeout(() => setForce(true), 2500); return () => clearTimeout(id); }, []);
  const visible = reduit || enVue || force;
  return (
    <motion.div ref={ref} className={className} style={style} initial={reduit ? false : { opacity: 0, y }} animate={visible ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.7, delay: delai, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
