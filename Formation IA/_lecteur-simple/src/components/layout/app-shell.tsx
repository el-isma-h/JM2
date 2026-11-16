"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Books,
  Certificate,
  DownloadSimple,
  EnvelopeSimple,
  House,
  Key,
  List,
  Medal,
  Path,
  ShieldCheck,
  SignOut,
  Sliders,
  UserCircle,
  Users,
  X,
  type Icon,
} from "@phosphor-icons/react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { cn, initials } from "@/lib/utils";
import { ADMIN_NAV, LEARNER_NAV, isActive, type NavIcon, type NavItem } from "./nav";

const ICONS: Record<NavIcon, Icon> = { House, Path, Certificate, Medal, Books, Key, UserCircle, ShieldCheck, Users, EnvelopeSimple, DownloadSimple, Sliders };

export type ShellUser = { firstName: string; lastName: string; email: string; role: "learner" | "trainer" | "admin"; isDemo: boolean };

/**
 * Coque applicative : barre latérale (≥ 1024 px) ; barre supérieure + barre d'onglets en bas + tiroir (mobile).
 * `logoutAction` : server action passée par le layout (formulaire POST, protégé CSRF par Next).
 */
export function AppShell({ user, logoutAction, children }: { user: ShellUser; logoutAction: () => Promise<void>; children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = React.useState(false);
  const staff = user.role === "admin" || user.role === "trainer";
  const [lastPath, setLastPath] = React.useState(pathname);
  if (lastPath !== pathname) {
    // Ferme le tiroir à chaque navigation.
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      {/* Barre latérale */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-bg lg:flex">
        <div className="flex h-16 items-center border-b border-line px-5">
          <Link href="/" aria-label="Tableau de bord">
            <Logo taille={22} />
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5 scrollbar-thin" aria-label="Navigation principale">
          <NavList items={LEARNER_NAV} pathname={pathname} />
          {staff ? (
            <div className="mt-8">
              <p className="etiquette mb-3 px-3">Administration</p>
              <NavList items={ADMIN_NAV.filter((i) => !i.adminOnly || user.role === "admin")} pathname={pathname} />
            </div>
          ) : null}
        </nav>
        <UserBlock user={user} logoutAction={logoutAction} />
      </aside>

      {/* Barre supérieure mobile */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-bg/95 px-4 backdrop-blur lg:hidden">
        <Link href="/" aria-label="Tableau de bord">
          <Logo taille={20} />
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button type="button" className="inline-flex h-9 w-9 items-center justify-center text-ink-2 hover:text-ink" onClick={() => setOpen(true)} aria-label="Ouvrir le menu" aria-expanded={open}>
            <List size={20} />
          </button>
        </div>
      </header>

      <main className="app-main safe-bottom min-w-0">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</div>
      </main>

      {/* Barre d'onglets mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Navigation rapide">
        {LEARNER_NAV.filter((i) => i.mobile).map((item) => {
          const I = ICONS[item.icon];
          const active = isActive(item, pathname);
          return (
            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-1 py-2.5 font-mono text-[9px] uppercase tracking-[0.12em]", active ? "text-accent" : "text-ink-3")} aria-current={active ? "page" : undefined}>
              <I size={20} weight={active ? "fill" : "regular"} />
              <span className="max-w-full truncate px-1">{item.label === "Tableau de bord" ? "Accueil" : item.label}</span>
            </Link>
          );
        })}
        <button type="button" onClick={() => setOpen(true)} className="flex flex-col items-center gap-1 py-2.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-3">
          <List size={20} />
          <span>Plus</span>
        </button>
      </nav>

      {/* Tiroir mobile */}
      <AnimatePresence>
        {open ? (
          <>
            <motion.div className="fixed inset-0 z-40 bg-encre/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-50 flex w-[86vw] max-w-sm flex-col border-l border-line-strong bg-bg lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.165, 0.84, 0.44, 1] }}
            >
              <div className="flex h-14 items-center justify-between border-b border-line px-4">
                <span className="etiquette">Menu</span>
                <button type="button" onClick={() => setOpen(false)} className="inline-flex h-9 w-9 items-center justify-center text-ink-2 hover:text-ink" aria-label="Fermer le menu">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Menu mobile">
                <NavList items={LEARNER_NAV} pathname={pathname} />
                {staff ? (
                  <div className="mt-6">
                    <p className="etiquette mb-3 px-3">Administration</p>
                    <NavList items={ADMIN_NAV.filter((i) => !i.adminOnly || user.role === "admin")} pathname={pathname} />
                  </div>
                ) : null}
              </nav>
              <UserBlock user={user} logoutAction={logoutAction} />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function NavList({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const I = ICONS[item.icon];
        const active = isActive(item, pathname);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 text-[13px] transition-colors duration-300",
                active ? "bg-bg-sunken text-ink" : "text-ink-2 hover:bg-bg-sunken/60 hover:text-ink",
              )}
            >
              {active ? <motion.span layoutId="nav-signal" className="absolute inset-y-0 left-0 w-[2px] bg-accent" /> : null}
              <I size={18} weight={active ? "fill" : "regular"} className={active ? "text-accent" : ""} />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function UserBlock({ user, logoutAction }: { user: ShellUser; logoutAction: () => Promise<void> }) {
  return (
    <div className="border-t border-line p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-line-strong font-mono text-[11px] text-ink">{initials(user.firstName, user.lastName)}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-ink">
            {user.firstName} {user.lastName}
          </p>
          <p className="truncate font-mono text-[10px] text-ink-3">{user.email}</p>
        </div>
        {user.isDemo ? <Badge tone="info">Démo</Badge> : null}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <ThemeToggle withLabel className="-ml-2" />
        <form action={logoutAction}>
          <button type="submit" className="inline-flex h-9 items-center gap-2 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3 transition-colors hover:text-ink">
            <SignOut size={15} /> Déconnexion
          </button>
        </form>
      </div>
    </div>
  );
}
