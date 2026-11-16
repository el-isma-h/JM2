export interface ElementDefilant { texte: string; fond: string; clair?: boolean }

/**
 * Bandeau défilant continu : blocs de couleur pleine qui se suivent (très coloré, contraste avec l'écrin encre / taupe).
 * CSS pur ; s'arrête (et devient défilable à la main) si mouvement réduit ; sens inversé en RTL.
 */
export function BandeauDefilant({ elements, duree = 48, inverse = false, className = "" }: { elements: ElementDefilant[]; duree?: number; inverse?: boolean; className?: string }) {
  const Piste = ({ cache = false }: { cache?: boolean }) => (
    <div className="flex w-max shrink-0" aria-hidden={cache || undefined}>
      {elements.map((e, i) => (
        <span key={`${e.texte}-${i}`} className={`flex items-center gap-4 whitespace-nowrap px-8 py-4 font-display text-xl font-light uppercase tracking-[0.1em] sm:text-2xl ${e.clair ? "text-os" : "text-encre"}`} style={{ background: e.fond }}>
          {e.texte}
          <span className="block h-1.5 w-1.5 bg-current opacity-60" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`defilant overflow-hidden ${className}`} role="marquee" style={{ ["--duree" as string]: `${duree}s` }}>
      <div className={`defilant-piste flex w-max ${inverse ? "defilant-inverse" : ""}`}>
        <Piste /><Piste cache />
      </div>
    </div>
  );
}
