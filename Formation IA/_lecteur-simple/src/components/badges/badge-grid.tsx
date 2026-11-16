"use client";

/**
 * Grille de tous les badges : obtenus en couleur avec date, à obtenir en gris avec leur condition.
 * Un badge obtenu que ce navigateur n'a encore jamais montré est révélé avec une animation (mémoire locale,
 * simple confort d'affichage : sans stockage, aucune animation spéciale).
 */
import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Lock } from "@phosphor-icons/react";
import { BadgeIcon } from "@/components/badges/badge-icon";
import { celebrate } from "@/components/ui/celebrate";
import { cn } from "@/lib/utils";

export type BadgeCard = { id: string; title: string; description: string; icon: string; category: string; earnedAt: string | null; earnedLabel: string | null };

const SEEN_KEY = "nfia-badges-vus";

function readSeen(): Set<string> | null {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : null;
  } catch {
    return null;
  }
}

export function BadgeGrid({ groups }: { groups: { id: string; title: string; badges: BadgeCard[] }[] }) {
  const reduce = useReducedMotion();
  const [fresh, setFresh] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const earned = groups.flatMap((g) => g.badges.filter((b) => b.earnedAt).map((b) => b.id));
    const seen = readSeen();
    // Première visite : on mémorise sans animer tout le palmarès.
    const newOnes = seen ? earned.filter((id) => !seen.has(id)) : [];
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(earned));
    } catch {
      /* stockage indisponible */
    }
    if (newOnes.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronisation avec le stockage du navigateur
      setFresh(new Set(newOnes));
      void celebrate("small");
    }
  }, [groups]);

  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <section key={g.id} aria-labelledby={`cat-${g.id}`}>
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 id={`cat-${g.id}`} className="text-[15px] text-ink">
              {g.title}
            </h2>
            <p className="num text-[11px] text-ink-3">
              {g.badges.filter((b) => b.earnedAt).length}/{g.badges.length}
            </p>
          </div>
          <ul className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 xl:grid-cols-4">
            {g.badges.map((b, i) => {
              const earned = !!b.earnedAt;
              const isFresh = fresh.has(b.id);
              return (
                <motion.li
                  key={b.id}
                  initial={isFresh ? { opacity: 0, scale: 0.5, rotate: -8 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                  transition={reduce ? { duration: 0 } : isFresh ? { type: "spring", stiffness: 300, damping: 14, delay: 0.3 + i * 0.05 } : { duration: 0.25, delay: i * 0.025 }}
                  className={cn("relative flex min-h-[176px] flex-col border-b border-r border-line p-4 sm:p-5", earned ? "bg-bg-elev" : "bg-bg-sunken/60")}
                >
                  {isFresh ? (
                    <span className="absolute right-3 top-3 bg-accent px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-accent-ink">Nouveau</span>
                  ) : null}
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center",
                      earned ? "bg-accent text-accent-ink" : "border border-dashed border-line-strong text-ink-3",
                    )}
                  >
                    <BadgeIcon name={b.icon} size={24} weight={earned ? "regular" : "light"} />
                  </span>
                  <p className={cn("mt-4 text-[13.5px] font-medium", earned ? "text-ink" : "text-ink-2")}>{b.title}</p>
                  <p className="mt-1 text-[12px] leading-snug text-ink-3">{b.description}</p>
                  <p className="mt-auto pt-3 font-mono text-[9.5px] uppercase tracking-[0.1em] sm:text-[10px] sm:tracking-[0.16em]">
                    {earned ? (
                      <span className="text-accent">Obtenu le {b.earnedLabel}</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-ink-3">
                        <Lock size={11} aria-hidden /> À obtenir
                      </span>
                    )}
                  </p>
                </motion.li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
