import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
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

/** Chemin de redirection interne sûr : refuse les URL absolues et « //hôte » (redirection ouverte). */
export function safeNextPath(next: unknown, fallback = "/app"): string {
  const s = typeof next === "string" ? next : "";
  return /^\/(?![/\\])/.test(s) && !/[\r\n]/.test(s) ? s : fallback;
}
