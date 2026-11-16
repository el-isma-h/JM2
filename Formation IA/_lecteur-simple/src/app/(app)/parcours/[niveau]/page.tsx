import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";
import { requireUser } from "@/server/auth";
import { loadAccess } from "@/server/learner";
import { getLevel, getLevels } from "@/content";
import { buildLevelPath, levelPercent, nodeKey, type PathNode } from "@/domain/path";
import { levelIdFromParam, routes } from "@/lib/paths";
import { formatMinutes } from "@/lib/utils";
import { PageHeader, Notice } from "@/components/ui/surface";
import { StatusBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LevelPath, type PathModuleView, type PathNodeView } from "@/components/parcours/level-path";

export async function generateMetadata({ params }: { params: Promise<{ niveau: string }> }): Promise<Metadata> {
  const { niveau } = await params;
  const id = levelIdFromParam(niveau);
  const level = id ? getLevel(id) : null;
  return { title: level ? `Chemin — ${level.title}` : "Chemin du niveau" };
}

const LEGEND: { state: "available" | "in_progress" | "completed" | "perfect" | "locked"; cls: string; text: string }[] = [
  { state: "available", cls: "border-2 border-accent bg-bg-elev", text: "Disponible" },
  { state: "in_progress", cls: "border-2 border-accent bg-bg-elev shadow-[inset_0_-5px_0_var(--accent-soft)]", text: "En cours (à moitié rempli)" },
  { state: "completed", cls: "border border-ink bg-ink", text: "Terminé" },
  { state: "perfect", cls: "border border-accent bg-accent", text: "Parfait (quiz sans faute)" },
  { state: "locked", cls: "border border-dashed border-line-strong bg-bg-sunken", text: "Verrouillé" },
];

export default async function ParcoursNiveauPage({ params }: { params: Promise<{ niveau: string }> }) {
  const { niveau } = await params;
  const user = await requireUser();
  const levelId = levelIdFromParam(niveau);
  const level = levelId ? getLevel(levelId) : null;
  if (!level || !levelId) notFound();

  const { structure, access } = await loadAccess(user.id);
  const path = buildLevelPath(structure, access, levelId);
  if (!path) notFound();
  const la = access.levels[levelId];
  const levels = getLevels();
  const li = levels.findIndex((l) => l.id === levelId);
  const prevLevel = levels[li - 1] ?? null;
  const nextLevel = levels[li + 1] ?? null;

  const lessonMeta = new Map(level.modules.flatMap((m) => m.lessons.map((l) => [l.id, l] as const)));
  const view = (n: PathNode): PathNodeView => {
    const key = nodeKey(n);
    const base = { key, kind: n.kind, id: n.id, state: n.state, offset: n.offset, current: key === path.currentKey };
    if (n.kind === "lesson") {
      const l = lessonMeta.get(n.id);
      return { ...base, href: routes.lesson(n.id), title: l?.title ?? n.id, meta: `Leçon ${n.id} · ${formatMinutes(l?.minutes ?? 0)}`, short: n.id.slice(1) };
    }
    if (n.kind === "quiz") {
      const m = level.modules.find((x) => x.id === n.id);
      return { ...base, href: routes.quiz(n.id), title: `Quiz — ${m?.title ?? n.id}`, meta: `Quiz ${n.id} · ${m?.quizMinutes ?? 15} min · réussite ≥ 70 %`, short: "?" };
    }
    return { ...base, href: routes.exam(levelId), title: level.certificate || level.title, meta: `Examen ${levelId} · ${level.examMinutes} min · 3 tentatives`, short: "" };
  };

  const modules: PathModuleView[] = path.modules.map((pm) => {
    const m = level.modules.find((x) => x.id === pm.moduleId)!;
    const ma = access.modules[pm.moduleId];
    return {
      id: m.id,
      number: m.id.slice(1),
      title: m.title,
      lessonsDone: ma.lessonsCompleted,
      lessonsTotal: ma.lessonsTotal,
      duration: formatMinutes(m.minutes),
      state: ma.state,
      nodes: pm.nodes.map(view),
    };
  });
  const pct = levelPercent(access, levelId);

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Parcours", href: routes.parcours }, { label: `Niveau ${level.index}` }]}
        title={level.title}
        description={`${level.code} · ${level.hours} h · ${level.modules.length} modules · ${level.lessonsCount} leçons`}
        actions={<StatusBadge status={la.state} />}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
        <div className="min-w-0">
          {!la.unlocked ? (
            <Notice tone="warn" title="Niveau verrouillé" className="mb-6">
              {prevLevel ? `Réussissez l'examen du niveau ${prevLevel.id} pour ouvrir ce chemin.` : "Ce niveau n'est pas encore ouvert."}
            </Notice>
          ) : null}
          <div className="mx-auto max-w-[560px]">
            <LevelPath modules={modules} exam={view(path.exam)} />
          </div>
        </div>

        <aside className="order-first lg:order-none">
          <div className="border border-line bg-bg-elev p-5 lg:sticky lg:top-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">Progression du niveau</p>
            <p className="mt-3 flex items-baseline gap-1.5">
              <span className="num text-[34px] leading-none text-ink">{pct}</span>
              <span className="num text-[13px] text-ink-3">%</span>
            </p>
            <Progress className="mt-4" value={pct} label={`Progression du niveau ${levelId}`} />
            <dl className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
              <div>
                <dt className="text-ink-3">Leçons</dt>
                <dd className="num text-ink">
                  {la.lessonsCompleted}/{la.lessonsTotal}
                </dd>
              </div>
              <div>
                <dt className="text-ink-3">Modules</dt>
                <dd className="num text-ink">
                  {la.modulesCompleted}/{la.modulesTotal}
                </dd>
              </div>
            </dl>
            <ul className="mt-5 hidden space-y-2 border-t border-line pt-4 lg:block" aria-label="Légende">
              {LEGEND.map((l) => (
                <li key={l.state} className="flex items-center gap-3 text-[12px] text-ink-2">
                  <span className={`h-3.5 w-3.5 shrink-0 ${l.cls}`} aria-hidden />
                  {l.text}
                </li>
              ))}
            </ul>
            <div className="mt-5 hidden flex-col gap-2 border-t border-line pt-4 lg:flex">
              {prevLevel ? (
                <Link href={routes.level(prevLevel.id)} className="inline-flex items-center gap-2 text-[12px] text-ink-2 hover:text-ink">
                  <ArrowLeft size={13} aria-hidden /> Niveau {li}
                </Link>
              ) : null}
              {nextLevel ? (
                <Link href={routes.level(nextLevel.id)} className="inline-flex items-center gap-2 text-[12px] text-ink-2 hover:text-ink">
                  Niveau {li + 2} <ArrowRight size={13} aria-hidden />
                </Link>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
