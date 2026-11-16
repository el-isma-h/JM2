import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "?";
}

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export function truncate(s: string, n = 60) {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

/** Chemin de redirection interne sûr (sans basePath) : refuse les URL absolues et « //hôte » (redirection ouverte). */
export function safeNextPath(next: unknown, fallback = "/"): string {
  const s = typeof next === "string" ? next : "";
  return /^\/(?![/\\])/.test(s) && !/[\r\n]/.test(s) ? s : fallback;
}

/** Durée lisible : 95 → « 1 h 35 », 40 → « 40 min ». */
export function formatMinutes(minutes: number): string {
  const m = Math.round(minutes);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} h ${String(r).padStart(2, "0")}` : `${h} h`;
}

/** Secondes → « 1 h 05 min » / « 12 min » / « 45 s ». */
export function formatSeconds(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s} s`;
  return formatMinutes(s / 60);
}

const dateFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function formatDate(d: Date | string | null | undefined): string {
  return d ? dateFmt.format(new Date(d)) : "—";
}
export function formatDateTime(d: Date | string | null | undefined): string {
  return d ? dateTimeFmt.format(new Date(d)) : "—";
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

/** « 1 leçon » / « 3 leçons ». */
export function plural(n: number, one: string, many = `${one}s`): string {
  return `${formatNumber(n)} ${n > 1 ? many : one}`;
}
