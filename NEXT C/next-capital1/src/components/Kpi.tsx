export function Kpi({ label, valeur, sous, accent = false }: { label: string; valeur: string; sous?: string; accent?: boolean }) {
  return (
    <div className={`${accent ? "sombre bg-encre text-os" : "carte"} p-6`}>
      <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${accent ? "text-os/50" : "text-pierre"}`}>{label}</p>
      <p className={`mt-3 font-display text-3xl font-semibold tracking-tight ${accent ? "text-signal" : ""}`}>{valeur}</p>
      {sous && <p className={`mt-1.5 text-xs ${accent ? "text-os/55" : "text-pierre"}`}>{sous}</p>}
    </div>
  );
}

export function Message({ type, texte }: { type: "ok" | "erreur" | "info"; texte: string }) {
  const c = type === "ok" ? "border-signal-2 text-signal-2" : type === "erreur" ? "border-rouge text-rouge" : "border-ia text-[#007fa0]";
  return <p className={`border-s-2 bg-os px-4 py-3 text-sm ${c}`}>{texte}</p>;
}

export function Titre({ children, sous }: { children: React.ReactNode; sous?: string }) {
  return <div className="mb-8 border-b border-encre/15 pb-6"><h1 className="text-4xl uppercase sm:text-5xl">{children}</h1>{sous && <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-pierre">{sous}</p>}</div>;
}
