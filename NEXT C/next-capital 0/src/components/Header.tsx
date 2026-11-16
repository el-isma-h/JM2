"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "./Logo";
import { LANGUES, LOCALES, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";

export interface InfosSession { prenom: string; role: "investisseur" | "admin" }

export function Header({ locale, t, session }: { locale: Locale; t: Dict; session: InfosSession | null }) {
  const [ouvert, setOuvert] = useState(false);
  const [langOuvert, setLangOuvert] = useState(false);
  const chemin = usePathname();
  useEffect(() => { setOuvert(false); setLangOuvert(false); }, [chemin]);

  const liens: [string, string][] = [
    ["fonds", t.nav.fonds], ["theses", t.nav.theses], ["marches", t.nav.marches], ["token", t.nav.token], ["deals", t.nav.deals], ["adhesion", t.nav.adhesion], ["parcours", t.nav.parcours], ["a-propos", t.nav.apropos],
  ];
  const resteChemin = chemin.replace(/^\/[a-z]{2}/, "") || "";
  const sombre = chemin === `/${locale}` || chemin.includes("/token");
  const cible = session ? `/${locale}/${session.role === "admin" ? "admin" : "compte"}` : `/${locale}/candidature`;
  const cibleTexte = session ? (session.role === "admin" ? t.commun.admin : t.commun.monEspace) : t.commun.candidater;

  return (
    <header className={`sticky top-0 z-40 border-b ${sombre ? "sombre border-os/10 bg-encre/85 text-os" : "border-encre/10 bg-os/85 text-encre"} backdrop-blur`}>
      <div className="conteneur flex h-14 items-center justify-between gap-6">
        <Link href={`/${locale}`} aria-label="NEXT Capital"><Logo clair={sombre} /></Link>
        <nav className="hidden items-center gap-7 xl:flex" aria-label="Navigation">
          {liens.map(([s, l]) => (
            <Link key={s} href={`/${locale}/${s}`} className={`lien-nav ${chemin.startsWith(`/${locale}/${s}`) ? (sombre ? "!text-os" : "!text-encre") : ""}`}>{l}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setLangOuvert((v) => !v)} className="lien-nav flex items-center gap-1.5" aria-haspopup="listbox" aria-expanded={langOuvert} aria-label={t.commun.langue}>
              {locale}<span className="opacity-50">▾</span>
            </button>
            <AnimatePresence>
              {langOuvert && (
                <motion.ul initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }} role="listbox" className="absolute end-0 mt-3 w-44 border border-encre/15 bg-os p-1 text-encre">
                  {LOCALES.map((l) => (
                    <li key={l} role="option" aria-selected={l === locale}>
                      <Link href={`/${l}${resteChemin}`} className={`block px-3 py-2 text-sm hover:bg-encre hover:text-os ${l === locale ? "font-medium" : "text-graphite"}`} dir={LANGUES[l].dir}>{LANGUES[l].nom}</Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <span className={`hidden h-4 w-px sm:block ${sombre ? "bg-os/20" : "bg-encre/20"}`} />
          {!session && <Link href={`/${locale}/connexion`} className="lien-nav hidden sm:block">{t.commun.connexion}</Link>}
          <Link href={cible} className={`${sombre ? "bouton-clair" : "bouton-primaire"} hidden !py-2 sm:inline-flex`}>{cibleTexte}</Link>
          <button onClick={() => setOuvert((v) => !v)} className="p-1 xl:hidden" aria-label="Menu" aria-expanded={ouvert}>
            <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">{ouvert ? <path d="M2 1l18 12M20 1L2 13" stroke="currentColor" strokeWidth="1.4" /> : <path d="M0 1h22M0 7h22M0 13h22" stroke="currentColor" strokeWidth="1.4" />}</svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {ouvert && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`overflow-hidden border-t xl:hidden ${sombre ? "border-os/10 bg-encre" : "border-encre/10 bg-os"}`}>
            <nav className="conteneur flex flex-col py-4">
              {liens.map(([s, l]) => <Link key={s} href={`/${locale}/${s}`} className={`border-b py-3 font-display text-2xl font-semibold uppercase tracking-tight ${sombre ? "border-os/10" : "border-encre/10"}`}>{l}</Link>)}
              <div className="mt-4 flex gap-2">
                {!session && <Link href={`/${locale}/connexion`} className="bouton-contour flex-1">{t.commun.connexion}</Link>}
                <Link href={cible} className={`${sombre ? "bouton-clair" : "bouton-primaire"} flex-1`}>{cibleTexte}</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
