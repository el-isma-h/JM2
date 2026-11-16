import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Carte NEXT Capital : bordure 1 px, angles droits, pas d'ombre. */
export function Panel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border border-line bg-bg-elev", className)} {...props}>
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4", className)}>
      <div className="min-w-0">
        <h2 className="text-[15px] text-ink">{title}</h2>
        {description ? <p className="mt-1 text-[13px] text-ink-2">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div className="min-w-0">
        {breadcrumb?.length ? (
          <nav className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3" aria-label="Fil d'Ariane">
            {breadcrumb.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 ? <span aria-hidden>/</span> : null}
                {b.href ? (
                  <Link href={b.href} className="transition-colors hover:text-ink">
                    {b.label}
                  </Link>
                ) : (
                  <span>{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        ) : null}
        <h1 className="text-[30px] text-ink sm:text-[36px]">{title}</h1>
        {description ? <p className="mt-3 max-w-[70ch] text-[13.5px] text-ink-2">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-14 text-center", className)}>
      {icon ? <div className="mb-3 text-ink-3">{icon}</div> : null}
      <p className="font-display text-[15px] uppercase tracking-[0.06em] text-ink">{title}</p>
      {description ? <p className="mt-2 max-w-[46ch] text-[13.5px] text-ink-2">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Notice({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: "info" | "warn" | "danger" | "ok";
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    info: "border-info-ink/40 text-info-ink",
    warn: "border-warn/70 text-warn-ink",
    danger: "border-danger text-danger-ink",
    ok: "border-ok/60 text-ok-ink",
  };
  return (
    <div className={cn("border-s-2 bg-bg-elev px-4 py-3 text-[13.5px]", tones[tone], className)} role={tone === "danger" ? "alert" : "status"}>
      {title ? <p className="font-medium">{title}</p> : null}
      <div className={title ? "mt-0.5" : ""}>{children}</div>
    </div>
  );
}

export function Stat({ label, value, hint, className }: { label: string; value: React.ReactNode; hint?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">{label}</p>
      <p className="mt-2 font-display text-[26px] font-semibold tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-1 text-[12px] text-ink-3">{hint}</p> : null}
    </div>
  );
}

export function KeyValue({ items, className }: { items: { k: string; v: React.ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2.5 text-[13.5px]", className)}>
      {items.map((it) => (
        <React.Fragment key={it.k}>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3 pt-0.5">{it.k}</dt>
          <dd className="min-w-0 text-ink">{it.v ?? "-"}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
