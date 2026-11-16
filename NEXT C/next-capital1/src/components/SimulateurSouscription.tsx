"use client";

import { useState } from "react";
import { calculSouscription, FONDS, formatEuros, formatTokens, montantValide, type NiveauAdhesion } from "@/config/fonds";
import type { Dict } from "@/i18n";

export function SimulateurSouscription({ niveau, intl, t, soldeCents, action, locale }: { niveau: NiveauAdhesion; intl: string; t: Dict["compte"]; soldeCents: number; action: (fd: FormData) => Promise<void>; locale: string }) {
  const [montant, setMontant] = useState(FONDS.ticketMinimumCents / 100);
  const cents = Math.round(montant * 100);
  const calc = calculSouscription(cents, niveau);
  const valide = montantValide(cents) && cents <= soldeCents;
  return (
    <form action={action} className="grid gap-6 md:grid-cols-[1fr_1fr]">
      <input type="hidden" name="locale" value={locale} />
      <div className="space-y-4">
        <div>
          <label className="champ-label" htmlFor="montant">{t.montantSous}</label>
          <input id="montant" name="montant" type="number" min={FONDS.ticketMinimumCents / 100} step={FONDS.ticketPasCents / 100} value={montant} onChange={(e) => setMontant(Number(e.target.value))} className="champ text-lg" />
          <p className="champ-aide">{t.souscrireAide}</p>
        </div>
        <input type="range" min={FONDS.ticketMinimumCents / 100} max={Math.max(FONDS.ticketMinimumCents / 100, Math.floor(soldeCents / 100 / 500) * 500)} step={FONDS.ticketPasCents / 100} value={montant} onChange={(e) => setMontant(Number(e.target.value))} className="w-full accent-encre" aria-label={t.montantSous} />
        <button className="bouton-or w-full" disabled={!valide}>{t.confirmerSous}</button>
      </div>
      <dl className="bg-encre p-6 text-os">
        <div className="flex justify-between py-2 text-sm"><dt className="text-os/60">{t.montantSous}</dt><dd>{formatEuros(cents, intl)}</dd></div>
        <div className="flex justify-between py-2 text-sm"><dt className="text-os/60">{t.frais} ({calc.fraisPct} %)</dt><dd>− {formatEuros(calc.fraisCents, intl)}</dd></div>
        <div className="flex justify-between border-t border-os/15 py-2 text-sm"><dt className="text-os/60">{t.net}</dt><dd>{formatEuros(calc.netCents, intl)}</dd></div>
        <div className="mt-3 border-t border-os/15 pt-4"><dt className="text-[11px] uppercase tracking-wider text-os/55">{t.recevez}</dt><dd className="mt-1 font-display font-semibold tracking-tight text-4xl text-signal">{formatTokens(calc.tokensCenti, intl)}</dd></div>
        <p className="mt-3 text-[11px] text-os/50">1 {FONDS.token.symbole} = {formatEuros(FONDS.token.prixEmissionCents, intl)}</p>
      </dl>
    </form>
  );
}
