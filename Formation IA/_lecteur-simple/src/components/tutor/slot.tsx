"use client";

/**
 * Tuteur IA d'une leçon : bouton flottant « Demander au tuteur » + panneau latéral (plein écran sur mobile).
 * Réponses en streaming (POST /ia/api/tutor) rendues en Markdown, historique conservé pour la session de l'onglet.
 *
 *   <TutorSlot lessonId="L012" />
 */
import * as React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, ChatCircleDots, Key, Stop, Trash, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { celebrate } from "@/components/ui/celebrate";
import { routes, withBase } from "@/lib/paths";
import { PROVIDERS, isAiProvider } from "@/lib/ai";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string; error?: boolean };
type Status = { state: "loading" } | { state: "ready"; provider: string; source: string; model: string } | { state: "no_key" } | { state: "error"; message: string };

const SUGGESTIONS = ["Explique-moi autrement", "Donne un exemple dans mon métier", "Fais-moi un mini-quiz"];
const MAX_HISTORY = 20;

function storageKey(lessonId: string) {
  return `nfia-tutor-${lessonId}`;
}

function loadHistory(lessonId: string): Msg[] {
  try {
    const raw = sessionStorage.getItem(storageKey(lessonId));
    const v = raw ? (JSON.parse(raw) as Msg[]) : [];
    return Array.isArray(v) ? v.filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string") : [];
  } catch {
    return [];
  }
}

function providerLabel(p: string) {
  if (p === "simulation") return "Simulation";
  return isAiProvider(p) ? `${PROVIDERS[p].company} · ${PROVIDERS[p].name}` : p;
}

export function TutorSlot({ lessonId }: { lessonId: string }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<Status>({ state: "loading" });
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [loadedFor, setLoadedFor] = React.useState<string | null>(null);

  // Changement de leçon (navigation sans remontage) : on repart d'un panneau fermé.
  if (loadedFor !== null && loadedFor !== lessonId) {
    setLoadedFor(null);
    setMessages([]);
    setOpen(false);
  }

  // Historique de la session (sessionStorage), chargé à la première ouverture pour cette leçon.
  function openPanel() {
    if (loadedFor !== lessonId) {
      setMessages(loadHistory(lessonId));
      setLoadedFor(lessonId);
    }
    setOpen(true);
  }
  React.useEffect(() => {
    if (loadedFor !== lessonId) return;
    try {
      sessionStorage.setItem(storageKey(lessonId), JSON.stringify(messages.filter((m) => !m.error).slice(-MAX_HISTORY)));
    } catch {
      /* stockage indisponible : historique en mémoire seulement */
    }
  }, [messages, lessonId, loadedFor]);

  // État du tuteur à la première ouverture.
  React.useEffect(() => {
    if (!open || status.state !== "loading") return;
    let alive = true;
    fetch(withBase(routes.api.tutor), { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json();
        if (!alive) return;
        if (!r.ok) setStatus({ state: "error", message: "Session expirée : rechargez la page." });
        else if (d.available) setStatus({ state: "ready", provider: d.provider, source: d.source, model: d.model });
        else setStatus({ state: "no_key" });
      })
      .catch(() => alive && setStatus({ state: "error", message: "Le tuteur est injoignable. Vérifiez votre connexion." }));
    return () => {
      alive = false;
    };
  }, [open, status.state]);

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    const history = [...messages.filter((m) => !m.error), { role: "user" as const, content: q }].slice(-MAX_HISTORY);
    setMessages([...messages, { role: "user", content: q }, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const patchLast = (fn: (m: Msg) => Msg) => setMessages((all) => [...all.slice(0, -1), fn(all[all.length - 1])]);
    try {
      const res = await fetch(withBase(routes.api.tutor), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const d = await res.json().catch(() => ({}));
        if (d.error === "no_key") setStatus({ state: "no_key" });
        patchLast(() => ({ role: "assistant", content: d.message ?? "Le tuteur est indisponible pour le moment.", error: true }));
        return;
      }
      const badges = res.headers.get("X-New-Badges");
      if (badges) void celebrate();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        patchLast((m) => ({ ...m, content: m.content + text }));
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") patchLast((m) => ({ ...m, content: m.content || "La connexion a été interrompue. Réessayez.", error: !m.content }));
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  function clear() {
    stop();
    setMessages([]);
  }

  const panelMotion = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { duration: 0.42, ease: [0.165, 0.84, 0.44, 1] as const } };

  return (
    <>
      <AnimatePresence>
        {!open ? (
          <motion.button
            type="button"
            onClick={openPanel}
            className="fixed bottom-[calc(env(safe-area-inset-bottom)+76px)] right-4 z-30 inline-flex h-12 items-center gap-2.5 border border-ink bg-ink px-4 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-bg transition-colors duration-500 hover:border-accent hover:bg-accent hover:text-accent-ink sm:right-8 lg:bottom-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <ChatCircleDots size={18} weight="fill" aria-hidden />
            Demander au tuteur
            {messages.length ? <span className="num ml-1 border-l border-bg/30 pl-2.5 text-[10px] tracking-normal">{Math.ceil(messages.length / 2)}</span> : null}
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div className="fixed inset-0 z-40 bg-encre/40 lg:bg-encre/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Tuteur IA"
              className="fixed inset-0 z-50 flex flex-col border-line-strong bg-bg sm:inset-y-0 sm:left-auto sm:w-[460px] sm:border-l"
              {...panelMotion}
            >
              <header className="flex items-start justify-between gap-3 border-b border-line px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
                <div className="min-w-0">
                  <p className="font-display text-[17px] font-light uppercase tracking-[0.06em] text-ink">Tuteur IA</p>
                  <p className="mt-1 text-[12.5px] text-ink-3">
                    Leçon <span className="num text-ink-2">{lessonId}</span>
                    {status.state === "ready" ? <> · {providerLabel(status.provider)}</> : null}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length ? (
                    <button type="button" onClick={clear} className="inline-flex h-9 w-9 items-center justify-center text-ink-3 transition-colors hover:text-ink" aria-label="Effacer la conversation" title="Effacer la conversation">
                      <Trash size={17} />
                    </button>
                  ) : null}
                  <button type="button" onClick={() => setOpen(false)} className="inline-flex h-9 w-9 items-center justify-center text-ink-2 transition-colors hover:text-ink" aria-label="Fermer le tuteur">
                    <X size={18} />
                  </button>
                </div>
              </header>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 scrollbar-thin" aria-live="polite">
                {status.state === "loading" ? (
                  <p className="flex items-center gap-3 text-[13px] text-ink-3" role="status">
                    <Thinking /> Préparation du tuteur…
                  </p>
                ) : status.state === "no_key" ? (
                  <NoKey />
                ) : status.state === "error" ? (
                  <p className="border-s-2 border-danger px-4 py-3 text-[13.5px] text-danger-ink">{status.message}</p>
                ) : messages.length === 0 ? (
                  <Intro />
                ) : (
                  <ol className="space-y-5">
                    {messages.map((m, i) => (
                      <li key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                        {m.role === "user" ? (
                          <p className="max-w-[85%] whitespace-pre-wrap border border-line-strong bg-bg-sunken px-3.5 py-2.5 text-[14px] text-ink">{m.content}</p>
                        ) : (
                          <div className={cn("border-s-2 ps-4", m.error ? "border-danger text-danger-ink" : "border-accent")}>
                            {m.content ? (
                              <div className="prose-nf" style={{ fontSize: 14, lineHeight: 1.65 }}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a> }}>
                                  {m.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <Thinking />
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {status.state !== "no_key" ? (
                <footer className="border-t border-line px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
                  <div className="mb-3 flex gap-2 overflow-x-auto scrollbar-thin" role="group" aria-label="Suggestions">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={busy || status.state !== "ready"}
                        onClick={() => ask(s)}
                        className="shrink-0 border border-line-strong px-3 py-1.5 text-[12.5px] text-ink-2 transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-40"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <form
                    className="flex items-end gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void ask(input);
                    }}
                  >
                    <label htmlFor="tutor-input" className="sr-only">
                      Votre question
                    </label>
                    <textarea
                      id="tutor-input"
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void ask(input);
                        }
                      }}
                      rows={2}
                      maxLength={4000}
                      placeholder="Posez votre question sur la leçon…"
                      className="max-h-40 min-h-12 flex-1 resize-none border border-line-strong bg-transparent px-3 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-3/80 focus:border-ink"
                      disabled={status.state !== "ready"}
                    />
                    {busy ? (
                      <Button type="button" variant="secondary" size="icon" className="h-12 w-12" onClick={stop} aria-label="Arrêter la réponse">
                        <Stop size={16} weight="fill" />
                      </Button>
                    ) : (
                      <Button type="submit" size="icon" className="h-12 w-12" disabled={!input.trim() || status.state !== "ready"} aria-label="Envoyer la question">
                        <ArrowUp size={18} />
                      </Button>
                    )}
                  </form>
                  <p className="mt-2 text-[11.5px] text-ink-3">Le tuteur s’appuie sur cette leçon et peut se tromper. Il ne donne pas les réponses des examens.</p>
                </footer>
              ) : null}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function Intro() {
  return (
    <div className="pt-2">
      <p className="font-serif text-[22px] italic leading-snug text-ink">Une notion vous résiste ? Posez la question comme elle vous vient.</p>
      <p className="mt-4 max-w-[46ch] text-[13.5px] text-ink-2">
        Le tuteur a lu la leçon que vous êtes en train de suivre. Il peut la reformuler, l’illustrer avec votre métier ou vous interroger pour vérifier ce que vous avez retenu.
      </p>
    </div>
  );
}

function Thinking() {
  const reduce = useReducedMotion();
  return (
    <span className="inline-flex items-center gap-1.5 py-2" aria-label="Le tuteur rédige sa réponse">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 bg-accent"
          animate={reduce ? undefined : { opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  );
}

function NoKey() {
  return (
    <div className="pt-2">
      <Key size={30} weight="light" className="text-accent" aria-hidden />
      <p className="mt-4 font-display text-[16px] font-light uppercase tracking-[0.06em] text-ink">Le tuteur a besoin d’une clé API</p>
      <p className="mt-3 max-w-[46ch] text-[13.5px] text-ink-2">
        Aucune clé n’est configurée sur la plateforme. Vous pouvez utiliser la vôtre : chez Anthropic, OpenAI ou xAI, il faut un compte, quelques euros de crédit et une clé à copier. Comptez cinq minutes.
      </p>
      <ol className="mt-5 space-y-2 border-s border-line ps-4 text-[13px] text-ink-2">
        <li>1. Créez un compte chez le fournisseur de votre choix.</li>
        <li>2. Ajoutez un petit crédit (une session coûte moins d’un centime avec les modèles économiques).</li>
        <li>3. Créez la clé, copiez-la et enregistrez-la ici, chiffrée.</li>
      </ol>
      <Button asChild className="mt-6">
        <Link href={routes.apiKey}>Configurer ma clé API</Link>
      </Button>
      <p className="mt-4 text-[12px] text-ink-3">Vous pouvez aussi demander à votre formateur d’activer la clé de la plateforme.</p>
    </div>
  );
}
