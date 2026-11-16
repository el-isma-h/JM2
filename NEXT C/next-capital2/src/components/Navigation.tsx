"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "./Header";
import { BarreLaterale } from "./BarreLaterale";
import type { InfosSession } from "./MenuPleinEcran";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";

/** Écrans internes (espace investisseur, admin) : en-tête minimal. Vitrine : barre latérale. */
export function estInterne(chemin: string) { return /\/(compte|admin)(\/|$)/.test(chemin); }

export function Navigation(props: { locale: Locale; t: Dict; session: InfosSession | null }) {
  const chemin = usePathname();
  return estInterne(chemin) ? <Header {...props} /> : <BarreLaterale {...props} />;
}

/** Décale le contenu de la largeur de la barre latérale sur la vitrine (grand écran). */
export function Coque({ children }: { children: ReactNode }) {
  const chemin = usePathname();
  return <div className={`flex min-h-screen flex-1 flex-col ${estInterne(chemin) ? "" : "lg:ps-60"}`}>{children}</div>;
}
