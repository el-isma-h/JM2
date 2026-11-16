import { ImageResponse } from "next/og";
import { TAILLE_PARTAGE, textes } from "@/lib/partage";

export { TAILLE_PARTAGE, altPartage } from "@/lib/partage";

export function imagePartage(locale: string): ImageResponse {
  const tx = textes(locale);
  const bandes = ["#19E07A", "#00D1FF", "#7A3BFF", "#3FD66B", "#FF5A1F", "#D8FF3D"];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0A0B0D", color: "#F3F0E8", padding: "72px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="96" height="96" viewBox="0 0 32 32">
            <path d="M6 28V4l20 24V4" fill="none" stroke="#F3F0E8" strokeWidth="2.6" strokeLinecap="square" />
            <rect x="23" y="4" width="3" height="3" fill="#19E07A" />
          </svg>
          <div style={{ display: "flex", fontSize: 44, letterSpacing: 8, textTransform: "uppercase" }}>NEXT Capital</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 300, letterSpacing: 2, lineHeight: 1.05, maxWidth: 1000 }}>{tx.sous}</div>
          <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
            {bandes.map((c) => <div key={c} style={{ width: 56, height: 4, background: c }} />)}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#8E8B83" }}>{tx.demo}</div>
      </div>
    ),
    TAILLE_PARTAGE,
  );
}
