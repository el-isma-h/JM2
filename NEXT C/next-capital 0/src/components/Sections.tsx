import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function EnTete({ sur, titre, texte, sombre = false, centre = false }: { sur?: string; titre: string; texte?: string; sombre?: boolean; centre?: boolean }) {
  return (
    <Reveal className={`${centre ? "mx-auto text-center" : ""} max-w-4xl`}>
      {sur && <p className={`etiquette ${centre ? "justify-center" : ""}`}>{sur}</p>}
      <h2 className={`mt-5 text-4xl uppercase sm:text-6xl ${sombre ? "text-os" : "text-encre"}`}>{titre}</h2>
      {texte && <p className={`mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${sombre ? "text-os/65" : "text-graphite"}`}>{texte}</p>}
    </Reveal>
  );
}

export function PageEnTete({ sur, titre, texte, numero }: { sur?: string; titre: string; texte?: string; numero?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-encre/15 bg-os text-encre">
      {numero && <span className="filigrane absolute -top-6 end-4 text-[26vw] sm:text-[18vw]" aria-hidden="true">{numero}</span>}
      <div className="conteneur relative py-16 sm:py-24">
        <Reveal className="max-w-5xl">
          {sur && <p className="etiquette">{sur}</p>}
          <h1 className="titre-geant mt-6 text-[14vw] sm:text-[9vw] lg:text-[112px]">{titre}</h1>
          {texte && <p className="mt-8 max-w-2xl text-lg leading-relaxed text-graphite">{texte}</p>}
        </Reveal>
      </div>
    </section>
  );
}

export function Section({ children, sombre = false, clair2 = false, id, className = "" }: { children: ReactNode; sombre?: boolean; clair2?: boolean; id?: string; className?: string }) {
  return (
    <section id={id} className={`${sombre ? "sombre bg-encre text-os" : clair2 ? "bg-os-2 text-encre" : "bg-os text-encre"} ${className}`}>
      <div className="conteneur py-20 sm:py-28">{children}</div>
    </section>
  );
}

export function Carte({ titre, texte, numero, delai = 0, sombre = false }: { titre: string; texte: string; numero?: string; delai?: number; sombre?: boolean }) {
  return (
    <Reveal delai={delai} className={`${sombre ? "border-os/12" : "border-encre/12"} border-t pt-6`}>
      {numero && <span className="font-mono text-[11px] tracking-[0.2em] text-pierre">{numero}</span>}
      <h3 className={`mt-4 text-2xl uppercase ${sombre ? "text-os" : "text-encre"}`}>{titre}</h3>
      <p className={`mt-3 text-sm leading-relaxed ${sombre ? "text-os/60" : "text-graphite"}`}>{texte}</p>
    </Reveal>
  );
}

export function Avertissement({ texte }: { texte: string }) {
  return <p className="mt-10 border-s border-current/40 ps-4 font-mono text-[11px] leading-relaxed text-pierre">{texte}</p>;
}
