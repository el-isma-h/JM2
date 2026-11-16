"use client";

/**
 * Chemin vertical sinueux d'un niveau (/parcours/[niveau]). Nœuds carrés (angles droits de la marque) :
 * leçon = carré, quiz de module = losange, examen = grand carré à double filet. Tracé SVG : segment parcouru en
 * encre plein, reste en pointillés. Le nœud actuel pulse et le chemin défile automatiquement jusqu'à lui.
 * États et accès viennent du domaine (buildLevelPath → computeAccess) : ce composant ne décide rien.
 */
import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { BookOpenText, Check, Lock, Question, SealCheck, Star } from "@phosphor-icons/react";
import type { NodeState } from "@/domain/types";
import type { PathNodeKind } from "@/domain/path";
import { Tooltip } from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PathNodeView = {
  key: string;
  kind: PathNodeKind;
  id: string;
  href: string | null;
  state: NodeState;
  offset: number;
  title: string;
  /** Ligne d'info du tooltip (« L045 · 40 min »). */
  meta: string;
  /** Texte court affiché dans le nœud (numéro de leçon). */
  short: string;
  current: boolean;
};

export type PathModuleView = {
  id: string;
  number: string;
  title: string;
  lessonsDone: number;
  lessonsTotal: number;
  duration: string;
  state: NodeState;
  nodes: PathNodeView[];
};

const STEP = 100;
const done = (s: NodeState) => s === "completed" || s === "perfect";

function useWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = React.useRef<T>(null);
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    setW(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export function LevelPath({ modules, exam }: { modules: PathModuleView[]; exam: PathNodeView }) {
  const reduce = useReducedMotion();
  React.useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-path-current]");
    if (!el) return;
    // Si le nœud actuel tient à l'écran avec l'en-tête de son module, on cale cet en-tête sous la barre du haut :
    // centrer le nœud laissait le nœud précédent à moitié caché sous l'en-tête translucide (« triangle noir » sur mobile).
    const section = el.closest("section");
    const t = window.setTimeout(() => {
      const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
      const fits = section && el.getBoundingClientRect().bottom - section.getBoundingClientRect().top < window.innerHeight - 180;
      if (section && fits) section.scrollIntoView({ block: "start", behavior });
      else el.scrollIntoView({ block: "center", behavior });
    }, 350);
    return () => window.clearTimeout(t);
  }, [reduce]);

  return (
    <div className="relative">
      {modules.map((m, mi) => (
        <section key={m.id} aria-labelledby={`mod-${m.id}`} className={cn("scroll-mt-20 lg:scroll-mt-8", mi > 0 && "mt-4")}>
          <ModuleHeader module={m} />
          <Track nodes={m.nodes} />
        </section>
      ))}
      <section aria-label="Examen de fin de niveau" className="mt-4 border-t border-line pt-10 pb-6">
        <div className="flex flex-col items-center">
          <PathNode node={exam} size="exam" index={0} />
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">Examen de certification</p>
          <p className="mt-2 max-w-[34ch] text-center text-[13px] text-ink-2">{exam.title}</p>
        </div>
      </section>
    </div>
  );
}

function ModuleHeader({ module: m }: { module: PathModuleView }) {
  const locked = m.state === "locked";
  return (
    <header className={cn("relative overflow-hidden border-y border-line bg-bg-elev px-5 py-5 sm:px-6", locked && "bg-bg-sunken/60")}>
      <span aria-hidden className="filigrane pointer-events-none absolute -right-2 -bottom-5 text-[104px] text-ink sm:text-[128px]">
        {m.number}
      </span>
      <div className="relative flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">Module {m.number}</span>
        <StatusBadge status={m.state} />
      </div>
      <h2 id={`mod-${m.id}`} className={cn("relative mt-2.5 max-w-[30ch] text-[17px] leading-tight sm:text-[19px]", locked ? "text-ink-2" : "text-ink")}>
        {m.title}
      </h2>
      <p className="num relative mt-2 text-[11px] text-ink-3">
        {m.lessonsDone}/{m.lessonsTotal} leçons · {m.duration}
      </p>
    </header>
  );
}

function Track({ nodes }: { nodes: PathNodeView[] }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const reduce = useReducedMotion();
  const w = width || 358;
  const amp = Math.min(118, Math.max(52, w * 0.24));
  const cx = w / 2;
  const height = nodes.length * STEP + 24;
  const pt = (i: number) => ({ x: cx + nodes[i].offset * amp, y: 12 + i * STEP + STEP / 2 });

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      <svg className="absolute inset-0 overflow-visible" width={w} height={height} aria-hidden>
        {nodes.slice(0, -1).map((n, i) => {
          const a = pt(i);
          const b = pt(i + 1);
          const d = `M ${a.x} ${a.y} C ${a.x} ${a.y + STEP / 2}, ${b.x} ${b.y - STEP / 2}, ${b.x} ${b.y}`;
          const solid = done(n.state);
          return solid ? (
            <motion.path
              key={n.key}
              d={d}
              fill="none"
              stroke="var(--ink)"
              strokeWidth={2}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={reduce ? { duration: 0 } : { duration: 0.5, ease: [0.165, 0.84, 0.44, 1], delay: i * 0.04 }}
            />
          ) : (
            <path key={n.key} d={d} fill="none" stroke="var(--line-strong)" strokeWidth={1.5} strokeDasharray="3 6" />
          );
        })}
      </svg>
      {nodes.map((n, i) => {
        const p = pt(i);
        return (
          <div key={n.key} className="absolute" style={{ left: p.x, top: p.y, transform: "translate(-50%, -50%)" }}>
            <PathNode node={n} size={n.kind === "quiz" ? "quiz" : "lesson"} index={i} />
          </div>
        );
      })}
    </div>
  );
}

function nodeIcon(node: PathNodeView, size: number) {
  if (node.state === "locked") return <Lock size={size} weight="regular" aria-hidden />;
  if (node.state === "perfect") return <Star size={size} weight="fill" aria-hidden />;
  if (node.state === "completed") return node.kind === "exam" ? <SealCheck size={size + 6} weight="fill" aria-hidden /> : <Check size={size} weight="bold" aria-hidden />;
  if (node.kind === "quiz") return <Question size={size + 2} weight="bold" aria-hidden />;
  if (node.kind === "exam") return <SealCheck size={size + 8} weight="light" aria-hidden />;
  if (node.state === "in_progress") return <BookOpenText size={size + 2} weight="regular" aria-hidden />;
  return <span className="num text-[13px] font-medium tracking-tight">{node.short}</span>;
}

const STATE_LABEL: Record<NodeState, string> = { locked: "verrouillé", available: "disponible", in_progress: "en cours", completed: "terminé", perfect: "parfait" };

function PathNode({ node, size, index }: { node: PathNodeView; size: "lesson" | "quiz" | "exam"; index: number }) {
  const reduce = useReducedMotion();
  const locked = node.state === "locked";
  const box = size === "exam" ? 92 : size === "quiz" ? 50 : 62;

  const face = cn(
    "relative flex items-center justify-center transition-[transform,background-color,color,border-color] duration-300",
    size === "quiz" && "rotate-45",
    node.state === "completed" && "border border-ink bg-ink text-bg",
    node.state === "perfect" && "border border-accent bg-accent text-accent-ink",
    node.state === "available" && "border-2 border-accent bg-bg-elev text-accent",
    node.state === "in_progress" && "border-2 border-accent bg-bg-elev text-accent",
    locked && "border border-dashed border-line-strong bg-bg-sunken text-ink-3",
    size === "exam" && !locked && "outline outline-1 outline-offset-[5px] outline-current",
    size === "exam" && locked && "outline outline-1 outline-offset-[5px] outline-line-strong outline-dashed",
    !locked && "group-hover:-translate-y-0.5 group-active:translate-y-0",
  );

  const inner = (
    <span className={face} style={{ width: box, height: box }}>
      {node.state === "in_progress" ? <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-accent-soft" /> : null}
      <span className={cn("relative flex items-center justify-center", size === "quiz" && "-rotate-45")}>{nodeIcon(node, size === "quiz" ? 18 : 20)}</span>
      {node.current ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-[2px] border-2 border-accent opacity-0"
          animate={reduce ? undefined : { scale: [1, 1.32], opacity: [0.55, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      ) : null}
    </span>
  );

  const label = `${node.kind === "lesson" ? `Leçon ${node.id}` : node.kind === "quiz" ? `Quiz du module ${node.id}` : `Examen ${node.id}`} : ${node.title} — ${STATE_LABEL[node.state]}`;
  const tip = (
    <div className="max-w-[240px]">
      <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] opacity-70">{node.meta}</p>
      <p className="mt-1 text-[12.5px] leading-snug">{node.title}</p>
      {locked ? <p className="mt-1.5 text-[11px] opacity-70">{node.kind === "lesson" ? "Terminez l'étape précédente pour l'ouvrir." : node.kind === "quiz" ? "Terminez toutes les leçons du module." : "Réussissez tous les quiz du niveau."}</p> : null}
    </div>
  );

  const cta = node.current ? (node.kind === "quiz" ? "Quiz" : node.kind === "exam" ? "Examen" : node.state === "in_progress" ? "Reprendre" : "Commencer") : null;

  // Étiquette du nœud actuel : sur le côté libre (opposé à la courbe), pour ne jamais chevaucher les voisins.
  const side: "left" | "right" = node.offset > 0.1 ? "left" : "right";
  const gap = size === "quiz" ? 22 : size === "exam" ? 20 : 14;
  const content = (
    <span className="relative flex items-center justify-center">
      {cta ? (
        <motion.span
          aria-hidden
          className={cn("absolute top-1/2 whitespace-nowrap bg-ink px-2.5 py-1.5 font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.2em] text-bg", side === "left" ? "right-full" : "left-full")}
          style={side === "left" ? { marginRight: gap, translateY: "-50%" } : { marginLeft: gap, translateY: "-50%" }}
          animate={reduce ? undefined : { x: side === "left" ? [0, -3, 0] : [0, 3, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {cta}
          <span className={cn("absolute top-1/2 h-0 w-0 -translate-y-1/2 border-y-[5px] border-y-transparent", side === "left" ? "left-full border-l-[5px] border-l-ink" : "right-full border-r-[5px] border-r-ink")} />
        </motion.span>
      ) : null}
      {inner}
    </span>
  );

  const appear = {
    // `initial` identique serveur / client (pas d'écart d'hydratation) ; mouvement réduit : transition instantanée.
    initial: { opacity: 0, scale: 0.6 } as const,
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-30px" },
    transition: reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 420, damping: 24, delay: Math.min(index, 8) * 0.035 },
  };

  return (
    <motion.div {...appear} {...(node.current ? { "data-path-current": "" } : {})}>
      <Tooltip content={tip} side={node.offset > 0.3 ? "left" : "right"}>
        {node.href && !locked ? (
          <Link href={node.href} aria-label={label} className="group block focus-visible:outline-offset-8">
            {content}
          </Link>
        ) : (
          <button type="button" aria-disabled="true" aria-label={label} className="group block cursor-not-allowed focus-visible:outline-offset-8">
            {content}
          </button>
        )}
      </Tooltip>
    </motion.div>
  );
}
