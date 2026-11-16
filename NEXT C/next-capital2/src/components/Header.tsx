"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { MenuPleinEcran, calculerNav, type InfosSession } from "./MenuPleinEcran";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";

export type { InfosSession };

/** En-tête minimal (logo · connexion · menu) + menu plein écran, à la K8. Utilisé sur les écrans internes (espace investisseur, admin). */
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
  const { cible, cibleTexte } = calculerNav(locale, t, session, chemin);

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
      <MenuPleinEcran ouvert={ouvert} fermer={() => setOuvert(false)} locale={locale} t={t} session={session} chemin={chemin} />
    </>
  );
}
