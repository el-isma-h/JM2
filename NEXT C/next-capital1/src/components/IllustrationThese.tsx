"use client";

import { motion, useReducedMotion } from "motion/react";
import type { TheseId } from "@/config/fonds";

const EASE = [0.165, 0.84, 0.44, 1] as const;

/** Illustrations filaires par thèse, tracées à l'apparition. Une seule couleur, traits fins. */
export function IllustrationThese({ these, couleur, actif = true, className = "" }: { these: TheseId; couleur: string; actif?: boolean; className?: string }) {
  const reduit = useReducedMotion();
  const anim = (i: number) => ({ initial: reduit ? false : { pathLength: 0, opacity: 0 }, animate: actif ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }, transition: { duration: 1.6, delay: i * 0.06, ease: EASE } });
  const commun = { fill: "none", stroke: couleur, strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };

  let contenu: React.ReactNode;
  if (these === "ia") {
    // Réseau : nœuds reliés
    const pts = [[80, 120], [220, 60], [360, 140], [120, 300], [260, 240], [400, 320], [180, 420], [340, 440]];
    const liens = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 7], [5, 7], [6, 7]];
    contenu = (<>
      {liens.map(([a, b], i) => <motion.line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} {...commun} {...anim(i)} />)}
      {pts.map(([x, y], i) => <motion.circle key={`n${i}`} cx={x} cy={y} r={i % 3 === 0 ? 7 : 4} {...commun} {...anim(liens.length + i)} />)}
    </>);
  } else if (these === "quantique") {
    // Orbitales : ellipses croisées + cercles concentriques
    contenu = (<>
      {[0, 60, 120].map((rot, i) => <motion.ellipse key={i} cx="240" cy="250" rx="200" ry="70" transform={`rotate(${rot} 240 250)`} {...commun} {...anim(i)} />)}
      {[30, 90, 150].map((r, i) => <motion.circle key={`c${i}`} cx="240" cy="250" r={r} {...commun} strokeDasharray={i === 1 ? "3 9" : undefined} {...anim(3 + i)} />)}
      <motion.circle cx="240" cy="250" r="6" fill={couleur} initial={{ scale: 0 }} animate={{ scale: actif ? 1 : 0 }} transition={{ duration: 0.8, delay: 1 }} style={{ transformOrigin: "240px 250px" }} />
    </>);
  } else if (these === "agroalimentaire") {
    // Parcelles : grille en perspective + courbes de croissance
    const lignes = [];
    for (let i = 0; i <= 6; i++) lignes.push(<motion.line key={`h${i}`} x1={40 + i * 10} y1={120 + i * 55} x2={440 - i * 10} y2={120 + i * 55} {...commun} {...anim(i)} />);
    for (let i = 0; i <= 6; i++) lignes.push(<motion.line key={`v${i}`} x1={40 + i * 66.6} y1="120" x2={100 + i * 46.6} y2="450" {...commun} {...anim(7 + i)} />);
    contenu = (<>{lignes}
      <motion.path d="M60 440 C 140 400, 180 300, 240 260 S 360 170, 430 120" {...commun} strokeWidth={1.6} {...anim(14)} />
    </>);
  } else {
    // Sport : arcs de trajectoire + cible
    contenu = (<>
      {[0, 1, 2].map((i) => <motion.path key={i} d={`M40 ${440 - i * 10} Q 240 ${60 + i * 60} 440 ${440 - i * 10}`} {...commun} strokeDasharray={i === 1 ? "4 10" : undefined} {...anim(i)} />)}
      {[18, 40, 62].map((r, i) => <motion.circle key={`t${i}`} cx="440" cy="430" r={r} {...commun} {...anim(3 + i)} />)}
      <motion.circle cx="40" cy="440" r="6" fill={couleur} initial={{ scale: 0 }} animate={{ scale: actif ? 1 : 0 }} transition={{ duration: 0.6, delay: 0.3 }} style={{ transformOrigin: "40px 440px" }} />
    </>);
  }
  return <svg viewBox="0 0 480 500" className={className} aria-hidden="true">{contenu}</svg>;
}
