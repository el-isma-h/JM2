"use client";

import { useState, type ReactNode } from "react";

export function OngletsDepot({ onglets }: { onglets: { id: string; label: string; contenu: ReactNode }[] }) {
  const [actif, setActif] = useState(onglets[0]?.id);
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {onglets.map((o) => (
          <button key={o.id} role="tab" aria-selected={actif === o.id} onClick={() => setActif(o.id)} className={` px-4 py-2 text-sm transition ${actif === o.id ? "bg-encre text-os" : "border border-encre/15 text-encre/70 hover:border-encre"}`}>{o.label}</button>
        ))}
      </div>
      {onglets.map((o) => <div key={o.id} role="tabpanel" hidden={actif !== o.id} className="mt-6">{o.contenu}</div>)}
    </div>
  );
}
