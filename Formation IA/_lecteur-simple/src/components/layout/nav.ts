import { routes } from "@/lib/paths";

/**
 * Navigation principale (SPEC § Pages). `icon` : nom d'icône phosphor résolu dans app-shell.tsx.
 * `match` : préfixes de chemins (sans basePath) qui rendent l'entrée active.
 */
export type NavItem = { href: string; label: string; icon: NavIcon; match: string[]; mobile?: boolean; /** Réservé au rôle admin (masqué au formateur). */ adminOnly?: boolean };
export type NavIcon = "House" | "Path" | "Certificate" | "Medal" | "Books" | "Key" | "UserCircle" | "ShieldCheck" | "Users" | "EnvelopeSimple" | "DownloadSimple" | "Sliders";

export const LEARNER_NAV: NavItem[] = [
  { href: routes.home, label: "Tableau de bord", icon: "House", match: ["/"], mobile: true },
  { href: routes.parcours, label: "Parcours", icon: "Path", match: ["/parcours", "/lecon", "/quiz", "/examen"], mobile: true },
  { href: routes.certificates, label: "Certificats", icon: "Certificate", match: ["/certificats"], mobile: true },
  { href: routes.badges, label: "Badges", icon: "Medal", match: ["/badges"], mobile: true },
  { href: routes.resources, label: "Ressources", icon: "Books", match: ["/ressources"] },
  { href: routes.apiKey, label: "Clé API", icon: "Key", match: ["/cle-api"] },
  { href: routes.profile, label: "Profil", icon: "UserCircle", match: ["/profil"] },
];

export const ADMIN_NAV: NavItem[] = [
  { href: routes.admin, label: "Vue d'ensemble", icon: "ShieldCheck", match: ["/admin"] },
  { href: routes.adminLearners, label: "Apprenants", icon: "Users", match: ["/admin/apprenants"] },
  { href: routes.adminInvitations, label: "Invitations", icon: "EnvelopeSimple", match: ["/admin/invitations"] },
  { href: routes.adminExports, label: "Exports FOAD", icon: "DownloadSimple", match: ["/admin/exports"] },
  { href: routes.adminSettings, label: "Réglages", icon: "Sliders", match: ["/admin/reglages"], adminOnly: true },
];

/** L'entrée est-elle active pour ce chemin ? « / » et « /admin » ne correspondent qu'à eux-mêmes. */
export function isActive(item: NavItem, pathname: string): boolean {
  return item.match.some((m) => (m === "/" || m === "/admin" ? pathname === m : pathname === m || pathname.startsWith(`${m}/`)));
}
