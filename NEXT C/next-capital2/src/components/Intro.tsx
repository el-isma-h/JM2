"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BANDES_INTRO } from "@/config/couleurs";

/**
 * Intro de marque : bandes obliques colorées qui se retirent sur le monogramme, puis disparition.
 * Jouée une fois par session (sessionStorage), jamais si mouvement réduit.
 */
export function Intro({ accroche }: { accroche: string }) {
  const reduit = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let deja = true;
    try { deja = sessionStorage.getItem("next_intro") === "1"; } catch { /* stockage indisponible */ }
    if (deja || reduit) return;
    setVisible(true);
    try { sessionStorage.setItem("next_intro", "1"); } catch { /* ignore */ }
    const id = setTimeout(() => setVisible(false), 3400);
    return () => clearTimeout(id);
  }, [reduit]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="fixed inset-0 z-[100] overflow-hidden bg-encre" exit={{ opacity: 0 }} transition={{ duration: 0.6 }} aria-hidden="true">
          <div className="absolute inset-y-[-20%] start-[-10%] flex w-[130%]">
            {BANDES_INTRO.map((c, i) => (
              <motion.div key={c} className="bande h-full flex-1" style={{ background: c }}
                initial={{ y: "-105%" }} animate={{ y: ["-105%", "0%", "0%", "105%"] }}
                transition={{ duration: 2.6, times: [0, 0.3, 0.65, 1], delay: i * 0.07, ease: [0.76, 0, 0.24, 1] }} />
            ))}
          </div>
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-os" initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1, 1] }} transition={{ duration: 2.8, times: [0, 0.55, 0.75, 1] }}>
            <svg width="120" height="120" viewBox="0 0 32 32"><path d="M6 28V4l20 24V4" fill="none" stroke="#F3F0E8" strokeWidth="2.4" strokeLinecap="square" /><rect x="23" y="4" width="3" height="3" fill="#19E07A" /></svg>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-os/60">{accroche}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
