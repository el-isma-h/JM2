import Link from "next/link";
import { Logo, FiletMarque } from "./Logo";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";

export function Footer({ locale, t }: { locale: Locale; t: Dict }) {
  const col = (titre: string, liens: [string, string][]) => (
    <div>
      <p className="etiquette mb-5">{titre}</p>
      <ul className="space-y-2.5">
        {liens.map(([s, l]) => <li key={s}><Link href={`/${locale}/${s}`} className="text-sm text-graphite transition hover:text-encre">{l}</Link></li>)}
      </ul>
    </div>
  );
  return (
    <footer className="border-t border-encre/15 bg-os text-encre">
      <div className="conteneur py-16">
        <div className="flex flex-col items-start gap-6 border-b border-encre/10 pb-12">
          <svg width="56" height="56" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 28V4l20 24V4" fill="none" stroke="#0A0B0D" strokeWidth="3.2" strokeLinecap="square" /><rect x="23" y="4" width="3" height="3" fill="#19E07A" /></svg>
          <FiletMarque />
          <p className="max-w-md font-serif text-2xl italic text-encre/80">{t.pied.accroche}</p>
        </div>
        <div className="grid gap-10 py-12 md:grid-cols-4">
          {col(t.pied.investir, [["fonds", t.nav.fonds], ["theses", t.nav.theses], ["marches", t.nav.marches], ["token", t.nav.token], ["deals", t.nav.deals], ["adhesion", t.nav.adhesion]])}
          {col(t.pied.ressources, [["parcours", t.nav.parcours], ["a-propos", t.nav.apropos], ["faq", t.nav.faq], ["risques", t.nav.risques]])}
          {col(t.pied.legal, [["mentions-legales", t.pied.mentions], ["confidentialite", t.pied.confidentialite], ["cookies", t.pied.cookies]])}
          <div><Logo /><p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-pierre">{t.pied.siege}</p></div>
        </div>
        <div className="space-y-2 border-t border-encre/10 pt-6 text-[11px] leading-relaxed text-pierre">
          <p>{t.commun.risque}</p>
          <p>{t.pied.reglementaire}</p>
          <p className="font-mono uppercase tracking-[0.18em]">© {new Date().getFullYear()} NEXT Capital · {t.commun.demoCourt}</p>
        </div>
      </div>
    </footer>
  );
}
