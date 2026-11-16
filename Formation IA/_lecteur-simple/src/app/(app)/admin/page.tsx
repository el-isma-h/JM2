import type { Metadata } from "next";
import Link from "next/link";
import { BellRinging, DownloadSimple, EnvelopeSimple } from "@phosphor-icons/react/ssr";
import { requireRole } from "@/server/auth";
import { getLevels } from "@/content";
import { getDashboard } from "@/server/admin/queries";
import { PageHeader, Panel, PanelHeader, EmptyState } from "@/components/ui/surface";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import { FadeIn } from "@/components/ui/motion";
import { ActivityChart, LevelBar } from "@/components/admin/charts";
import { routes } from "@/lib/paths";
import { formatDate, formatDateTime, formatNumber, formatSeconds } from "@/lib/utils";

export const metadata: Metadata = { title: "Administration" };
export const dynamic = "force-dynamic";

function rate(ok: number, n: number) {
  return n ? `${Math.round((ok / n) * 100)} %` : "—";
}

function daysSince(d: Date | null, now: Date) {
  return d ? Math.floor((now.getTime() - d.getTime()) / 86_400_000) : null;
}

export default async function AdminPage() {
  await requireRole("admin", "trainer");
  const now = new Date();
  const d = await getDashboard(now);
  const titles = Object.fromEntries(getLevels().map((l) => [l.id, l.title]));
  const hours = d.totalSeconds / 3600;

  const kpis: { label: string; value: string; hint: string }[] = [
    { label: "Actifs sur 7 jours", value: formatNumber(d.active7), hint: `${formatNumber(d.active30)} sur 30 jours · ${formatNumber(d.learners)} inscrits` },
    { label: "Heures de formation", value: hours >= 10 ? formatNumber(Math.round(hours)) : (Math.round(hours * 10) / 10).toLocaleString("fr-FR"), hint: "temps mesuré cumulé" },
    { label: "Leçons terminées", value: formatNumber(d.lessonsCompleted), hint: d.learners ? `${(Math.round((d.lessonsCompleted / d.learners) * 10) / 10).toLocaleString("fr-FR")} par apprenant` : "—" },
    { label: "Réussite aux quiz", value: rate(d.quiz.passed, d.quiz.attempts), hint: `${formatNumber(d.quiz.attempts)} tentatives` },
    { label: "Réussite aux examens", value: rate(d.exams.passed, d.exams.attempts), hint: `${formatNumber(d.exams.attempts)} tentatives soumises` },
    { label: "Certificats émis", value: formatNumber(d.certificates), hint: "valides, hors révoqués" },
  ];

  return (
    <div>
      <PageHeader
        title="Vue d'ensemble"
        description="L'activité des apprenants de la formation NF-IA-150 : temps passé, progression, résultats et personnes à relancer."
        actions={
          <>
            <Button asChild variant="secondary" size="sm">
              <Link href={routes.adminExports}>
                <DownloadSimple size={14} /> Exports FOAD
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href={routes.adminInvitations}>
                <EnvelopeSimple size={14} /> Inviter
              </Link>
            </Button>
          </>
        }
      />

      <FadeIn>
        <Panel className="grid grid-cols-2 gap-px bg-line md:grid-cols-3 xl:grid-cols-6">
          {kpis.map((k) => (
            <div key={k.label} className="min-w-0 bg-bg-elev px-5 py-5">
              <p className="text-[12px] text-ink-3">{k.label}</p>
              <p className="num mt-2 text-[28px] font-light leading-none text-ink">{k.value}</p>
              <p className="mt-2 truncate text-[12px] text-ink-3">{k.hint}</p>
            </div>
          ))}
        </Panel>
      </FadeIn>

      <div className="grid-cols-1 [&>*]:min-w-0 mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <Panel>
          <PanelHeader title="30 derniers jours" description="Temps de formation par jour et nombre d'apprenants actifs." />
          <div className="px-5 py-5">
            <ActivityChart data={d.daily} />
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Niveau en cours" description="Où se trouvent les apprenants dans le parcours." />
          <div className="px-5 py-5">
            <LevelBar data={d.levels} titles={titles} />
          </div>
        </Panel>
      </div>

      <div className="grid-cols-1 [&>*]:min-w-0 mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <Panel>
          <PanelHeader
            title="À relancer"
            description="Apprenants sans activité depuis plus de 7 jours (ou jamais connectés depuis leur inscription)."
            actions={d.toRemind.length ? <span className="num text-[13px] text-ink-2">{d.toRemind.length}</span> : null}
          />
          {d.toRemind.length ? (
            <Table>
              <thead>
                <tr>
                  <Th>Apprenant</Th>
                  <Th>Dernière activité</Th>
                  <Th num>Progression</Th>
                  <Th className="w-0" />
                </tr>
              </thead>
              <tbody>
                {d.toRemind.slice(0, 12).map((l) => {
                  const n = daysSince(l.lastActivity, now);
                  return (
                    <tr key={l.id}>
                      <Td>
                        <Link href={routes.adminLearner(l.id)} className="text-ink hover:text-accent">
                          {l.firstName} {l.lastName}
                        </Link>
                        <p className="truncate text-[12px] text-ink-3">{l.email}</p>
                      </Td>
                      <Td className="text-ink-2">{n === null ? "Jamais" : `il y a ${n} jours`}</Td>
                      <Td num>{l.progress} %</Td>
                      <Td>
                        <a
                          href={`mailto:${l.email}?subject=${encodeURIComponent("Votre formation Next Formation IA")}&body=${encodeURIComponent(`Bonjour ${l.firstName},\n\nVotre parcours vous attend : vous en êtes à ${l.progress} %. Une leçon prend une vingtaine de minutes.\n\n`)}`}
                          className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap border border-line-strong px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-2 transition-colors hover:border-ink hover:text-ink"
                        >
                          <BellRinging size={13} /> Relancer
                        </a>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <EmptyState title="Personne à relancer" description="Tous les apprenants ont été actifs au cours des sept derniers jours." />
          )}
        </Panel>
        <Panel>
          <PanelHeader title="Derniers examens" />
          {d.recentExams.length ? (
            <ul className="divide-y divide-line">
              {d.recentExams.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <Link href={routes.adminLearner(e.userId)} className="block truncate text-[13.5px] text-ink hover:text-accent">
                      {e.name}
                    </Link>
                    <p className="text-[12px] text-ink-3">
                      <span className="num">{e.levelId}</span> · {formatDateTime(e.submittedAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="num text-[13px] text-ink">{e.percent !== null ? `${Math.round(e.percent)} %` : "—"}</span>
                    <StatusBadge status={e.passed ? "passed" : "failed"} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Aucun examen passé" description="Les tentatives soumises apparaîtront ici." />
          )}
          <p className="border-t border-line px-5 py-3 text-[12px] text-ink-3">
            Temps cumulé de tous les apprenants : <span className="num text-ink-2">{formatSeconds(d.totalSeconds)}</span> · mis à jour le {formatDate(now)}
          </p>
        </Panel>
      </div>
    </div>
  );
}
