import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "@fontsource-variable/outfit";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "HPT Coffre-fort", template: "%s · HPT Coffre-fort" },
  description: "Coffre-fort numérique sécurisé de HPT GIE.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#080808", colorScheme: "dark" };

export default async function RacineLayout({ children }: { children: React.ReactNode }) {
  // Lecture des en-têtes : force le rendu dynamique, nécessaire pour que Next.js applique le nonce CSP à ses scripts.
  await headers();
  return (
    <html lang="fr">
      <body className="min-h-[100dvh]">{children}</body>
    </html>
  );
}
