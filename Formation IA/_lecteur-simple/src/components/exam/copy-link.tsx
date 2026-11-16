"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, LinkSimple } from "@phosphor-icons/react";

/** Copie le lien public de vérification (à joindre à un CV, un profil LinkedIn…). */
export function CopyLink({ url }: { url: string }) {
  const [done, setDone] = React.useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          window.prompt("Lien de vérification", url);
        }
      }}
      className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={done ? "ok" : "copy"} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.15 }} className="inline-flex items-center gap-1.5">
          {done ? <Check size={13} className="text-ok-ink" aria-hidden /> : <LinkSimple size={13} aria-hidden />}
          {done ? "Lien copié" : "Copier le lien de vérification"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
