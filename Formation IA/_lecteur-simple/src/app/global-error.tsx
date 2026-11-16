"use client";

/** Erreur dans le layout racine : page autonome (styles en ligne, la feuille globale peut ne pas être chargée). */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#f3f0e8", color: "#0a0b0d", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "#8e8b83" }}>Next Formation · IA</p>
          <h1 style={{ fontWeight: 300, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 28, margin: "16px 0 8px" }}>Service momentanément indisponible</h1>
          <p style={{ color: "#5c5b61", fontSize: 14, maxWidth: 420 }}>Réessayez dans un instant.</p>
          <button
            onClick={reset}
            style={{ marginTop: 24, border: "1px solid #0a0b0d", background: "#0a0b0d", color: "#f3f0e8", padding: "10px 18px", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 11, cursor: "pointer" }}
          >
            Réessayer
          </button>
        </main>
      </body>
    </html>
  );
}
