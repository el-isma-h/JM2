export function BandeauDemo({ texte }: { texte: string }) {
  return (
    <div className="border-b border-os/10 bg-encre text-center font-mono text-[10px] uppercase tracking-[0.14em] text-os/70">
      <div className="conteneur flex items-center justify-center gap-3 py-1.5"><span className="bg-signal px-1.5 py-px text-[9px] font-semibold text-encre">Démo</span><span className="truncate normal-case tracking-normal">{texte}</span></div>
    </div>
  );
}
