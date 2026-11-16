import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lightning, Question, SealCheck, Lock } from "@phosphor-icons/react/ssr";
import { requireUser } from "@/server/auth";
import { getLearnerSnapshot } from "@/server/learner";
import { findProgrammeModule, getFlatLessons, getLevel, getLevels } from "@/content";
import { BADGE_BY_ID, parisDayKey, shiftDayKey, XP_RANKS } from "@/domain";
import { levelPercent, nextMilestone } from "@/domain/path";
import { routes } from "@/lib/paths";
import { cn, formatDate, formatMinutes, formatNumber, plural } from "@/lib/utils";
import { Panel } from "@/components/ui/surface";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Progress, ProgressRing } from "@/components/ui/progress";
import { FadeIn } from "@/components/ui/motion";
import { XpCount } from "@/components/dashboard/xp-count";
import { BadgeIcon } from "@/components/badges/badge-icon";
import { StreakFlame } from "@/components/dashboard/streak-flame";

export const metadata: Metadata = { title: "Tableau de bord" };

const WEEKDAY = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "narrow" });
const TODAY = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "long", day: "numeric", month: "long" });

function greeting(now: Date) {
  const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", hour: "2-digit", hourCycle: "h23" }).format(now));
  return h >= 18 || h < 5 ? "Bonsoir" : "Bonjour";
}

export default async function DashboardPage() {
  const user = await requireUser();
  const now = new Date();
  const snap = await getLearnerSnapshot(user.id, now);
  const levels = getLevels();
  const milestone = nextMilestone(snap.structure, snap.access);

  const resume = (() => {
    const r = snap.resume;
    if (r.kind === "lesson") {
      const l = getFlatLessons().find((x) => x.id === r.lessonId);
      const mod = findProgrammeModule(r.moduleId);
      const started = snap.access.lessons[r.lessonId]?.state === "in_progress";
      return {
        href: routes.lesson(r.lessonId),
        kicker: `Leçon ${r.lessonId} · Module ${r.moduleId.slice(1)}`,
        title: l?.title ?? r.lessonId,
        context: mod?.module.title ?? "",
        meta: l ? formatMinutes(l.minutes) : "",
        cta: started ? "Reprendre la leçon" : "Commencer la leçon",
      };
    }
    if (r.kind === "quiz") {
      const mod = findProgrammeModule(r.moduleId);
      return { href: routes.quiz(r.moduleId), kicker: `Quiz · Module ${r.moduleId.slice(1)}`, title: mod?.module.title ?? r.moduleId, context: "Toutes les leçons sont terminées.", meta: `${mod?.module.quizMinutes ?? 15} min`, cta: "Passer le quiz" };
    }
    if (r.kind === "exam") {
      const lv = getLevel(r.levelId);
      return { href: routes.exam(r.levelId), kicker: `Examen · ${r.levelId}`, title: lv?.title ?? r.levelId, context: "Tous les quiz du niveau sont réussis.", meta: `${lv?.examMinutes ?? 60} min`, cta: "Voir l'examen" };
    }
    return null;
  })();

  const today = parisDayKey(now);
  const week = Array.from({ length: 7 }, (_, i) => {
    const key = shiftDayKey(today, i - 6);
    return { key, active: snap.streak.activeDays.includes(key), label: WEEKDAY.format(new Date(`${key}T12:00:00Z`)), today: i === 6 };
  });
  const rank = snap.xp.rank;
  const nextRank = XP_RANKS[rank.index + 1];
  const daily = snap.xp.daily;

  return (
    <div>
      <FadeIn>
        <header className="mb-8 border-b border-line pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">{TODAY.format(now)}</p>
          <h1 className="mt-3 text-[30px] text-ink sm:text-[40px]">
            {greeting(now)} {user.firstName}
          </h1>
          <p className="mt-3 text-[13.5px] text-ink-2">
            {snap.progressPercent} % de la formation accompli
            {daily.reached ? " · objectif du jour atteint" : ` · encore ${daily.goal - daily.earned} XP pour l'objectif du jour`}
          </p>
        </header>
      </FadeIn>

      <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
        {/* Reprendre */}
        <FadeIn className="lg:col-span-8">
          <section aria-labelledby="reprendre" className="relative h-full overflow-hidden border border-ink bg-ink p-6 text-bg sm:p-8">
            <span aria-hidden className="filigrane pointer-events-none absolute -bottom-10 -right-4 text-[180px] text-bg sm:text-[220px]">
              {resume ? resume.kicker.match(/\d+/)?.[0] ?? "" : "✓"}
            </span>
            <h2 id="reprendre" className="relative font-mono text-[10px] font-medium tracking-[0.24em] text-bg/60">
              Reprendre
            </h2>
            {resume ? (
              <div className="relative">
                <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.18em] text-accent-bright dark:text-accent-ink">{resume.kicker}</p>
                <p className="mt-3 max-w-[24ch] font-display text-[24px] font-light uppercase leading-[1.08] tracking-[0.05em] sm:text-[30px]">{resume.title}</p>
                <p className="mt-3 max-w-[52ch] text-[13px] text-bg/70">
                  {resume.context}
                  {resume.meta ? ` · ${resume.meta}` : ""}
                </p>
                <Link
                  href={resume.href}
                  className="mt-8 inline-flex h-12 items-center gap-2 border border-bg bg-bg px-6 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] hover:border-accent-bright hover:bg-accent-bright"
                >
                  {resume.cta} <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            ) : (
              <p className="relative mt-6 max-w-[40ch] font-display text-[24px] font-light uppercase tracking-[0.05em]">Formation terminée. Les 150 leçons sont validées.</p>
            )}
          </section>
        </FadeIn>

        {/* Objectif du jour + série */}
        <FadeIn delay={0.05} className="lg:col-span-4">
          <Panel className="flex h-full flex-col p-6">
            <h2 className="font-mono text-[10px] font-medium tracking-[0.24em] text-ink-3">Objectif du jour</h2>
            <div className="mt-5 flex items-center gap-5">
              <ProgressRing value={daily.earned} max={daily.goal} size={88} stroke={4}>
                <span className="num text-[15px] text-ink">{Math.round(daily.progress * 100)} %</span>
              </ProgressRing>
              <div className="min-w-0">
                <p className="num text-[24px] leading-none text-ink">
                  {daily.earned}
                  <span className="text-[13px] text-ink-3"> / {daily.goal} XP</span>
                </p>
                <p className="mt-2 text-[12.5px] text-ink-2">{daily.reached ? "Atteint. La série continue." : "Une leçon terminée rapporte 20 XP."}</p>
                <Link href={routes.profile} className="mt-1 inline-block text-[11.5px] text-ink-3 underline-offset-4 hover:text-ink hover:underline">
                  Changer l&apos;objectif
                </Link>
              </div>
            </div>
            <div className="mt-6 border-t border-line pt-5">
              <div className="flex items-center gap-3">
                <StreakFlame days={snap.streak.current} activeToday={snap.streak.activeToday} size={40} />
                <div>
                  <p className="num text-[24px] leading-none text-ink">{plural(snap.streak.current, "jour")}</p>
                  <p className="mt-1 text-[12px] text-ink-3">
                    Série en cours · record {plural(snap.streak.longest, "jour")}
                  </p>
                </div>
              </div>
              <ol className="mt-4 grid grid-cols-7 gap-1.5" aria-label="Activité des 7 derniers jours">
                {week.map((d) => (
                  <li key={d.key} className="flex flex-col items-center gap-1.5">
                    <span
                      className={cn("block h-6 w-full", d.active ? "bg-warn" : "border border-line-strong bg-bg-sunken", d.today && !d.active && "border-dashed border-warn")}
                      aria-label={`${d.key} : ${d.active ? "actif" : "inactif"}`}
                    />
                    <span className={cn("font-mono text-[9.5px] uppercase", d.today ? "text-ink" : "text-ink-3")}>{d.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Panel>
        </FadeIn>

        {/* XP et rang */}
        <FadeIn delay={0.1} className="lg:col-span-4">
          <Panel className="flex h-full flex-col p-6">
            <h2 className="font-mono text-[10px] font-medium tracking-[0.24em] text-ink-3">Expérience</h2>
            <p className="mt-5 flex items-baseline gap-2">
              <Lightning size={22} weight="fill" className="self-center text-accent" aria-hidden />
              <span className="text-[40px] leading-none text-ink">
                <XpCount value={snap.xp.total} />
              </span>
              <span className="num text-[13px] text-ink-3">XP</span>
            </p>
            <div className="mt-auto pt-6">
              <p className="font-display text-[15px] font-light uppercase tracking-[0.08em] text-ink">
                Rang {rank.index + 1} · {rank.title}
              </p>
              <p className="num mt-1 text-[11px] text-ink-3">{nextRank ? `${formatNumber(nextRank.min - snap.xp.total)} XP avant « ${nextRank.title} »` : "Rang maximal atteint"}</p>
              <ol className="mt-4 grid grid-cols-6 gap-1" aria-label="Échelle des rangs d'XP">
                {XP_RANKS.map((r, i) => {
                  const fill = i < rank.index ? 1 : i === rank.index ? rank.progress : 0;
                  return (
                    <li key={r.title} title={`${r.title} · ${formatNumber(r.min)} XP`}>
                      <span className="relative block h-1.5 overflow-hidden bg-bg-muted">
                        <span className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${Math.round(fill * 100)}%` }} />
                      </span>
                      <span className={cn("mt-1.5 block truncate font-mono text-[9px] uppercase tracking-[0.08em]", i === rank.index ? "text-ink" : "text-ink-3")}>{r.title}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Panel>
        </FadeIn>

        {/* Progression par niveau */}
        <FadeIn delay={0.15} className="lg:col-span-8">
          <Panel className="h-full">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="font-mono text-[10px] font-medium tracking-[0.24em] text-ink-3">Progression par niveau</h2>
              <Link href={routes.parcours} className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2 hover:text-ink">
                Parcours
              </Link>
            </div>
            <ul className="divide-y divide-line">
              {levels.map((lv, i) => {
                const la = snap.access.levels[lv.id];
                const pct = levelPercent(snap.access, lv.id);
                return (
                  <li key={lv.id}>
                    <Link href={routes.level(lv.id)} className="group grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-6 py-4 transition-colors hover:bg-bg-sunken">
                      <span className={cn("num text-[22px] leading-none", la.unlocked ? "text-ink" : "text-ink-3")}>{i + 1}</span>
                      <span className="min-w-0">
                        <span className={cn("block truncate text-[13.5px]", la.unlocked ? "text-ink" : "text-ink-3")}>{lv.title}</span>
                        <Progress className="mt-2" value={pct} label={`Niveau ${i + 1}`} tone="accent" />
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="num w-10 text-right text-[12px] text-ink-2">{pct} %</span>
                        <span className="hidden sm:inline">
                          <StatusBadge status={la.state} />
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </FadeIn>

        {/* Prochain jalon */}
        <FadeIn delay={0.2} className="lg:col-span-4">
          <Panel className="flex h-full flex-col p-6">
            <h2 className="font-mono text-[10px] font-medium tracking-[0.24em] text-ink-3">Prochain jalon</h2>
            {milestone ? (
              milestone.kind === "quiz" ? (
                <MilestoneBody
                  icon={<Question size={20} weight="bold" className="-rotate-45" aria-hidden />}
                  diamond
                  unlocked={milestone.unlocked}
                  kicker={`Quiz du module ${milestone.moduleId.slice(1)}`}
                  title={findProgrammeModule(milestone.moduleId)?.module.title ?? milestone.moduleId}
                  detail={milestone.unlocked ? "Ouvert : réussissez-le à 70 % pour débloquer le module suivant." : `S'ouvre après ${plural(milestone.lessonsLeft, "leçon")} encore.`}
                  href={milestone.unlocked ? routes.quiz(milestone.moduleId) : routes.level(milestone.levelId)}
                  cta={milestone.unlocked ? "Passer le quiz" : "Voir le chemin"}
                />
              ) : (
                <MilestoneBody
                  icon={<SealCheck size={22} aria-hidden />}
                  unlocked
                  kicker={`Examen ${milestone.levelId}`}
                  title={getLevel(milestone.levelId)?.certificate ?? milestone.levelId}
                  detail="Tous les quiz sont réussis : l'examen de certification est ouvert."
                  href={routes.exam(milestone.levelId)}
                  cta="Voir l'examen"
                />
              )
            ) : (
              <p className="mt-5 text-[13px] text-ink-2">Aucun jalon en attente.</p>
            )}
          </Panel>
        </FadeIn>

        {/* Badges récents */}
        <FadeIn delay={0.25} className="lg:col-span-8">
          <Panel className="h-full">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="font-mono text-[10px] font-medium tracking-[0.24em] text-ink-3">
                Badges récents · <span className="num">{snap.badges.length}</span>/20
              </h2>
              <Link href={routes.badges} className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2 hover:text-ink">
                Tous les badges
              </Link>
            </div>
            {snap.badges.length === 0 ? (
              <p className="px-6 py-8 text-[13px] text-ink-2">Terminez votre première leçon pour obtenir « Premier pas ».</p>
            ) : (
              <ul className="-mb-px -mr-px grid grid-cols-2 sm:grid-cols-4">
                {snap.badges.slice(0, 4).map((b) => {
                  const def = BADGE_BY_ID[b.badgeId];
                  return (
                    <li key={b.badgeId} className="flex flex-col gap-3 border-b border-r border-line bg-bg-elev p-5">
                      <span className="flex h-11 w-11 items-center justify-center bg-accent text-accent-ink">
                        <BadgeIcon name={def?.icon ?? ""} weight="regular" />
                      </span>
                      <span>
                        <span className="block text-[13px] text-ink">{def?.title ?? b.badgeId}</span>
                        <span className="mt-0.5 block text-[11.5px] text-ink-3">{formatDate(b.at)}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </FadeIn>
      </div>
    </div>
  );
}

function MilestoneBody({ icon, diamond, unlocked, kicker, title, detail, href, cta }: { icon: React.ReactNode; diamond?: boolean; unlocked: boolean; kicker: string; title: string; detail: string; href: string; cta: string }) {
  return (
    <>
      <div className="mt-5 flex items-start gap-4">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center", diamond && "rotate-45 scale-[0.8]", unlocked ? "border-2 border-accent text-accent" : "border border-dashed border-line-strong bg-bg-sunken text-ink-3")}>
          {unlocked ? icon : <Lock size={18} className={diamond ? "-rotate-45" : ""} aria-hidden />}
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{kicker}</p>
          <p className="mt-1.5 text-[14px] leading-snug text-ink">{title}</p>
        </div>
      </div>
      <p className="mt-4 text-[12.5px] text-ink-2">{detail}</p>
      <div className="mt-auto pt-5">
        <Button asChild variant={unlocked ? "primary" : "secondary"} size="sm">
          <Link href={href}>
            {cta} <ArrowRight size={12} aria-hidden />
          </Link>
        </Button>
      </div>
    </>
  );
}
