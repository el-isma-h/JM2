"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Logo, FiletMarque } from "./Logo";
import { LANGUES, LOCALES, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";

export interface InfosSession { prenom: string; role: "investisseur" | "admin" }

export const EASE = [0.165, 0.84, 0.44, 1] as const;

/** Liens de la vitrine (Accueil + pages publiques) et cible de connexion / espace. */
export function calculerNav(locale: Locale, t: Dict, session: InfosSession | null, chemin: string) {
  const accueil = locale === "fr" ? "Accueil" : "Home";
  const liens: [string, string][] = [
    ["", accueil], ["fonds", t.nav.fonds], ["theses", t.nav.theses], ["marches", t.nav.marches], ["token", t.nav.token], ["deals", t.nav.deals], ["adhesion", t.nav.adhesion], ["parcours", t.nav.parcours], ["a-propos", t.nav.apropos],
  ];
  const resteChemin = chemin.replace(/^\/[a-z]{2}/, "") || "";
  const cible = session ? `/${locale}/${session.role === "admin" ? "admin" : "compte"}` : `/${locale}/connexion`;
  const cibleTexte = session ? (session.role === "admin" ? t.commun.admin : t.commun.monEspace) : t.commun.connexion;
  const hrefDe = (s: string) => (s ? `/${locale}/${s}` : `/${locale}`);
  const actif = (s: string) => chemin === hrefDe(s);
  return { liens, resteChemin, cible, cibleTexte, hrefDe, actif };
}

/** Menu plein écran encre (à la K8), partagé par l'en-tête des écrans internes et le tiroir mobile de la vitrine. */
export function MenuPleinEcran({ ouvert, fermer, locale, t, session, chemin, accent = "signal" }: {
  ouvert: boolean; fermer: () => void; locale: Locale; t: Dict; session: InfosSession | null; chemin: string; accent?: "signal" | "taupe";
}) {
  const { liens, resteChemin, cible, cibleTexte, hrefDe, actif } = calculerNav(locale, t, session, chemin);
  const acc = accent === "taupe" ? "text-taupe" : "text-signal";
  const accHover = accent === "taupe" ? "hover:text-taupe" : "hover:text-signal";
  return (
    <AnimatePresence>
      {ouvert && (
        <motion.div id="menu-plein-ecran" role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex flex-col bg-encre text-os"
          initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.8, ease: EASE }}>
          <div className="conteneur flex h-16 items-center justify-between">
            <Link href={`/${locale}`} aria-label="NEXT Capital"><Logo couleur={accent === "taupe" ? "#DEA193" : undefined} clair /></Link>
            <button onClick={fermer} className="lien-nav !text-os/70 hover:!text-os"><span className="opacity-50">[</span>{t.chatbot.fermer}<span className="opacity-50">]</span></button>
          </div>
          <nav className="conteneur flex flex-1 flex-col items-center justify-center gap-1 py-10 text-center" aria-label="Menu">
            {liens.map(([s, l], i) => (
              <motion.div key={s} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.7, ease: EASE }}>
                <Link href={hrefDe(s)} className={`block py-1 font-display text-[9vw] font-light uppercase leading-none tracking-[0.08em] transition-colors duration-500 ${accHover} sm:text-5xl lg:text-6xl ${actif(s) ? acc : ""}`}>{l}</Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-10 flex flex-col items-center gap-6">
              <Link href={cible} className={accent === "taupe" ? "bouton-taupe" : "bouton-clair"}>{cibleTexte}</Link>
              {!session && <Link href={`/${locale}/candidature`} className="lien-nav !text-os/70 hover:!text-os">{t.commun.candidater} →</Link>}
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-2" role="listbox" aria-label={t.commun.langue}>
                {LOCALES.map((l) => <Link key={l} href={`/${l}${resteChemin}`} role="option" aria-selected={l === locale} dir={LANGUES[l].dir} className={`font-mono text-[10px] uppercase tracking-[0.2em] transition hover:text-os ${l === locale ? acc : "text-os/50"}`}>{LANGUES[l].nom}</Link>)}
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
  );
}
