import Link from "next/link";
import { FiletMarque } from "./Logo";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";

/** Pied de page encre avec monogramme géant, à la K8. */
export function Footer({ locale, t }: { locale: Locale; t: Dict }) {
  const col = (titre: string, liens: [string, string][]) => (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-os/40">{titre}</p>
      <ul className="mt-5 space-y-2.5">
        {liens.map(([s, l]) => <li key={s}><Link href={`/${locale}/${s}`} className="font-mono text-[11px] uppercase tracking-[0.16em] text-os/70 transition-colors duration-500 hover:text-signal">{l}</Link></li>)}
      </ul>
    </div>
  );
  return (
    <footer className="sombre bg-encre text-os">
      <div className="conteneur grid gap-12 py-20 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col justify-between gap-10">
          <svg viewBox="0 0 32 32" className="h-40 w-40 sm:h-56 sm:w-56" aria-hidden="true"><path d="M6 28V4l20 24V4" fill="none" stroke="#F3F0E8" strokeWidth="2.2" strokeLinecap="square" /><rect x="23" y="4" width="3" height="3" fill="#19E07A" /></svg>
          <div><FiletMarque /><p className="mt-6 max-w-sm font-serif text-xl italic text-os/70">{t.pied.accroche}</p></div>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          {col(t.pied.investir, [["fonds", t.nav.fonds], ["theses", t.nav.theses], ["marches", t.nav.marches], ["token", t.nav.token], ["deals", t.nav.deals], ["adhesion", t.nav.adhesion]])}
          {col(t.pied.ressources, [["parcours", t.nav.parcours], ["a-propos", t.nav.apropos], ["faq", t.nav.faq], ["risques", t.nav.risques]])}
          {col(t.pied.legal, [["mentions-legales", t.pied.mentions], ["confidentialite", t.pied.confidentialite], ["cookies", t.pied.cookies]])}
        </div>
      </div>
      <div className="border-t border-os/10">
        <div className="conteneur space-y-2 py-6 text-[11px] leading-relaxed text-os/45">
          <p>{t.commun.risque}</p>
          <p>{t.pied.reglementaire}</p>
          <p className="flex flex-wrap justify-between gap-4 font-mono uppercase tracking-[0.18em]"><span>© {new Date().getFullYear()} NEXT Capital · {t.commun.demoCourt}</span><span>{t.pied.siege}</span></p>
        </div>
      </div>
    </footer>
  );
}
