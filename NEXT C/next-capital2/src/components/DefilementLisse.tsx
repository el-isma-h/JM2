"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const EXCLUS = ["/candidature", "/compte", "/admin", "/connexion"];

/** Défilement lissé (Lenis) sur la vitrine ; désactivé sur les écrans à formulaires et si mouvement réduit. */
export function DefilementLisse() {
  const chemin = usePathname();
  const actif = !EXCLUS.some((x) => chemin.includes(x));
  useEffect(() => {
    if (!actif) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let raf = 0;
    const boucle = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(boucle); };
    raf = requestAnimationFrame(boucle);
    // Ancres : laisser Lenis gérer le défilement vers #id
    const surClic = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const cible = document.querySelector(a.getAttribute("href")!);
      if (cible) { e.preventDefault(); lenis.scrollTo(cible as HTMLElement, { offset: -80 }); }
    };
    document.addEventListener("click", surClic);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("click", surClic); lenis.destroy(); };
  }, [actif]);
  return null;
}
