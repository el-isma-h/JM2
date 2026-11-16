"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import * as React from "react";

/*
 * Mouvement réduit sans écart d'hydratation : le rendu serveur ignore `prefers-reduced-motion` alors que
 * `useReducedMotion()` le lit dès le premier rendu client. On garde donc un `initial` identique des deux côtés
 * (seule la `transition`, absente du HTML, dépend de la préférence) et, pour un rendu qui en dépend (texte, style),
 * `useReducedMotionSafe()` renvoie false pendant l'hydratation puis la vraie valeur.
 */
const noopSubscribe = () => () => {};
export function useReducedMotionSafe(): boolean {
  const reduce = useReducedMotion();
  const hydrated = React.useSyncExternalStore(noopSubscribe, () => true, () => false);
  return hydrated && !!reduce;
}

const INSTANT = { duration: 0 } as const;

/** Entrée douce d'un bloc de page (hiérarchie : le contenu principal arrive, puis le secondaire). */
export function FadeIn({ delay = 0, children, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? INSTANT : { duration: 0.28, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Liste dont les lignes apparaissent en cascade courte (feedback de chargement de données). */
export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.04 } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0, transition: reduce ? INSTANT : { duration: 0.22 } } }}>
      {children}
    </motion.div>
  );
}

/** Nombre qui compte jusqu'à sa valeur (dashboard) : feedback de mise à jour. */
export function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const reduce = useReducedMotion();
  const reduceSafe = useReducedMotionSafe();
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const dur = 600;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (value - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduce]);
  return <span className="num">{format(reduceSafe ? value : display)}</span>;
}

/** Apparition « pop » (réussite, badge obtenu, nœud débloqué). */
export function Pop({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={reduce ? INSTANT : { type: "spring", stiffness: 380, damping: 22, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Pulsation douce (nœud « disponible » / « en cours » du chemin). */
export function Pulse({ children, className, active = true }: { children: React.ReactNode; className?: string; active?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      animate={active && !reduce ? { scale: [1, 1.05, 1] } : undefined}
      transition={active && !reduce ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      {children}
    </motion.div>
  );
}
