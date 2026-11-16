"use client";

/** Tableau des apprenants : recherche (nom, e-mail), tri par colonne, filtre de population. */
import * as React from "react";
import Link from "next/link";
import { CaretDown, CaretUp, MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "@/components/ui/field";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { routes } from "@/lib/paths";
import { cn, formatSeconds } from "@/lib/utils";

export type LearnerListRow = {
  id: string;
  name: string;
  email: string;
  role: "learner" | "trainer" | "admin";
  isDemo: boolean;
  disabled: boolean;
  currentLevel: string | null;
  progress: number;
  seconds: number;
  lastActivity: string | null;
  certificates: number;
};

type SortKey = "name" | "email" | "currentLevel" | "progress" | "seconds" | "lastActivity" | "certificates";

const COLS: { key: SortKey; label: string; num?: boolean; className?: string }[] = [
  { key: "name", label: "Apprenant" },
  { key: "currentLevel", label: "Niveau" },
  { key: "progress", label: "Progression", num: true, className: "w-40" },
  { key: "seconds", label: "Temps total", num: true },
  { key: "lastActivity", label: "Dernière activité" },
  { key: "certificates", label: "Certificats", num: true },
];

const rel = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });
function relative(iso: string | null, now: number) {
  if (!iso) return "Jamais";
  const days = Math.round((new Date(iso).getTime() - now) / 86_400_000);
  if (days === 0) {
    const h = Math.round((new Date(iso).getTime() - now) / 3_600_000);
    return h === 0 ? "À l'instant" : rel.format(h, "hour");
  }
  return rel.format(days, "day");
}

function norm(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function LearnersTable({ rows, now }: { rows: LearnerListRow[]; now: number }) {
  const [q, setQ] = React.useState("");
  const [scope, setScope] = React.useState<"learners" | "staff" | "all">("learners");
  const [sort, setSort] = React.useState<{ key: SortKey; dir: 1 | -1 }>({ key: "lastActivity", dir: -1 });

  const filtered = React.useMemo(() => {
    const nq = norm(q.trim());
    const list = rows.filter((r) => (scope === "all" ? true : scope === "learners" ? r.role === "learner" : r.role !== "learner") && (!nq || norm(`${r.name} ${r.email}`).includes(nq)));
    const val = (r: LearnerListRow): string | number => {
      const v = r[sort.key];
      if (sort.key === "lastActivity") return v ? new Date(v as string).getTime() : 0;
      return typeof v === "string" ? norm(v) : ((v as number | null) ?? "");
    };
    return [...list].sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      return (va < vb ? -1 : va > vb ? 1 : 0) * sort.dir;
    });
  }, [rows, q, scope, sort]);

  const counts = { learners: rows.filter((r) => r.role === "learner").length, staff: rows.filter((r) => r.role !== "learner").length, all: rows.length };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4">
        <div className="relative min-w-[220px] flex-1">
          <MagnifyingGlass size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un nom ou une adresse e-mail" className="pl-9" aria-label="Rechercher un apprenant" type="search" />
        </div>
        <div className="flex border border-line-strong" role="radiogroup" aria-label="Population">
          {(["learners", "staff", "all"] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={scope === s}
              onClick={() => setScope(s)}
              className={cn("h-10 border-l border-line-strong px-3 text-[12.5px] transition-colors first:border-l-0", scope === s ? "bg-ink text-bg" : "text-ink-2 hover:text-ink")}
            >
              {s === "learners" ? "Apprenants" : s === "staff" ? "Équipe" : "Tous"} <span className="num opacity-70">{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile : liste */}
      <ul className="divide-y divide-line md:hidden">
        {filtered.map((r) => (
          <li key={r.id}>
            <Link href={routes.adminLearner(r.id)} className="block px-5 py-4 transition-colors hover:bg-bg-sunken">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] text-ink">{r.name || r.email}</p>
                  <p className="truncate text-[12px] text-ink-3">{r.email}</p>
                </div>
                <span className="num shrink-0 text-[13px] text-ink">{r.progress} %</span>
              </div>
              <Progress value={r.progress} className="mt-3" label={`Progression de ${r.name}`} />
              <p className="mt-2 text-[12px] text-ink-3">
                {r.currentLevel ?? "—"} · {formatSeconds(r.seconds)} · {relative(r.lastActivity, now)}
                {r.certificates ? ` · ${r.certificates} certificat${r.certificates > 1 ? "s" : ""}` : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {/* Bureau : tableau */}
      <div className="hidden overflow-x-auto md:block">
        <table className="data-table text-[13.5px]">
          <thead>
            <tr>
              {COLS.map((c) => (
                <th key={c.key} className={cn(c.num && "num", c.className)} aria-sort={sort.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
                  <button
                    type="button"
                    onClick={() => setSort((s) => ({ key: c.key, dir: s.key === c.key ? ((-s.dir) as 1 | -1) : c.num || c.key === "lastActivity" ? -1 : 1 }))}
                    className={cn("inline-flex items-center gap-1 uppercase tracking-[0.18em] transition-colors hover:text-ink", sort.key === c.key && "text-ink")}
                  >
                    {c.label}
                    {sort.key === c.key ? sort.dir === 1 ? <CaretUp size={10} weight="bold" /> : <CaretDown size={10} weight="bold" /> : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className={cn(r.disabled && "opacity-55")}>
                <td>
                  <Link href={routes.adminLearner(r.id)} className="text-ink transition-colors hover:text-accent">
                    {r.name || "—"}
                  </Link>
                  <span className="ml-2 inline-flex gap-1 align-middle">
                    {r.role !== "learner" ? <StatusBadge status={r.role} /> : null}
                    {r.isDemo ? <StatusBadge status="demo" /> : null}
                    {r.disabled ? <Badge tone="danger">Désactivé</Badge> : null}
                  </span>
                  <p className="text-[12px] text-ink-3">{r.email}</p>
                </td>
                <td className="num text-ink-2">{r.currentLevel ?? "—"}</td>
                <td className="num">
                  <div className="flex items-center justify-end gap-3">
                    <Progress value={r.progress} className="w-20" label={`Progression de ${r.name}`} />
                    <span className="w-10 text-right">{r.progress} %</span>
                  </div>
                </td>
                <td className="num">{formatSeconds(r.seconds)}</td>
                <td className="text-ink-2" title={r.lastActivity ? new Date(r.lastActivity).toLocaleString("fr-FR") : undefined}>
                  {relative(r.lastActivity, now)}
                </td>
                <td className="num">{r.certificates || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 ? <p className="px-5 py-10 text-center text-[13.5px] text-ink-2">Aucun résultat pour « {q} ». Vérifiez l&apos;orthographe ou changez de population.</p> : null}
    </div>
  );
}
