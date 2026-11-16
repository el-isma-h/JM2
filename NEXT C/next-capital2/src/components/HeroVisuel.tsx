"use client";

import { motion, useReducedMotion } from "motion/react";
import { BANDES_INTRO } from "@/config/couleurs";

/** Pièce graphique du hero : bandes obliques animées, dans le code couleurs NEXT. */
export function HeroVisuel() {
  const reduit = useReducedMotion();
  return (
    <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden lg:h-full lg:min-h-[520px]" aria-hidden="true">
      <div className="absolute inset-y-[-15%] start-[8%] flex w-[110%] gap-[2px]">
        {BANDES_INTRO.map((c, i) => (
          <motion.div key={c} className="bande h-full flex-1" style={{ background: c }}
            initial={reduit ? false : { y: "-100%" }} animate={{ y: "0%" }}
            transition={{ duration: 1.1, delay: 0.1 + i * 0.08, ease: [0.76, 0, 0.24, 1] }} />
        ))}
      </div>
      <motion.div className="absolute bottom-6 start-6 border border-os/20 bg-encre/80 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-os backdrop-blur"
        initial={reduit ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.6 }}>
        NXT · ERC-20 · 1 NXT = 10 €
      </motion.div>
    </div>
  );
}
