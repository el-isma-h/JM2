import type { ReactNode } from "react";

export const metadata = { title: "Compta-Chat (lab L105)", description: "Chat en streaming déployable" };

export default function RacineLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f6f7f9", color: "#1d2433" }}>
        {children}
      </body>
    </html>
  );
}
