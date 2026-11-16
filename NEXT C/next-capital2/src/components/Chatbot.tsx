"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";

interface Message { role: "user" | "assistant"; contenu: string }

export function Chatbot({ locale, t }: { locale: Locale; t: Dict["chatbot"] }) {
  const [ouvert, setOuvert] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [saisie, setSaisie] = useState("");
  const [enCours, setEnCours] = useState(false);
  const fin = useRef<HTMLDivElement>(null);

  useEffect(() => { fin.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, ouvert]);

  async function envoyer(texte: string) {
    const q = texte.trim();
    if (!q || enCours) return;
    const suivants: Message[] = [...messages, { role: "user", contenu: q }];
    setMessages(suivants);
    setSaisie("");
    setEnCours(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale, messages: suivants.slice(-10) }) });
      const j = (await r.json()) as { reponse: string };
      setMessages((m) => [...m, { role: "assistant", contenu: j.reponse }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", contenu: t.secours.defaut }]);
    } finally {
      setEnCours(false);
    }
  }

  return (
    <>
      <button onClick={() => setOuvert((v) => !v)} aria-label={ouvert ? t.fermer : t.ouvrir} className="fixed bottom-5 end-5 z-50 flex h-12 items-center gap-3 border border-os/20 bg-encre px-4 font-mono text-[10px] uppercase tracking-[0.24em] text-os transition hover:bg-signal hover:text-encre">
        {ouvert ? t.fermer : t.titre}
      </button>
      <AnimatePresence>
        {ouvert && (
          <motion.div initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} transition={{ duration: 0.22 }} role="dialog" aria-label={t.titre} className="fixed bottom-20 end-5 z-50 flex max-h-[70vh] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden border border-encre/20 bg-os">
            <div className="bg-encre px-4 py-3 text-os border-b border-os/10">
              <p className="font-display text-lg font-semibold uppercase tracking-tight">{t.titre}</p>
              <p className="text-xs text-os/70">{t.accroche}</p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm" data-lenis-prevent>
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {t.suggestions.map((s) => <button key={s} onClick={() => envoyer(s)} className="border border-encre/15 px-3 py-1.5 text-xs text-encre/80 hover:border-encre">{s}</button>)}
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`max-w-[88%]  px-3.5 py-2.5 ${m.role === "user" ? "ms-auto bg-encre text-os" : "bg-os text-encre"}`}>{m.contenu}</div>
              ))}
              {enCours && <div className="w-16 border border-encre/15 bg-os-2 px-3.5 py-2.5 text-pierre">…</div>}
              <div ref={fin} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); envoyer(saisie); }} className="border-t border-encre/10 p-2">
              <div className="flex gap-2">
                <input value={saisie} onChange={(e) => setSaisie(e.target.value)} placeholder={t.placeholder} className="champ !py-2" aria-label={t.placeholder} />
                <button type="submit" className="bouton-primaire !px-4 !py-2" disabled={enCours}>→</button>
              </div>
              <p className="mt-1.5 px-1 text-[10px] text-pierre">{t.avertissement}</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
