import * as React from "react";
import { cn } from "@/lib/utils";

export type Tone = "neutral" | "ok" | "warn" | "danger" | "info" | "accent";

/** Pastilles NEXT Capital : bordure 1 px, mono capitales, angles droits. */
const tones: Record<Tone, string> = {
  neutral: "border-line-strong text-ink-2",
  ok: "border-ok/50 text-ok-ink",
  warn: "border-warn/60 text-warn-ink",
  danger: "border-danger/50 text-danger-ink",
  info: "border-info-ink/40 text-info-ink",
  accent: "border-accent bg-accent text-accent-ink",
};

export function Badge({ tone = "neutral", className, children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] font-medium uppercase leading-4 tracking-[0.14em] whitespace-nowrap", tones[tone], className)}
      {...props}
    >
      {children}
    </span>
  );
}

/** Statuts de l'application → ton + libellé, pour ne jamais afficher un code brut. */
export const statusMeta: Record<string, { label: string; tone: Tone }> = {
  // États des nœuds du parcours (domain/types.ts NodeState)
  locked: { label: "Verrouillé", tone: "neutral" },
  available: { label: "Disponible", tone: "info" },
  in_progress: { label: "En cours", tone: "warn" },
  completed: { label: "Terminé", tone: "ok" },
  perfect: { label: "Parfait", tone: "accent" },
  // Leçons (lesson_progress.status)
  started: { label: "Commencée", tone: "warn" },
  // Rôles
  learner: { label: "Apprenant", tone: "neutral" },
  trainer: { label: "Formateur", tone: "info" },
  admin: { label: "Administrateur", tone: "accent" },
  // Quiz / examens
  passed: { label: "Réussi", tone: "ok" },
  failed: { label: "Échoué", tone: "danger" },
  cooldown: { label: "Délai d'attente", tone: "warn" },
  exhausted: { label: "Tentatives épuisées", tone: "danger" },
  voided: { label: "Annulée", tone: "neutral" },
  // Invitations / certificats
  pending: { label: "En attente", tone: "warn" },
  accepted: { label: "Acceptée", tone: "ok" },
  expired: { label: "Expirée", tone: "neutral" },
  valid: { label: "Valide", tone: "ok" },
  revoked: { label: "Révoqué", tone: "danger" },
  demo: { label: "Démo", tone: "info" },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const m = statusMeta[status] ?? { label: status, tone: "neutral" as Tone };
  return (
    <Badge tone={m.tone} className={className}>
      {m.label}
    </Badge>
  );
}
