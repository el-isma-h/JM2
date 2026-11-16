"use client";

import * as React from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import { Field, Input, Select } from "@/components/ui/field";
import { routes, withBase } from "@/lib/paths";
import { cn } from "@/lib/utils";

export type ExportItem = { type: string; title: string; description: string; columns: string };

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function ExportsPanel({ items, learners }: { items: ExportItem[]; learners: { id: string; name: string }[] }) {
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [learner, setLearner] = React.useState("");
  const invalid = Boolean(from && to && from > to);

  function preset(days: number | "month" | "all") {
    const now = new Date();
    if (days === "all") {
      setFrom("");
      setTo("");
    } else if (days === "month") {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 0);
      setFrom(iso(new Date(first.getTime() - first.getTimezoneOffset() * 60000)));
      setTo(iso(new Date(last.getTime() - last.getTimezoneOffset() * 60000)));
    } else {
      setFrom(iso(new Date(now.getTime() - (days - 1) * 86_400_000)));
      setTo(iso(now));
    }
  }

  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  if (learner) qs.set("apprenant", learner);
  const query = qs.toString();

  return (
    <div className="grid-cols-1 [&>*]:min-w-0 grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="self-start border border-line bg-bg-elev px-5 py-5">
        <p className="font-display text-[15px] font-light uppercase tracking-[0.05em] text-ink">Filtres</p>
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Du" htmlFor="exp-from">
              <Input id="exp-from" type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />
            </Field>
            <Field label="Au" htmlFor="exp-to">
              <Input id="exp-to" type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} aria-invalid={invalid} />
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { l: "7 jours", v: 7 as const },
              { l: "30 jours", v: 30 as const },
              { l: "Mois dernier", v: "month" as const },
              { l: "Tout", v: "all" as const },
            ].map((p) => (
              <button key={p.l} type="button" onClick={() => preset(p.v)} className="border border-line-strong px-2.5 py-1 text-[12px] text-ink-2 transition-colors hover:border-ink hover:text-ink">
                {p.l}
              </button>
            ))}
          </div>
          <Field label="Apprenant" htmlFor="exp-learner" help="Par défaut : tous les apprenants, hors compte démo.">
            <Select id="exp-learner" value={learner} onChange={(e) => setLearner(e.target.value)}>
              <option value="">Tous les apprenants</option>
              {learners.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </Field>
          {invalid ? <p className="text-[12.5px] text-danger-ink">La date de début doit précéder la date de fin.</p> : null}
        </div>
        <p className="mt-6 border-t border-line pt-4 text-[12px] text-ink-3">Fichiers CSV en UTF-8, séparateur point-virgule : ils s&apos;ouvrent directement dans Excel. Heures de Paris.</p>
      </div>

      <ul className="divide-y divide-line border border-line bg-bg-elev">
        {items.map((it) => (
          <li key={it.type} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 max-w-[62ch]">
              <p className="text-[14.5px] text-ink">{it.title}</p>
              <p className="mt-1 text-[13px] text-ink-2">{it.description}</p>
              <p className="mt-2 text-[12px] text-ink-3">Colonnes : {it.columns}</p>
            </div>
            <a
              href={`${withBase(routes.api.adminExport(it.type))}${query ? `?${query}` : ""}`}
              aria-disabled={invalid}
              onClick={(e) => invalid && e.preventDefault()}
              data-export={it.type}
              className={cn(
                "inline-flex h-10 shrink-0 items-center justify-center gap-2 border border-ink bg-ink px-4 text-[11px] font-medium uppercase tracking-[0.18em] text-bg transition-all duration-500 hover:border-accent hover:bg-accent hover:text-accent-ink",
                invalid && "pointer-events-none opacity-40",
              )}
            >
              <DownloadSimple size={15} /> Télécharger
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
