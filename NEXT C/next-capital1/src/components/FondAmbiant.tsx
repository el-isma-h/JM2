"use client";

import { useEffect, useRef } from "react";

/**
 * Fond ambiant : nappes de couleur qui dérivent lentement sur l'encre (canvas 2D, léger).
 * Repli statique si mouvement réduit ou canvas indisponible. Zéro média à charger.
 */
export function FondAmbiant({ couleurs = ["#19E07A", "#00D1FF", "#7A3BFF", "#3FD66B", "#FF5A1F"], intensite = 0.55, className = "" }: { couleurs?: string[]; intensite?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    const t0 = performance.now();
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const redim = () => { w = c.clientWidth; h = c.clientHeight; c.width = Math.round(w * dpr * 0.5); c.height = Math.round(h * dpr * 0.5); };
    redim();
    const ro = new ResizeObserver(redim); ro.observe(c);
    const nappes = couleurs.map((col, i) => ({ col, a: 0.6 + i * 0.37, b: 1.1 + i * 0.23, p: i * 1.7, r: 0.42 + (i % 3) * 0.08 }));
    const dessiner = (now: number) => {
      const t = reduit ? 0 : (now - t0) / 1000;
      const W = c.width, H = c.height;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#0A0B0D"; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (const n of nappes) {
        const x = W * (0.5 + 0.38 * Math.sin(t * 0.07 * n.a + n.p));
        const y = H * (0.5 + 0.34 * Math.cos(t * 0.05 * n.b + n.p * 0.7));
        const r = Math.max(W, H) * n.r;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, n.col + Math.round(intensite * 255 * 0.55).toString(16).padStart(2, "0"));
        g.addColorStop(1, n.col + "00");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      if (!reduit) raf = requestAnimationFrame(dessiner);
    };
    raf = requestAnimationFrame(dessiner);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [couleurs, intensite]);
  return <canvas ref={ref} className={`absolute inset-0 h-full w-full ${className}`} aria-hidden="true" style={{ filter: "blur(40px) saturate(1.1)", transform: "scale(1.15)" }} />;
}
