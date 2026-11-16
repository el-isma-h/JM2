"use client";

/**
 * Notifications éphémères (XP gagné, badge obtenu, info, erreur) — utilisables partout dans l'app connectée :
 *
 *   import { toast, announceRewards } from "@/components/feedback/toaster";
 *   toast({ title: "Enregistré" });
 *   announceRewards(result.rewards);   // { xp, badges } renvoyé par une server action (src/lib/rewards.ts)
 *
 * <Toaster /> est monté une seule fois dans src/app/(app)/layout.tsx. Annonce aux lecteurs d'écran (aria-live).
 */
import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Info, Lightning, WarningCircle, X } from "@phosphor-icons/react";
import { BadgeIcon } from "@/components/badges/badge-icon";
import type { Rewards } from "@/lib/rewards";
import { cn } from "@/lib/utils";

export type ToastKind = "xp" | "badge" | "info" | "error";
export type ToastInput = { kind?: ToastKind; title: string; description?: string; icon?: string; duration?: number };
type ToastItem = Required<Pick<ToastInput, "kind" | "title">> & ToastInput & { id: number };

let items: ToastItem[] = [];
let seq = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(input: ToastInput): number {
  const id = ++seq;
  const item: ToastItem = { ...input, kind: input.kind ?? "info", id };
  items = [...items, item].slice(-4);
  emit();
  return id;
}

export function dismissToast(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

/** Toasts d'XP puis de badges (léger décalage pour une lecture séquentielle). */
export function announceRewards(rewards: Rewards | null | undefined) {
  if (!rewards) return;
  if (rewards.xp > 0) toast({ kind: "xp", title: `+${rewards.xp} XP`, description: "Ajoutés à votre total." });
  rewards.badges.forEach((b, i) => {
    window.setTimeout(() => toast({ kind: "badge", title: `Badge obtenu : ${b.title}`, description: b.description, icon: b.icon, duration: 6500 }), 450 * (i + 1));
  });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
const getItems = () => items;
const EMPTY: ToastItem[] = [];
const getServerItems = () => EMPTY;

export function Toaster() {
  const list = React.useSyncExternalStore(subscribe, getItems, getServerItems);
  const reduce = useReducedMotion();
  return (
    <div aria-live="polite" aria-atomic="false" className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5rem)] z-[60] flex flex-col items-center gap-2 px-4 lg:inset-x-auto lg:bottom-auto lg:top-6 lg:right-6 lg:items-end">
      <AnimatePresence initial={false}>
        {list.map((t) => (
          <ToastCard key={t.id} item={t} reduce={!!reduce} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ item, reduce }: { item: ToastItem; reduce: boolean }) {
  React.useEffect(() => {
    const h = window.setTimeout(() => dismissToast(item.id), item.duration ?? 4500);
    return () => window.clearTimeout(h);
  }, [item.id, item.duration]);

  const icon =
    item.kind === "badge" ? (
      <BadgeIcon name={item.icon ?? ""} size={20} weight="regular" />
    ) : item.kind === "xp" ? (
      <Lightning size={18} weight="fill" aria-hidden />
    ) : item.kind === "error" ? (
      <WarningCircle size={18} aria-hidden />
    ) : (
      <Info size={18} aria-hidden />
    );

  return (
    <motion.div
      layout={!reduce}
      role={item.kind === "error" ? "alert" : "status"}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, x: 24, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className="pointer-events-auto flex w-full max-w-[360px] items-start gap-3 border border-line-strong bg-bg-elev p-3.5 pr-2 shadow-[var(--shadow-2)]"
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center border",
          item.kind === "badge" && "border-accent bg-accent text-accent-ink",
          item.kind === "xp" && "border-accent/40 bg-accent-soft text-accent",
          item.kind === "info" && "border-line-strong text-ink-2",
          item.kind === "error" && "border-danger/50 text-danger-ink",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className={cn("text-[13px] font-medium text-ink", item.kind === "xp" && "num text-[14px]")}>{item.title}</p>
        {item.description ? <p className="mt-0.5 text-[12px] leading-snug text-ink-2">{item.description}</p> : null}
      </div>
      <button type="button" onClick={() => dismissToast(item.id)} className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-ink-3 hover:text-ink" aria-label="Fermer la notification">
        <X size={14} />
      </button>
    </motion.div>
  );
}
