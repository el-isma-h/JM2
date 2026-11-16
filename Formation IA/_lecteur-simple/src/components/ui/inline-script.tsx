"use client";

/**
 * Script en ligne exécuté pendant l'analyse du HTML (avant le premier rendu), sans l'avertissement React 19
 * « Encountered a script tag while rendering React component » : `text/javascript` côté serveur, `text/plain`
 * (inerte) côté client, l'écart étant accepté par `suppressHydrationWarning`.
 * Modèle : node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md.
 */
export function InlineScript({ html }: { html: string }) {
  return <script type={typeof window === "undefined" ? "text/javascript" : "text/plain"} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
