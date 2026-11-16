"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValueEvent, useScroll, useReducedMotion } from "motion/react";
import { IllustrationThese } from "./IllustrationThese";
import type { TheseId } from "@/config/fonds";

export interface PanneauThese {
  id: TheseId; couleur: string; fond: string; numero: string; accroche: string; nom: string; texte: string; points: string[];
  stats: [string, string][]; href: string;
}

const EASE = [0.165, 0.84, 0.44, 1] as const;

/**
 * Section épinglée (à la K8) : les panneaux se superposent pendant le défilement,
 * le fond glisse vers la teinte de chaque thèse, l'illustration se trace.
 * Sur mobile ou mouvement réduit : empilement simple.
 */
export function ThesesEpinglees({ panneaux, libelles }: { panneaux: PanneauThese[]; libelles: { allocation: string; decouvrir: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduit = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  const [actif, setActif] = useState(0);
  useEffect(() => { const m = window.matchMedia("(max-width: 1023px)"); const f = () => setMobile(m.matches); f(); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => { const i = Math.min(panneaux.length - 1, Math.floor(v * panneaux.length)); if (i !== actif) setActif(i); });

  if (mobile || reduit) {
    return (
      <div>
        {panneaux.map((p) => (
          <section key={p.id} className="border-t border-os/10 text-os" style={{ background: p.fond }}>
            <div className="conteneur py-16">
              <Panneau p={p} libelles={libelles} visible />
            </div>
          </section>
        ))}
      </div>
    );
  }

  const p = panneaux[actif];
  return (
    <div ref={ref} style={{ height: `${panneaux.length * 100}vh` }}>
      <motion.div className="sticky top-0 h-screen overflow-hidden pt-16 text-os" animate={{ backgroundColor: p.fond }} transition={{ duration: 0.8, ease: EASE }}>
        <div className="conteneur relative h-[calc(100vh-4rem)] w-full">
          {/* indicateur de progression */}
          <div className="absolute end-0 top-1/2 hidden -translate-y-1/2 flex-col gap-3 lg:flex" aria-hidden="true">
            {panneaux.map((x, i) => <span key={x.id} className="block h-10 w-px transition-colors duration-500" style={{ background: i === actif ? x.couleur : "rgba(243,240,232,.2)" }} />)}
          </div>
          {panneaux.map((x, i) => (
            <motion.div key={x.id} className="absolute inset-x-0" initial={false} animate={{ opacity: i === actif ? 1 : 0, y: i === actif ? "-50%" : i < actif ? "-56%" : "-44%" }} transition={{ duration: 0.7, ease: EASE }} style={{ top: "50%", pointerEvents: i === actif ? "auto" : "none" }} aria-hidden={i !== actif}>
              <Panneau p={x} libelles={libelles} visible={i === actif} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function Panneau({ p, libelles, visible }: { p: PanneauThese; libelles: { allocation: string; decouvrir: string }; visible: boolean }) {
  return (
    <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-os/50">{p.numero} — {p.accroche}</p>
        <h3 className="mt-6 break-words font-display text-[8.5vw] font-light uppercase leading-none tracking-[0.06em] sm:text-6xl lg:text-7xl">{p.nom}</h3>
        <p className="mt-6 font-serif text-xl italic sm:text-2xl" style={{ color: p.couleur }}>{p.points.join(" · ")}</p>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-os/70 sm:text-base">{p.texte}</p>
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 font-mono text-[10px] uppercase tracking-[0.2em]">
          {p.stats.map(([l, v]) => <div key={l}><dt className="text-os/40">{l}</dt><dd className="mt-1 text-os">{v}</dd></div>)}
        </dl>
        <Link href={p.href} className="bouton-contour mt-8">{libelles.decouvrir}</Link>
      </div>
      <div className="mx-auto w-full max-w-[420px]"><IllustrationThese these={p.id} couleur={p.couleur} actif={visible} className="h-auto w-full" /></div>
    </div>
  );
}
