"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Dict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { ADHESIONS, THESES, formatEuros } from "@/config/fonds";

type T = Dict["candidature"];

function Champ({ label, children, aide }: { label: string; children: React.ReactNode; aide?: string }) {
  return <div><span className="champ-label">{label}</span>{children}{aide && <p className="champ-aide">{aide}</p>}</div>;
}

function Select({ nom, options, defaut = "" }: { nom: string; options: Record<string, string>; defaut?: string }) {
  return (
    <select name={nom} required defaultValue={defaut} className="champ">
      <option value="" disabled>—</option>
      {Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
    </select>
  );
}

function Radios({ nom, options, defaut }: { nom: string; options: Record<string, string>; defaut?: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {Object.entries(options).map(([k, v]) => (
        <label key={k} className="flex cursor-pointer items-start gap-3  border border-encre/15 bg-os px-4 py-3 text-sm has-[:checked]:border-encre has-[:checked]:ring-2 has-[:checked]:ring-encre/10">
          <input type="radio" name={nom} value={k} required defaultChecked={defaut === k} className="mt-0.5 accent-encre" />{v}
        </label>
      ))}
    </div>
  );
}

function Cases({ nom, options }: { nom: string; options: Record<string, string> }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {Object.entries(options).map(([k, v]) => (
        <label key={k} className="flex cursor-pointer items-center gap-3  border border-encre/15 bg-os px-4 py-3 text-sm has-[:checked]:border-encre has-[:checked]:ring-2 has-[:checked]:ring-encre/10">
          <input type="checkbox" name={nom} value={k} className="accent-encre" />{v}
        </label>
      ))}
    </div>
  );
}

export function FormulaireCandidature({ locale, t, adhesionT, thesesT, intl, action, erreur }: {
  locale: Locale; t: T; adhesionT: Dict["adhesion"]; thesesT: Dict["theses"]; intl: string; action: (fd: FormData) => Promise<void>; erreur?: string;
}) {
  const [etape, setEtape] = useState(0);
  const [envoi, setEnvoi] = useState(false);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const n = t.etapes.length;

  function valideEtape(i: number) {
    const zone = refs.current[i];
    if (!zone) return true;
    const champs = zone.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select, textarea");
    const groupesCases = new Map<string, boolean>();
    for (const c of champs) {
      if (c instanceof HTMLInputElement && c.type === "checkbox" && (c.name === "zones" || c.name === "theses")) {
        groupesCases.set(c.name, (groupesCases.get(c.name) ?? false) || c.checked);
        continue;
      }
      if (!c.reportValidity()) return false;
    }
    for (const [nom, ok] of groupesCases) if (!ok) { zone.querySelector<HTMLInputElement>(`input[name="${nom}"]`)?.focus(); return false; }
    return true;
  }
  function suivant() { if (valideEtape(etape)) setEtape((e) => Math.min(n - 1, e + 1)); }

  const thesesOptions = Object.fromEntries(THESES.map((th) => [th.id, thesesT[th.id].nom]));
  const ouiNon = { non: locale === "fr" ? "Non" : "No", oui: locale === "fr" ? "Oui" : "Yes" };

  return (
    <form action={async (fd) => { setEnvoi(true); await action(fd); setEnvoi(false); }} className="carte p-6 sm:p-10">
      <input type="hidden" name="locale" value={locale} />
      <ol className="mb-8 flex flex-wrap gap-2">
        {t.etapes.map((e, i) => (
          <li key={e} className={`flex items-center gap-2 border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${i === etape ? "border-encre bg-encre text-os" : i < etape ? "border-signal-2 text-signal-2" : "border-encre/15 text-pierre"}`}>
            <span>0{i + 1}</span>{e}
          </li>
        ))}
      </ol>
      {erreur && <p className="mb-6  bg-rouge/10 px-4 py-3 text-sm text-rouge">{t.erreurs[erreur as keyof T["erreurs"]] ?? t.erreurs.champs}</p>}

      <div ref={(el) => { refs.current[0] = el; }} hidden={etape !== 0} className="grid gap-4 sm:grid-cols-2">
        <Champ label={t.identite.prenom}><input name="prenom" required className="champ" autoComplete="given-name" /></Champ>
        <Champ label={t.identite.nom}><input name="nom" required className="champ" autoComplete="family-name" /></Champ>
        <Champ label={t.identite.email}><input name="email" type="email" required className="champ" autoComplete="email" /></Champ>
        <Champ label={t.identite.telephone}><input name="telephone" type="tel" required className="champ" autoComplete="tel" /></Champ>
        <Champ label={t.identite.naissance}><input name="naissance" type="date" required className="champ" max="2008-12-31" /></Champ>
        <Champ label={t.identite.nationalite}><input name="nationalite" required className="champ" /></Champ>
        <Champ label={t.identite.pays}><input name="pays" required className="champ" autoComplete="country-name" /></Champ>
        <Champ label={t.identite.motDePasse}><input name="motDePasse" type="password" required minLength={8} className="champ" autoComplete="new-password" /></Champ>
        <div className="sm:col-span-2"><Champ label={t.identite.adresse}><input name="adresse" required className="champ" autoComplete="street-address" /></Champ></div>
      </div>

      <div ref={(el) => { refs.current[1] = el; }} hidden={etape !== 1} className="grid gap-5">
        <Champ label={t.situation.situation}><Radios nom="situation" options={t.situation.situations} /></Champ>
        <Champ label={t.situation.secteur}><Select nom="secteur" options={t.situation.secteurs} /></Champ>
        <div className="grid gap-5 sm:grid-cols-2">
          <Champ label={t.situation.revenus}><Select nom="revenus" options={t.situation.revenusOptions} /></Champ>
          <Champ label={t.situation.patrimoine}><Select nom="patrimoine" options={t.situation.patrimoineOptions} /></Champ>
        </div>
        <Champ label={t.situation.origineFonds}><Radios nom="origineFonds" options={t.situation.origines} /></Champ>
        <div className="grid gap-5 sm:grid-cols-2">
          <Champ label={t.situation.pep}><Radios nom="pep" options={ouiNon} defaut="non" /></Champ>
          <Champ label={t.situation.usPerson}><Radios nom="usPerson" options={ouiNon} defaut="non" /></Champ>
        </div>
      </div>

      <div ref={(el) => { refs.current[2] = el; }} hidden={etape !== 2} className="grid gap-5">
        <Champ label={t.profil.zones}><Cases nom="zones" options={t.profil.zonesOptions} /></Champ>
        <Champ label={t.profil.theses}><Cases nom="theses" options={thesesOptions} /></Champ>
        <Champ label={t.profil.risque}><Radios nom="risque" options={t.profil.risques} /></Champ>
        <div className="grid gap-5 sm:grid-cols-2">
          <Champ label={t.profil.rendement}><Select nom="rendement" options={t.profil.rendements} /></Champ>
          <Champ label={t.profil.horizon}><Select nom="horizon" options={t.profil.horizons} /></Champ>
        </div>
        <Champ label={t.profil.experience}><Radios nom="experience" options={t.profil.experiences} /></Champ>
        <Champ label={t.profil.montantEnvisage}><input name="montantEnvisage" type="number" min={1500} step={500} required className="champ" placeholder="5000" /></Champ>
      </div>

      <div ref={(el) => { refs.current[3] = el; }} hidden={etape !== 3}>
        <p className="mb-5 text-sm text-pierre">{t.adhesionAide}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ADHESIONS.map((a) => (
            <label key={a.id} className="carte cursor-pointer p-5 has-[:checked]:ring-2 has-[:checked]:ring-encre">
              <input type="radio" name="adhesion" value={a.id} required defaultChecked={a.id === "gold"} className="sr-only" />
              <p className="text-[11px] uppercase tracking-[0.18em] text-pierre">{adhesionT.niveaux[a.id]}</p>
              <p className="mt-1 font-display font-semibold tracking-tight text-2xl">{formatEuros(a.prixAnnuelCents, intl)} <span className="text-xs text-pierre">{adhesionT.parAn}</span></p>
              <ul className="mt-3 space-y-1 text-xs text-encre/70">
                <li>{adhesionT.plafondAn} : {a.plafondAnnuelCents ? formatEuros(a.plafondAnnuelCents, intl) : adhesionT.illimite}</li>
                <li>{adhesionT.frais} : {a.fraisStructurationPct} %</li>
                <li>{adhesionT.bons} : {a.bonsPriorite}</li>
              </ul>
            </label>
          ))}
        </div>
      </div>

      <div ref={(el) => { refs.current[4] = el; }} hidden={etape !== 4} className="grid gap-5">
        <Champ label={t.pieces.identite} aide={t.pieces.formats}><input name="pieceIdentite" type="file" required accept="application/pdf,image/jpeg,image/png" className="champ" /></Champ>
        <Champ label={t.pieces.domicile} aide={t.pieces.formats}><input name="justificatifDomicile" type="file" required accept="application/pdf,image/jpeg,image/png" className="champ" /></Champ>
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="attestation" required className="mt-1 accent-encre" />{t.pieces.attestation}</label>
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="rgpd" required className="mt-1 accent-encre" />{t.pieces.rgpd}</label>
      </div>

      <div ref={(el) => { refs.current[5] = el; }} hidden={etape !== 5}>
        <AnimatePresence>{etape === 5 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-os p-6 text-sm">
            <p className="font-display text-2xl font-semibold uppercase tracking-tight">{t.recap}</p>
            <p className="mt-2 text-pierre">{t.intro}</p>
          </motion.div>
        )}</AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-encre/10 pt-6">
        <button type="button" onClick={() => setEtape((e) => Math.max(0, e - 1))} disabled={etape === 0} className="bouton-contour">←</button>
        {etape < n - 1 ? (
          <button type="button" onClick={suivant} className="bouton-primaire">→</button>
        ) : (
          <button type="submit" disabled={envoi} className="bouton-or">{envoi ? "…" : "✓"}</button>
        )}
      </div>
    </form>
  );
}
