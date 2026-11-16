"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavCompte({ base, liens }: { base: string; liens: [string, string][] }) {
  const chemin = usePathname();
  return (
    <nav className="mt-6 flex gap-4 overflow-x-auto border-t border-encre/15 pt-4 lg:flex-col lg:gap-0 lg:pt-0" aria-label="Espace">
      {liens.map(([s, l], i) => {
        const href = s ? `${base}/${s}` : base;
        const actif = s ? chemin.startsWith(href) : chemin === base;
        return (
          <Link key={s} href={href} className={`flex items-center gap-3 whitespace-nowrap py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] transition lg:border-b lg:border-encre/10 ${actif ? "text-encre" : "text-pierre hover:text-encre"}`}>
            <span className={`hidden h-px w-3 lg:block ${actif ? "bg-signal" : "bg-transparent"}`} />
            <span className="opacity-50">0{i + 1}</span>{l}
          </Link>
        );
      })}
    </nav>
  );
}
