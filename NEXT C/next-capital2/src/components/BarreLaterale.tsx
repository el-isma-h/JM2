"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Logo } from "./Logo";
import { MenuPleinEcran, calculerNav, EASE, type InfosSession } from "./MenuPleinEcran";
import { LANGUES, LOCALES, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";
import { COULEURS } from "@/config/couleurs";

/**
 * Navigation de la vitrine : barre latérale fixe encre / taupe sur grand écran,
 * barre supérieure + tiroir plein écran sur mobile et tablette.
 */
export function BarreLaterale({ locale, t, session }: { locale: Locale; t: Dict; session: InfosSession | null }) {
  const [ouvert, setOuvert] = useState(false);
  const chemin = usePathname();
  useEffect(() => { setOuvert(false); }, [chemin]);
  useEffect(() => {
    document.documentElement.style.overflow = ouvert ? "hidden" : "";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOuvert(false); };
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("keydown", esc); document.documentElement.style.overflow = ""; };
  }, [ouvert]);
  const { liens, resteChemin, cible, cibleTexte, hrefDe, actif } = calculerNav(locale, t, session, chemin);

  return (
    <>
      {/* Barre latérale : grand écran */}
      <aside className="sombre fixed inset-y-0 start-0 z-40 hidden w-60 flex-col border-e border-os/10 bg-encre text-os lg:flex" aria-label="Navigation">
        <div className="flex h-20 items-center px-7">
          <Link href={`/${locale}`} aria-label="NEXT Capital"><Logo couleur={COULEURS.taupe} /></Link>
        </div>
        <nav className="mt-6 flex flex-col px-7">
          {liens.map(([s, l], i) => {
            const a = actif(s);
            return (
              <motion.div key={s} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.04, duration: 0.6, ease: EASE }}>
                <Link href={hrefDe(s)} aria-current={a ? "page" : undefined} className={`group relative flex items-center gap-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 ${a ? "text-taupe" : "text-os/55 hover:text-taupe"}`}>
                  <span className={`block h-px transition-all duration-500 ${a ? "w-5 bg-taupe" : "w-2 bg-os/30 group-hover:w-5 group-hover:bg-taupe"}`} aria-hidden="true" />
                  {l}
                </Link>
              </motion.div>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-6 px-7 pb-8">
          <Link href={cible} className="bouton-taupe w-full">{cibleTexte}</Link>
          {!session && <Link href={`/${locale}/candidature`} className="lien-nav !text-os/55 hover:!text-taupe">{t.commun.candidater} →</Link>}
          <div className="grid grid-cols-4 gap-x-3 gap-y-2" role="listbox" aria-label={t.commun.langue}>
            {LOCALES.map((l) => <Link key={l} href={`/${l}${resteChemin}`} role="option" aria-selected={l === locale} dir={LANGUES[l].dir} className={`font-mono text-[9px] uppercase tracking-[0.18em] transition hover:text-taupe ${l === locale ? "text-taupe" : "text-os/40"}`}>{l}</Link>)}
          </div>
          <div className="border-t border-taupe/30 pt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-os/35">
            <p>{t.pied.siege}</p>
            <p className="mt-1">{t.commun.demoCourt}</p>
          </div>
        </div>
      </aside>

      {/* Barre supérieure : mobile et tablette */}
      <header className="sticky top-0 z-40 border-b border-os/10 bg-encre/90 text-os backdrop-blur lg:hidden">
        <div className="conteneur flex h-16 items-center justify-between">
          <Link href={`/${locale}`} aria-label="NEXT Capital"><Logo couleur={COULEURS.taupe} /></Link>
          <div className="flex items-center gap-6">
            <Link href={cible} className="lien-nav hidden !text-taupe/80 hover:!text-taupe sm:block">{cibleTexte}</Link>
            <button onClick={() => setOuvert((v) => !v)} className="lien-nav flex items-center gap-2 !text-taupe hover:!text-os" aria-expanded={ouvert} aria-controls="menu-plein-ecran">
              <span className="opacity-50">[</span>{ouvert ? t.chatbot.fermer : "Menu"}<span className="opacity-50">]</span>
            </button>
          </div>
        </div>
      </header>
      <MenuPleinEcran ouvert={ouvert} fermer={() => setOuvert(false)} locale={locale} t={t} session={session} chemin={chemin} accent="taupe" />
    </>
  );
}
