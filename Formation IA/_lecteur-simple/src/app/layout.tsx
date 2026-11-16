import type { Metadata, Viewport } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { THEME_SCRIPT } from "@/components/ui/theme-toggle";
import { InlineScript } from "@/components/ui/inline-script";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Next Formation IA", template: "%s · Next Formation IA" },
  description: "Formation IA complète NF-IA-150 — de zéro à expert : 4 niveaux, 30 modules, 150 leçons.",
  applicationName: "Next Formation IA",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f0e8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0d" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <InlineScript html={THEME_SCRIPT} />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
