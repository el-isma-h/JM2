export function Logo({ clair = false, taille = 26, compact = false }: { clair?: boolean; taille?: number; compact?: boolean }) {
  const c = clair ? "#F3F0E8" : "#0A0B0D";
  return (
    <span className="inline-flex items-center gap-3 select-none">
      <svg width={taille} height={taille} viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 28V4l20 24V4" fill="none" stroke={c} strokeWidth="3.2" strokeLinejoin="miter" strokeLinecap="square" />
        <rect x="23" y="4" width="3" height="3" fill="#19E07A" />
      </svg>
      {!compact && (
        <span className="font-display text-[15px] font-semibold uppercase tracking-[0.12em]" style={{ color: c }}>
          NEXT <span className="font-normal opacity-70">Capital</span>
        </span>
      )}
    </span>
  );
}

/** Filet de marque : six traits colorés (signal + quatre thèses + lime). */
export function FiletMarque({ className = "" }: { className?: string }) {
  const c = ["#19E07A", "#00D1FF", "#7A3BFF", "#3FD66B", "#FF5A1F", "#D8FF3D"];
  return <span className={`inline-flex gap-2 ${className}`} aria-hidden="true">{c.map((x) => <span key={x} className="block h-[2px] w-7" style={{ background: x }} />)}</span>;
}
