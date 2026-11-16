"use client";

/**
 * Confettis aux couleurs de la marque (réussite de quiz / examen, badge obtenu).
 * Respecte prefers-reduced-motion. Import dynamique : canvas-confetti n'est chargé qu'au premier appel.
 *
 *   import { celebrate } from "@/components/ui/celebrate";
 *   celebrate();            // salve standard
 *   celebrate("big");       // examen réussi
 */
const COLORS = ["#4b2a7f", "#c9b8f0", "#f3f0e8", "#0fb862", "#8e8b83"];

export async function celebrate(kind: "small" | "big" = "small"): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const confetti = (await import("canvas-confetti")).default;
  const base = { colors: COLORS, disableForReducedMotion: true, shapes: ["square" as const], scalar: 0.9 };
  if (kind === "small") {
    confetti({ ...base, particleCount: 80, spread: 70, origin: { y: 0.7 } });
    return;
  }
  const end = Date.now() + 900;
  const frame = () => {
    confetti({ ...base, particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.75 } });
    confetti({ ...base, particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.75 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
