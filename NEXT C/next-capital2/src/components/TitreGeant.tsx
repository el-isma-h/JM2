"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Titre géant révélé ligne par ligne (masque). Repli : affiché après 2,5 s même sans détection de visibilité. */
export function TitreGeant({ lignes, className = "", couleur, niveau = "h2" }: { lignes: string[]; className?: string; couleur?: string; niveau?: "h1" | "h2" }) {
  const reduit = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const enVue = useInView(ref, { once: true, margin: "-10%" });
  const [force, setForce] = useState(false);
  useEffect(() => { const id = setTimeout(() => setForce(true), 2500); return () => clearTimeout(id); }, []);
  const visible = reduit || enVue || force;
  const Balise = niveau;
  return (
    <Balise ref={ref} className={`titre-geant ${className}`} style={couleur ? { color: couleur } : undefined}>
      {lignes.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span className="block" initial={reduit ? false : { y: "110%" }} animate={visible ? { y: 0 } : undefined} transition={{ duration: 0.9, delay: i * 0.08, ease: [0.76, 0, 0.24, 1] }}>{l}</motion.span>
        </span>
      ))}
    </Balise>
  );
}
