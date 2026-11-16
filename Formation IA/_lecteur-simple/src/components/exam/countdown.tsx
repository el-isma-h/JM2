"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/**
 * Compte à rebours jusqu'à une date (prochaine tentative). `serverNow` cale l'horloge ; à zéro, la page se rafraîchit.
 */
export function Countdown({ target, serverNow }: { target: string; serverNow: string }) {
  const router = useRouter();
  const offset = React.useRef<number | null>(null);
  const [now, setNow] = React.useState(() => new Date(serverNow).getTime());
  React.useEffect(() => {
    offset.current = new Date(serverNow).getTime() - Date.now();
    const id = setInterval(() => setNow(Date.now() + (offset.current ?? 0)), 1000);
    return () => clearInterval(id);
  }, [serverNow]);
  const left = new Date(target).getTime() - now;
  const done = left <= 0;
  React.useEffect(() => {
    if (done) router.refresh();
  }, [done, router]);
  const p = parts(left);
  const cells = [
    { v: p.d, u: "jours" },
    { v: p.h, u: "heures" },
    { v: p.m, u: "minutes" },
    { v: p.s, u: "secondes" },
  ];
  return (
    <div className="grid grid-cols-4 border border-line" role="timer" aria-live="off">
      {cells.map((c, i) => (
        <div key={c.u} className={i ? "border-l border-line px-2 py-3 text-center" : "px-2 py-3 text-center"}>
          <div className="font-display tabular-nums text-[26px] font-light leading-none text-ink">{String(c.v).padStart(2, "0")}</div>
          <div className="mt-1.5 text-[11px] text-ink-3">{c.u}</div>
        </div>
      ))}
    </div>
  );
}
