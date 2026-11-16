"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { celebrate } from "@/components/ui/celebrate";
import { ScoreRule } from "./score-rule";

/**
 * Score de l'examen : le pourcentage compte jusqu'à sa valeur pendant que la règle se remplit et franchit le cran
 * du seuil. Réussite fraîche (`celebrate`) : confettis une seule fois, puis le paramètre est retiré de l'URL.
 */
export function ResultHero({ percent, passScore, passed, celebrateNow, cleanHref }: { percent: number; passScore: number; passed: boolean; celebrateNow: boolean; cleanHref: string }) {
  const reduce = useReducedMotion();
  const router = useRouter();
  // Valeur initiale identique serveur / client (pas d'écart d'hydratation) ; mouvement réduit : valeur posée sans animation.
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => v.toLocaleString("fr-FR", { minimumFractionDigits: Number.isInteger(percent) ? 0 : 1, maximumFractionDigits: 1 }));
  React.useEffect(() => {
    if (reduce) {
      mv.set(percent);
      return;
    }
    const c = animate(mv, percent, { duration: 1.4, ease: [0.165, 0.84, 0.44, 1] });
    return () => c.stop();
  }, [mv, percent, reduce]);
  const fired = React.useRef(false);
  React.useEffect(() => {
    if (!celebrateNow || !passed || fired.current) return;
    fired.current = true;
    // Les confettis partent quand la règle franchit le seuil ; l'URL est nettoyée ensuite (pas de 2e salve au rechargement).
    setTimeout(() => {
      void celebrate("big");
      router.replace(cleanHref, { scroll: false });
    }, reduce ? 0 : 1100);
  }, [celebrateNow, passed, cleanHref, router, reduce]);

  return (
    <div>
      <p className="flex items-baseline gap-2 font-display font-extralight leading-[0.85] tracking-[-0.02em] text-ink">
        <motion.span className="tabular-nums text-[88px] sm:text-[132px]">{text}</motion.span>
        <span className="text-[36px] font-light text-ink-3 sm:text-[52px]">%</span>
      </p>
      <ScoreRule value={percent} threshold={passScore} size="lg" className="mt-8" label={`Score ${percent} %, seuil ${passScore} %`} />
    </div>
  );
}
