/** Monogramme NEXT (famille NEXT Capital / Next Formation), point signal violet, déclinaison « Next Formation · IA ». */
export function Logo({ clair = false, taille = 24, compact = false }: { clair?: boolean; taille?: number; compact?: boolean }) {
  const c = clair ? "#F3F0E8" : "currentColor";
  return (
    <span className="inline-flex select-none items-center gap-3" aria-label="Next Formation IA">
      <svg width={taille} height={taille} viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 28V4l20 24V4" fill="none" stroke={c} strokeWidth="3.2" strokeLinejoin="miter" strokeLinecap="square" />
        <rect x="23" y="4" width="3" height="3" fill="var(--accent)" />
      </svg>
      {!compact ? (
        <span className="font-display text-[14px] font-semibold uppercase tracking-[0.12em]" style={{ color: c }}>
          NEXT <span className="font-normal opacity-70">Formation</span>
          <span className="mx-1.5 font-normal text-accent" aria-hidden>
            ·
          </span>
          <span className="font-normal">IA</span>
        </span>
      ) : null}
    </span>
  );
}

/** Filet de marque : signal violet puis teintes de la maison. */
export function FiletMarque({ className = "" }: { className?: string }) {
  const c = ["var(--accent)", "#c9b8f0", "#8e8b83", "#5c5b61", "#0a0b0d"];
  return (
    <span className={`inline-flex gap-2 ${className}`} aria-hidden="true">
      {c.map((x) => (
        <span key={x} className="block h-[2px] w-7" style={{ background: x }} />
      ))}
    </span>
  );
}
