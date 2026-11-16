"use client";

import * as React from "react";

/**
 * Diagramme Mermaid rendu côté client (import dynamique : mermaid n'est chargé que si la page en contient un).
 * Thème aligné sur la marque, recalculé au changement clair / sombre. En cas d'erreur : code source affiché.
 */
let counter = 0;

export function MermaidDiagram({ code }: { code: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState(false);
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: "Inter Variable, Inter, system-ui, sans-serif",
          themeVariables: dark
            ? { background: "#121418", primaryColor: "#1a1d22", primaryTextColor: "#f3f0e8", primaryBorderColor: "#b9a3ea", lineColor: "#8e8b83", secondaryColor: "#0e1013", tertiaryColor: "#121418" }
            : { background: "#f7f5ef", primaryColor: "#eae6dc", primaryTextColor: "#0a0b0d", primaryBorderColor: "#4b2a7f", lineColor: "#5c5b61", secondaryColor: "#f3f0e8", tertiaryColor: "#f7f5ef" },
        });
        const { svg } = await mermaid.render(`mermaid-${++counter}`, code);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, dark]);

  if (error) return <pre>{code}</pre>;
  return <div ref={ref} className="mermaid-figure" role="img" aria-label="Diagramme" />;
}
