"use client";
// src/app/page.tsx — interface de chat : envoie l'historique, lit le flux SSE et affiche le texte au fil de l'eau.
import { useRef, useState } from "react";
import type { Evenement } from "../lib/flux";
import { lireEvenementsSSE } from "../lib/sse";
import type { Message } from "../lib/validation";

export default function Page() {
  const [jeton, setJeton] = useState("");
  const [saisie, setSaisie] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [enCours, setEnCours] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const annulation = useRef<AbortController | null>(null);

  async function envoyer() {
    const question = saisie.trim();
    if (!question || enCours) return;
    const historique: Message[] = [...messages, { role: "user", content: question }];
    setMessages([...historique, { role: "assistant", content: "" }]);
    setSaisie("");
    setInfo(null);
    setEnCours(true);
    const ctrl = new AbortController();
    annulation.current = ctrl;
    const ajouter = (delta: string) =>
      setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: m[m.length - 1].content + delta }]);
    try {
      const rep = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${jeton}` },
        body: JSON.stringify({ messages: historique }),
        signal: ctrl.signal,
      });
      if (!rep.ok || !rep.body) {
        const corps = await rep.json().catch(() => ({ erreur: `HTTP ${rep.status}` }));
        setInfo(`Erreur ${rep.status} : ${corps.erreur}`);
        setMessages(historique);
        return;
      }
      for await (const ev of lireEvenementsSSE(rep.body)) {
        const e = JSON.parse(ev.data) as Evenement;
        if (e.type === "texte") ajouter(e.delta);
        else if (e.type === "erreur") setInfo(e.message);
        else if (e.type === "fin") setInfo(`${e.usage.input_tokens} + ${e.usage.output_tokens} tokens · ${e.coutUsd.toFixed(5)} $`);
      }
    } catch (e) {
      setInfo(ctrl.signal.aborted ? "Génération interrompue." : "Connexion perdue, réessayez.");
    } finally {
      setEnCours(false);
      annulation.current = null;
    }
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 22, margin: "0 0 4px" }}>Compta-Chat</h1>
      <p style={{ margin: "0 0 16px", color: "#5b6475" }}>Lab L105 — chat en streaming, prêt à déployer.</p>
      <label style={{ display: "block", fontSize: 14, marginBottom: 12 }}>
        Jeton de démonstration{" "}
        <input type="password" value={jeton} onChange={(e) => setJeton(e.target.value)}
          style={{ width: "100%", padding: 8, boxSizing: "border-box" }} autoComplete="off" />
      </label>
      <section aria-live="polite" style={{ minHeight: 240, background: "#fff", borderRadius: 8, padding: 16, marginBottom: 12 }}>
        {messages.length === 0 && <p style={{ color: "#8a93a5" }}>Posez une question. Essayez « #panne » ou « #lent ».</p>}
        {messages.map((m, i) => (
          <p key={i} style={{ whiteSpace: "pre-wrap", margin: "0 0 12px" }}>
            <strong>{m.role === "user" ? "Vous" : "Compta-Chat"} :</strong> {m.content}
          </p>
        ))}
      </section>
      <form onSubmit={(e) => { e.preventDefault(); void envoyer(); }} style={{ display: "flex", gap: 8 }}>
        <input value={saisie} onChange={(e) => setSaisie(e.target.value)} maxLength={2000}
          placeholder="Votre question" style={{ flex: 1, padding: 10 }} />
        {enCours
          ? <button type="button" onClick={() => annulation.current?.abort()}>Arrêter</button>
          : <button type="submit">Envoyer</button>}
      </form>
      {info && <p role="status" style={{ fontSize: 14, color: "#5b6475" }}>{info}</p>}
    </main>
  );
}
