import type { Metadata } from "next";
import Link from "next/link";
import { and, eq, isNull } from "drizzle-orm";
import { ArrowRight, Certificate, Lock } from "@phosphor-icons/react/ssr";
import { requireUser } from "@/server/auth";
import { loadAccess } from "@/server/learner";
import { db, schema } from "@/db";
import { getProgramme } from "@/content";
import { levelPercent } from "@/domain/path";
import { routes } from "@/lib/paths";
import { cn, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/surface";
import { StatusBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Stagger, StaggerItem } from "@/components/ui/motion";

export const metadata: Metadata = { title: "Parcours" };

/** Les 4 niveaux en grandes cartes : état, pourcentage, certificat obtenu. Chaque carte ouvre le chemin du niveau. */
export default async function ParcoursPage() {
  const user = await requireUser();
  const [{ access }, certs] = await Promise.all([
    loadAccess(user.id),
    db
      .select({ levelId: schema.certificates.levelId, number: schema.certificates.number, issuedAt: schema.certificates.issuedAt })
      .from(schema.certificates)
      .where(and(eq(schema.certificates.userId, user.id), isNull(schema.certificates.revokedAt))),
  ]);
  const prog = getProgramme();
  const certByLevel = new Map(certs.map((c) => [c.levelId, c]));

  return (
    <div>
      <PageHeader title="Parcours" description={`${prog.subtitle}. Chaque niveau se termine par un examen et un certificat.`} />
      <Stagger className="grid gap-px border border-line bg-line md:grid-cols-2">
        {prog.levels.map((level, i) => {
          const la = access.levels[level.id];
          const pct = levelPercent(access, level.id);
          const cert = certByLevel.get(level.id);
          const locked = !la.unlocked;
          return (
            <StaggerItem key={level.id} className="bg-bg-elev">
              <Link
                href={routes.level(level.id)}
                className={cn("group relative flex h-full min-h-[300px] flex-col overflow-hidden p-6 transition-colors duration-500 hover:bg-bg-sunken sm:p-8", locked && "bg-bg-sunken/40")}
                aria-label={`Niveau ${i + 1} : ${level.title} — ${pct} %`}
              >
                <span aria-hidden className="filigrane pointer-events-none absolute -right-3 -top-6 text-[200px] text-ink transition-opacity duration-500 group-hover:opacity-25 sm:text-[230px]">
                  {i + 1}
                </span>
                <div className="relative flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">
                    Niveau {i + 1} · {level.hours} h
                  </span>
                  <StatusBadge status={la.state} />
                </div>
                <h2 className={cn("relative mt-5 max-w-[16ch] text-[26px] leading-[1.02] sm:text-[30px]", locked ? "text-ink-2" : "text-ink")}>{level.title}</h2>
                <p className="relative mt-3 max-w-[44ch] text-[13px] text-ink-2">{level.audience}</p>

                <div className="relative mt-auto pt-8">
                  {cert ? (
                    <p className="mb-4 inline-flex items-center gap-2 border border-accent/40 bg-accent-soft px-2.5 py-1.5 text-[12px] text-accent">
                      <Certificate size={16} weight="fill" aria-hidden />
                      Certificat obtenu le {formatDate(cert.issuedAt)}
                    </p>
                  ) : locked ? (
                    <p className="mb-4 inline-flex items-center gap-2 text-[12px] text-ink-3">
                      <Lock size={14} aria-hidden /> Réussissez l&apos;examen du niveau {i} pour l&apos;ouvrir
                    </p>
                  ) : null}
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="num text-[12px] text-ink-3">
                      {la.lessonsCompleted}/{la.lessonsTotal} leçons · {la.modulesCompleted}/{la.modulesTotal} modules
                    </p>
                    <p className="num text-[22px] leading-none text-ink">
                      {pct}
                      <span className="text-[12px] text-ink-3"> %</span>
                    </p>
                  </div>
                  <Progress className="mt-3" value={pct} tone="accent" label={`Progression du niveau ${i + 1}`} />
                  <p className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors group-hover:text-accent">
                    {locked ? "Voir le chemin" : la.examPassed ? "Revoir le chemin" : pct > 0 ? "Continuer" : "Commencer"}
                    <ArrowRight size={13} className="transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
                  </p>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
