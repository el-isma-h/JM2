"use client";

/**
 * Outils de lecture d'une leçon : barre de progression de lecture (haut de l'écran), sommaire collant des h2 avec
 * suivi de la section courante, et mesure du temps passé (ping /api/time toutes les 30 s d'onglet visible).
 */
import * as React from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { routes, withBase } from "@/lib/paths";
import { cn, formatSeconds } from "@/lib/utils";
import { cleanHeading } from "@/lib/lesson-text";

export const ARTICLE_ID = "lecon-contenu";

/** Article de la leçon + barre fine de progression de lecture calée sur lui (pas sur toute la page). */
export function ReadingArticle({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80px", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
  const scaleX = useTransform(reduce ? scrollYProgress : smooth, (v) => Math.max(0, Math.min(1, v)));
  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] lg:left-[248px]" aria-hidden>
        <motion.div className="h-full origin-left bg-accent" style={{ scaleX }} />
      </div>
      <article id={ARTICLE_ID} ref={ref} className="relative">
        {children}
      </article>
    </>
  );
}

export type TocItem = { id: string; text: string };


function useActiveHeading(ids: string[]): string | null {
  const [active, setActive] = React.useState<string | null>(ids[0] ?? null);
  React.useEffect(() => {
    if (ids.length === 0) return;
    const onScroll = () => {
      let current: string | null = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);
  return active;
}

export function TableOfContents({ items, variant }: { items: TocItem[]; variant: "aside" | "inline" }) {
  const ids = React.useMemo(() => items.map((i) => i.id), [items]);
  const active = useActiveHeading(ids);
  const reduce = useReducedMotion();
  if (items.length === 0) return null;
  const list = (
    <ol className="space-y-0.5">
      {items.map((it, i) => {
        const on = active === it.id;
        return (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              aria-current={on ? "location" : undefined}
              onClick={(e) => {
                const el = document.getElementById(it.id);
                if (!el) return;
                e.preventDefault();
                el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
                history.replaceState(null, "", `#${it.id}`);
              }}
              className={cn("relative flex gap-3 py-1.5 pl-4 text-[12.5px] leading-snug transition-colors duration-300", on ? "text-ink" : "text-ink-3 hover:text-ink-2")}
            >
              {on && variant === "aside" ? <motion.span layoutId="toc-signal" className="absolute inset-y-1 left-0 w-[2px] bg-accent" transition={{ type: "spring", stiffness: 500, damping: 40 }} /> : null}
              <span className="num w-4 shrink-0 text-[10.5px] text-ink-3">{i + 1}</span>
              <span>{cleanHeading(it.text)}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
  if (variant === "inline") {
    return (
      <details className="group border border-line bg-bg-elev lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2">
          Sommaire · {items.length} sections
          <span aria-hidden className="text-[14px] transition-transform group-open:rotate-45">+</span>
        </summary>
        <nav aria-label="Sommaire de la leçon" className="border-t border-line px-1 py-2">
          {list}
        </nav>
      </details>
    );
  }
  return (
    <nav aria-label="Sommaire de la leçon" className="border-l border-line">
      <p className="mb-2 pl-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">Sommaire</p>
      {list}
    </nav>
  );
}

/**
 * Mesure du temps passé : 1 ping « ouverture » (0 s) puis un ping de 30 s par tranche de 30 s d'onglet visible.
 * Le reliquat (< 30 s) est envoyé en quittant la page (sendBeacon). Affiche le cumul, plafonné comme côté serveur.
 */
export function TimeTracker({ lessonId, initialSeconds, capSeconds }: { lessonId: string; initialSeconds: number; capSeconds: number }) {
  const [total, setTotal] = React.useState(initialSeconds);
  React.useEffect(() => {
    const url = withBase(routes.api.time);
    let pending = 0;
    const send = (seconds: number) =>
      fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ lessonId, seconds }), keepalive: true })
        .then((r) => (r.ok ? r.json() : null))
        .then((j: { total?: number } | null) => {
          if (j && typeof j.total === "number") setTotal(j.total);
        })
        .catch(() => {});
    void send(0);
    const tick = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      pending++;
      setTotal((t) => Math.min(capSeconds, Math.max(t, t + 1)));
      if (pending >= 30) {
        pending = 0;
        void send(30);
      }
    }, 1000);
    const flush = () => {
      if (pending > 0 && navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([JSON.stringify({ lessonId, seconds: pending })], { type: "application/json" }));
        pending = 0;
      }
    };
    const onVis = () => document.visibilityState === "hidden" && flush();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", flush);
    return () => {
      window.clearInterval(tick);
      flush();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", flush);
    };
  }, [lessonId, capSeconds]);
  return (
    <span className="num" title="Temps comptabilisé pour cette leçon (plafonné à 1,5 × la durée prévue)">
      {formatSeconds(Math.min(total, capSeconds))}
    </span>
  );
}
