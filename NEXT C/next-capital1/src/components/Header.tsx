"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo, FiletMarque } from "./Logo";
import { LANGUES, LOCALES, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";

export interface InfosSession { prenom: string; role: "investisseur" | "admin" }

const EASE = [0.165, 0.84, 0.44, 1] as const;

/** En-tête minimal (logo · connexion · menu) + menu plein écran, à la K8. */
export function Header({ locale, t, session }: { locale: Locale; t: Dict; session: InfosSession | null }) {
  const [ouvert, setOuvert] = useState(false);
  const chemin = usePathname();
  useEffect(() => { setOuvert(false); }, [chemin]);
  useEffect(() => {
    document.documentElement.style.overflow = ouvert ? "hidden" : "";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOuvert(false); };
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("keydown", esc); document.documentElement.style.overflow = ""; };
  }, [ouvert]);

  const liens: [string, string][] = [
    ["", t.nav.fonds === t.nav.fonds ? "Accueil" : ""], ["fonds", t.nav.fonds], ["theses", t.nav.theses], ["marches", t.nav.marches], ["token", t.nav.token], ["deals", t.nav.deals], ["adhesion", t.nav.adhesion], ["parcours", t.nav.parcours], ["a-propos", t.nav.apropos],
  ].filter(([, l]) => l) as [string, string][];
  liens[0][1] = locale === "fr" ? "Accueil" : locale === "en" ? "Home" : "Home";
  const resteChemin = chemin.replace(/^\/[a-z]{2}/, "") || "";
  const cible = session ? `/${locale}/${session.role === "admin" ? "admin" : "compte"}` : `/${locale}/connexion`;
  const cibleTexte = session ? (session.role === "admin" ? t.commun.admin : t.commun.monEspace) : t.commun.connexion;

  return (
    <>
      <header className="sticky top-0 z-40 text-os mix-blend-difference">
        <div className="conteneur flex h-16 items-center justify-between">
          <Link href={`/${locale}`} aria-label="NEXT Capital"><Logo clair /></Link>
          <div className="flex items-center gap-6">
            <Link href={cible} className="lien-nav hidden !text-os/70 hover:!text-os sm:block">{cibleTexte}</Link>
            <button onClick={() => setOuvert((v) => !v)} className="lien-nav flex items-center gap-2 !text-os/70 hover:!text-os" aria-expanded={ouvert} aria-controls="menu-plein-ecran">
              <span className="opacity-50">[</span>{ouvert ? t.chatbot.fermer : "Menu"}<span className="opacity-50">]</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {ouvert && (
          <motion.div id="menu-plein-ecran" role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex flex-col bg-encre text-os"
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.8, ease: EASE }}>
            <div className="conteneur flex h-16 items-center justify-between">
              <Link href={`/${locale}`} aria-label="NEXT Capital"><Logo clair /></Link>
              <button onClick={() => setOuvert(false)} className="lien-nav !text-os/70 hover:!text-os"><span className="opacity-50">[</span>{t.chatbot.fermer}<span className="opacity-50">]</span></button>
            </div>
            <nav className="conteneur flex flex-1 flex-col items-center justify-center gap-1 py-10 text-center" aria-label="Menu">
              {liens.map(([s, l], i) => (
                <motion.div key={s} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.7, ease: EASE }}>
                  <Link href={s ? `/${locale}/${s}` : `/${locale}`} className={`block py-1 font-display text-[9vw] font-light uppercase leading-none tracking-[0.08em] transition-colors duration-500 hover:text-signal sm:text-5xl lg:text-6xl ${chemin === (s ? `/${locale}/${s}` : `/${locale}`) ? "text-signal" : ""}`}>{l}</Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-10 flex flex-col items-center gap-6">
                <Link href={cible} className="bouton-clair">{cibleTexte}</Link>
                {!session && <Link href={`/${locale}/candidature`} className="lien-nav !text-os/70 hover:!text-os">{t.commun.candidater} →</Link>}
                <div className="flex flex-wrap justify-center gap-x-5 gap-y-2" role="listbox" aria-label={t.commun.langue}>
                  {LOCALES.map((l) => <Link key={l} href={`/${l}${resteChemin}`} role="option" aria-selected={l === locale} dir={LANGUES[l].dir} className={`font-mono text-[10px] uppercase tracking-[0.2em] transition hover:text-os ${l === locale ? "text-signal" : "text-os/50"}`}>{LANGUES[l].nom}</Link>)}
                </div>
                <FiletMarque />
              </motion.div>
            </nav>
            <div className="conteneur flex flex-wrap justify-between gap-4 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-os/40">
              <span>{t.pied.siege}</span>
              <span>{t.commun.demoCourt}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
