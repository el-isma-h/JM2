"use client";

import * as React from "react";
import { Desktop, Moon, Sun } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/**
 * Thème clair / sombre / système. Préférence dans localStorage (`nfia-theme`), appliquée avant hydratation par
 * THEME_SCRIPT (layout racine) pour éviter tout flash. La classe `.dark` sur <html> active les tokens sombres.
 */
export type ThemePref = "light" | "dark" | "system";
export const THEME_STORAGE_KEY = "nfia-theme";

export const THEME_SCRIPT = `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}")||"system";var d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

function apply(pref: ThemePref) {
  const dark = pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/** Préférence de thème (synchronisée entre composants et onglets) et son setter. */
export function useTheme(): [ThemePref, (p: ThemePref) => void] {
  const pref = React.useSyncExternalStore<ThemePref>(subscribe, readPref, () => "system");
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => readPref() === "system" && apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const update = React.useCallback((p: ThemePref) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, p);
    } catch {
      /* stockage indisponible : thème appliqué pour la session seulement */
    }
    apply(p);
    listeners.forEach((l) => l());
  }, []);
  return [pref, update];
}

const ORDER: ThemePref[] = ["light", "dark", "system"];
const LABELS: Record<ThemePref, string> = { light: "Thème clair", dark: "Thème sombre", system: "Thème du système" };
const SHORT: Record<ThemePref, string> = { light: "Clair", dark: "Sombre", system: "Auto" };

/** Bouton compact qui fait défiler clair → sombre → système. */
export function ThemeToggle({ className, withLabel = false }: { className?: string; withLabel?: boolean }) {
  const [pref, setPref] = useTheme();
  const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
  const Icon = pref === "light" ? Sun : pref === "dark" ? Moon : Desktop;
  return (
    <button
      type="button"
      onClick={() => setPref(next)}
      className={cn(
        "inline-flex h-9 items-center gap-2 border border-transparent px-2 text-ink-2 transition-colors duration-300 hover:border-line-strong hover:text-ink",
        className,
      )}
      aria-label={`${LABELS[pref]} — passer au ${LABELS[next].toLowerCase()}`}
      title={LABELS[pref]}
    >
      <Icon size={16} />
      {withLabel ? <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em]">{SHORT[pref]}</span> : null}
    </button>
  );
}
