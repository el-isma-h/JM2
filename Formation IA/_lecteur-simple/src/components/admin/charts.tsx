"use client";

/**
 * Graphiques sobres en SVG maison (identité Next Formation : filets 1 px, un seul accent, chiffres mono).
 * - ActivityChart : minutes de formation par jour (barres) + apprenants actifs (points reliés) sur 30 jours ;
 * - LevelBar : répartition des apprenants par niveau en cours (barre segmentée) ;
 * - Heatmap : activité jour par jour d'un apprenant (calendrier de semaines).
 */
import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.165, 0.84, 0.44, 1] as const;

function dayLabel(day: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) {
  return new Intl.DateTimeFormat("fr-FR", { ...opts, timeZone: "UTC" }).format(new Date(`${day}T12:00:00Z`));
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((m) => m >= v)!;
}

export function ActivityChart({ data }: { data: { day: string; active: number; seconds: number }[] }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = React.useState<number | null>(null);
  const W = 720;
  const H = 220;
  const pad = { l: 36, r: 36, t: 14, b: 26 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const mins = data.map((d) => d.seconds / 60);
  const maxMin = niceMax(Math.max(...mins, 1));
  const maxAct = niceMax(Math.max(...data.map((d) => d.active), 1));
  const bw = iw / data.length;
  const y = (v: number, max: number) => pad.t + ih - (v / max) * ih;
  const line = data.map((d, i) => `${i ? "L" : "M"}${pad.l + i * bw + bw / 2},${y(d.active, maxAct)}`).join(" ");
  const h = hover !== null ? data[hover] : null;
  const totals = { minutes: Math.round(mins.reduce((s, m) => s + m, 0)), peak: Math.max(...data.map((d) => d.active)) };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px] text-ink-2">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 bg-accent/70" aria-hidden /> Minutes de formation
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-px w-4 bg-ink" aria-hidden />
          <span className="-ml-3 h-1.5 w-1.5 border border-ink bg-bg" aria-hidden /> Apprenants actifs
        </span>
        <span className="ml-auto min-h-[18px] text-ink">
          {h ? (
            <>
              <span className="text-ink-3">{dayLabel(h.day, { weekday: "short", day: "numeric", month: "short" })}</span> · <span className="num">{Math.round(h.seconds / 60)}</span> min ·{" "}
              <span className="num">{h.active}</span> actif{h.active > 1 ? "s" : ""}
            </>
          ) : (
            <span className="text-ink-3">
              <span className="num text-ink">{totals.minutes}</span> min sur 30 jours · pic à <span className="num text-ink">{totals.peak}</span> actif{totals.peak > 1 ? "s" : ""}
            </span>
          )}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Activité des 30 derniers jours : minutes de formation et apprenants actifs par jour" onMouseLeave={() => setHover(null)}>
        {[0, 0.5, 1].map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={pad.t + ih * (1 - t)} y2={pad.t + ih * (1 - t)} stroke="var(--line)" strokeDasharray={t === 0 ? undefined : "2 4"} />
            <text x={pad.l - 8} y={pad.t + ih * (1 - t) + 3} textAnchor="end" className="fill-ink-3 font-mono text-[9px]">
              {Math.round(maxMin * t)}
            </text>
            <text x={W - pad.r + 8} y={pad.t + ih * (1 - t) + 3} className="fill-ink-3 font-mono text-[9px]">
              {Math.round(maxAct * t * 10) / 10}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const v = d.seconds / 60;
          const bh = (v / maxMin) * ih;
          return (
            <g key={d.day} onMouseEnter={() => setHover(i)}>
              <rect x={pad.l + i * bw} y={pad.t} width={bw} height={ih} fill="transparent" />
              <motion.rect
                x={pad.l + i * bw + bw * 0.18}
                width={bw * 0.64}
                fill="var(--accent)"
                fillOpacity={hover === i ? 0.95 : 0.55}
                initial={{ height: 0, y: pad.t + ih }}
                animate={{ height: bh, y: pad.t + ih - bh }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: i * 0.012 }}
              />
              {i % 5 === 4 || i === 0 ? (
                <text x={pad.l + i * bw + bw / 2} y={H - 8} textAnchor="middle" className="fill-ink-3 font-mono text-[9px]">
                  {dayLabel(d.day)}
                </text>
              ) : null}
            </g>
          );
        })}
        <motion.path d={line} fill="none" stroke="var(--ink)" strokeWidth={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE, delay: 0.2 }} pointerEvents="none" />
        {data.map((d, i) => (
          <rect
            key={d.day}
            x={pad.l + i * bw + bw / 2 - (hover === i ? 3.5 : 2.5)}
            y={y(d.active, maxAct) - (hover === i ? 3.5 : 2.5)}
            width={hover === i ? 7 : 5}
            height={hover === i ? 7 : 5}
            fill="var(--bg-elev)"
            stroke="var(--ink)"
            pointerEvents="none"
          />
        ))}
      </svg>
    </div>
  );
}

export function LevelBar({ data, titles }: { data: { levelId: string; learners: number }[]; titles: Record<string, string> }) {
  const reduce = useReducedMotion();
  const total = data.reduce((s, d) => s + d.learners, 0);
  const shades = ["var(--accent)", "color-mix(in srgb, var(--accent) 70%, var(--bg))", "color-mix(in srgb, var(--accent) 45%, var(--bg))", "color-mix(in srgb, var(--accent) 25%, var(--bg))"];
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden bg-bg-muted" role="img" aria-label={data.map((d) => `${d.levelId} : ${d.learners}`).join(", ")}>
        {total
          ? data.map((d, i) =>
              d.learners ? (
                <motion.span
                  key={d.levelId}
                  className="block h-full border-r border-bg-elev last:border-r-0"
                  style={{ background: shades[i % shades.length] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(d.learners / total) * 100}%` }}
                  transition={reduce ? { duration: 0 } : { duration: 0.8, ease: EASE, delay: i * 0.08 }}
                />
              ) : null,
            )
          : null}
      </div>
      <ul className="mt-5 divide-y divide-line">
        {data.map((d, i) => (
          <li key={d.levelId} className="flex items-center gap-3 py-2.5">
            <span className="h-2.5 w-2.5 shrink-0" style={{ background: shades[i % shades.length] }} aria-hidden />
            <span className="num w-6 shrink-0 text-[12px] text-ink">{d.levelId}</span>
            <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink-2" title={titles[d.levelId]}>
              {titles[d.levelId]}
            </span>
            <span className="num text-[15px] text-ink">{d.learners}</span>
            <span className="num w-10 text-right text-[11.5px] text-ink-3">{total ? `${Math.round((d.learners / total) * 100)} %` : "—"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Calendrier d'activité : une colonne par semaine (lundi en haut), intensité = minutes de formation. */
export function Heatmap({ days, today, weeks = 26 }: { days: { day: string; seconds: number; events: number }[]; today: string; weeks?: number }) {
  const reduce = useReducedMotion();
  const by = new Map(days.map((d) => [d.day, d]));
  const end = new Date(`${today}T12:00:00Z`);
  const dow = (end.getUTCDay() + 6) % 7; // 0 = lundi
  const start = new Date(end.getTime() - (dow + (weeks - 1) * 7) * 86_400_000);
  const cells: { day: string; seconds: number; events: number; future: boolean }[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start.getTime() + i * 86_400_000).toISOString().slice(0, 10);
    const v = by.get(d);
    cells.push({ day: d, seconds: v?.seconds ?? 0, events: v?.events ?? 0, future: d > today });
  }
  const level = (c: (typeof cells)[number]) => (c.future ? -1 : c.seconds >= 3600 ? 4 : c.seconds >= 1800 ? 3 : c.seconds >= 600 ? 2 : c.seconds > 0 || c.events > 0 ? 1 : 0);
  const fills = ["var(--bg-muted)", "color-mix(in srgb, var(--accent) 22%, var(--bg-muted))", "color-mix(in srgb, var(--accent) 45%, var(--bg-muted))", "color-mix(in srgb, var(--accent) 72%, var(--bg-muted))", "var(--accent)"];
  const [hover, setHover] = React.useState<(typeof cells)[number] | null>(null);
  const activeDays = cells.filter((c) => !c.future && (c.seconds > 0 || c.events > 0)).length;

  return (
    <div>
      <div className="overflow-x-auto pb-1 scrollbar-thin">
        <div className="grid w-max grid-flow-col grid-rows-7 gap-[3px] sm:gap-1" onMouseLeave={() => setHover(null)} role="img" aria-label={`${activeDays} jours d'activité sur ${weeks} semaines`}>
          {cells.map((c, i) => (
            <motion.span
              key={c.day}
              className={cn("block h-[11px] w-[11px] sm:h-4 sm:w-4", c.day === today && "outline outline-1 outline-offset-1 outline-ink")}
              style={{ background: level(c) < 0 ? "transparent" : fills[level(c)] }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={reduce ? { duration: 0 } : { duration: 0.25, delay: Math.floor(i / 7) * 0.025 }}
              onMouseEnter={() => setHover(c)}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-ink-3">
        <span className="min-h-[18px] text-ink-2">
          {hover && !hover.future ? (
            <>
              {dayLabel(hover.day, { weekday: "long", day: "numeric", month: "long" })} · <span className="num text-ink">{Math.round(hover.seconds / 60)}</span> min
            </>
          ) : (
            <>
              <span className="num text-ink">{activeDays}</span> jours actifs sur {weeks} semaines
            </>
          )}
        </span>
        <span className="inline-flex items-center gap-1.5">
          Moins
          {fills.map((f) => (
            <span key={f} className="block h-[10px] w-[10px]" style={{ background: f }} />
          ))}
          Plus
        </span>
      </div>
    </div>
  );
}
