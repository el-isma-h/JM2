"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, BookmarkSimple, CheckCircle, CircleNotch, CloudSlash, GridFour, Warning, X } from "@phosphor-icons/react";
import type { TakingPayload } from "@/domain/exam-session";
import { saveExamAnswersAction, submitExamAction } from "@/server/actions/exams";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const TYPE_LABEL: Record<string, string> = { qcm: "QCM", vrai_faux: "Vrai ou faux", trouve_erreur: "Trouvez l'erreur", mise_en_situation: "Mise en situation" };
type SaveState = "idle" | "saving" | "saved" | "offline";

function fmtClock(sec: number) {
  const s = Math.max(0, sec);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * Passage d'un examen : chronomètre calé sur l'horloge serveur, sauvegarde automatique à chaque réponse,
 * navigation par numéros, marquage « à revoir », soumission manuelle (récapitulatif) ou automatique à 0.
 * Ne reçoit que des questions publiques (aucune bonne réponse côté client).
 */
export function ExamRunner({ payload, exitHref }: { payload: TakingPayload; exitHref: string }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { questions, attemptId } = payload;
  const total = questions.length;
  const deadline = React.useMemo(() => new Date(payload.deadlineAt).getTime(), [payload.deadlineAt]);
  const duration = deadline - new Date(payload.startedAt).getTime();

  const [answers, setAnswers] = React.useState<Record<string, number>>(payload.answers);
  const [flagged, setFlagged] = React.useState<Set<string>>(() => new Set(payload.flagged));
  const [index, setIndex] = React.useState(() => {
    const firstEmpty = questions.findIndex((q) => payload.answers[q.id] === undefined);
    return firstEmpty === -1 ? 0 : firstEmpty;
  });
  const [direction, setDirection] = React.useState(1);
  const [saveState, setSaveState] = React.useState<SaveState>("idle");
  const [navOpen, setNavOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [warnDismissed, setWarnDismissed] = React.useState(false);

  // ---- Horloge serveur ----
  const offset = React.useRef(0);
  const [now, setNow] = React.useState(() => new Date(payload.serverNow).getTime());
  React.useEffect(() => {
    offset.current = new Date(payload.serverNow).getTime() - Date.now();
    const tick = () => setNow(Date.now() + offset.current);
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [payload.serverNow]);
  const remaining = Math.max(0, Math.ceil((deadline - now) / 1000));
  const low = remaining <= 300;
  const critical = remaining <= 60;
  const showWarn = low && remaining > 0 && !warnDismissed;

  // ---- Sauvegarde (file séquentielle, dernière valeur par question) ----
  const queue = React.useRef(new Map<string, { choice?: number | null; flagged?: boolean }>());
  const running = React.useRef(false);
  const closedRef = React.useRef(false);
  const answersRef = React.useRef(answers);
  React.useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const submit = React.useCallback(
    async (auto: boolean) => {
      if (submitting && !auto) return;
      setSubmitting(true);
      setError(null);
      const final: Record<string, number | null> = {};
      for (const q of questions) final[q.id] = answersRef.current[q.id] ?? null;
      try {
        const r = await submitExamAction({ attemptId, answers: final });
        if (r.ok) {
          router.replace(r.url);
          return;
        }
        setError(r.error);
      } catch {
        setError("Connexion perdue. Vos réponses enregistrées sont conservées : réessayez dans un instant.");
      }
      setSubmitting(false);
    },
    [attemptId, questions, router, submitting],
  );

  const flush = React.useCallback(async () => {
    if (running.current) return;
    running.current = true;
    try {
      while (queue.current.size) {
        // Tout ce qui attend part en un seul appel (pas de file qui s'allonge si l'apprenant répond vite).
        const batch = [...queue.current.entries()].map(([questionId, u]) => ({ questionId, ...u }));
        queue.current.clear();
        setSaveState("saving");
        const sent = Date.now();
        try {
          const r = await saveExamAnswersAction({ attemptId, updates: batch });
          offset.current = new Date(r.serverNow).getTime() - (sent + Date.now()) / 2;
          if (!r.ok && r.reason === "closed") {
            closedRef.current = true;
            queue.current.clear();
            void submit(true);
            return;
          }
          setSaveState(queue.current.size ? "saving" : "saved");
        } catch {
          // Réseau : on remet le lot en file (sans écraser une valeur plus récente) et on réessaie.
          for (const { questionId, ...u } of batch) if (!queue.current.has(questionId)) queue.current.set(questionId, u);
          setSaveState("offline");
          await new Promise((res) => setTimeout(res, 3000));
        }
      }
    } finally {
      running.current = false;
    }
  }, [attemptId, submit]);

  // Fermeture / rechargement avec des réponses pas encore enregistrées : demande de confirmation.
  React.useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (queue.current.size || running.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const enqueue = React.useCallback(
    (questionId: string, update: { choice?: number | null; flagged?: boolean }) => {
      if (closedRef.current) return;
      const prev = queue.current.get(questionId) ?? {};
      queue.current.set(questionId, { ...prev, ...update });
      void flush();
    },
    [flush],
  );

  // ---- Soumission automatique à 0 ----
  const autoFired = React.useRef(false);
  React.useEffect(() => {
    if (remaining === 0 && !autoFired.current) {
      autoFired.current = true;
      setConfirmOpen(false);
      void submit(true);
    }
  }, [remaining, submit]);

  const q = questions[index];
  const choose = (i: number) => {
    if (submitting || remaining === 0) return;
    const same = answers[q.id] === i;
    setAnswers((a) => {
      const n = { ...a };
      if (same) delete n[q.id];
      else n[q.id] = i;
      return n;
    });
    enqueue(q.id, { choice: same ? null : i });
  };
  const toggleFlag = () => {
    const on = !flagged.has(q.id);
    setFlagged((f) => {
      const n = new Set(f);
      if (on) n.add(q.id);
      else n.delete(q.id);
      return n;
    });
    enqueue(q.id, { flagged: on });
  };
  const go = (i: number) => {
    const next = Math.max(0, Math.min(total - 1, i));
    setDirection(next >= index ? 1 : -1);
    setIndex(next);
    setNavOpen(false);
  };

  // Clavier : A–D / 1–4 répondre, ← → naviguer, R marquer.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (confirmOpen || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      const k = e.key.toLowerCase();
      const n = "abcdef".indexOf(k) !== -1 ? "abcdef".indexOf(k) : "123456".indexOf(k);
      if (n !== -1 && n < q.options.length) {
        e.preventDefault();
        choose(n);
      } else if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
      else if (k === "r") toggleFlag();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const answeredCount = questions.filter((x) => answers[x.id] !== undefined).length;
  const unanswered = questions.map((x, i) => ({ id: x.id, n: i + 1 })).filter((x) => answers[x.id] === undefined);
  const flaggedList = questions.map((x, i) => ({ id: x.id, n: i + 1 })).filter((x) => flagged.has(x.id));
  const timePct = Math.max(0, Math.min(100, ((deadline - now) / duration) * 100));

  const navigator = (
    <div>
      <div className="grid grid-cols-8 gap-1.5">
        {questions.map((x, i) => {
          const done = answers[x.id] !== undefined;
          const fl = flagged.has(x.id);
          const cur = i === index;
          return (
            <button
              key={x.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Question ${i + 1}${done ? ", répondue" : ", sans réponse"}${fl ? ", à revoir" : ""}`}
              aria-current={cur ? "step" : undefined}
              className={cn(
                "num relative flex aspect-square items-center justify-center border text-[12px] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                done ? "border-ink bg-ink text-bg" : "border-line-strong text-ink-2 hover:border-ink hover:text-ink",
                cur && "outline-2 outline-offset-2 outline-accent",
              )}
            >
              {i + 1}
              {fl ? <span className="absolute right-0 top-0 size-0 border-l-[9px] border-t-[9px] border-l-transparent border-t-accent" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
      <dl className="mt-5 grid grid-cols-3 border border-line text-[12px] text-ink-2">
        {[
          { k: "Répondues", v: answeredCount, mark: <span className="size-2.5 border border-ink bg-ink" aria-hidden /> },
          { k: "Vides", v: total - answeredCount, mark: <span className="size-2.5 border border-line-strong" aria-hidden /> },
          {
            k: "À revoir",
            v: flagged.size,
            mark: (
              <span className="relative size-2.5 border border-line-strong" aria-hidden>
                <span className="absolute right-0 top-0 size-0 border-l-[6px] border-t-[6px] border-l-transparent border-t-accent" />
              </span>
            ),
          },
        ].map((x, i) => (
          <div key={x.k} className={cn("px-3 py-2.5", i && "border-l border-line")}>
            <dd className="font-display text-[20px] font-light leading-none tabular-nums text-ink">{x.v}</dd>
            <dt className="mt-1.5 flex items-center gap-1.5">
              {x.mark}
              {x.k}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  );

  return (
    <section className="fixed inset-0 z-[35] flex flex-col bg-bg" aria-label={payload.title}>
      {/* Barre supérieure */}
      <header className="relative flex h-16 shrink-0 items-center gap-3 border-b border-line px-4 sm:px-6">
        <div className="hidden min-w-0 flex-1 items-center gap-4 md:flex">
          <Logo taille={20} />
          <span className="h-6 w-px bg-line" aria-hidden />
          <span className="truncate text-[12.5px] text-ink-2">Examen · niveau {payload.levelId.slice(1)}</span>
        </div>
        <div className="flex flex-1 items-center md:justify-center">
          <div
            role="timer"
            aria-live="off"
            aria-label={`Temps restant ${fmtClock(remaining)}`}
            className={cn("font-display tabular-nums text-[30px] font-light leading-none tracking-[0.04em] transition-colors duration-700", critical ? "text-danger-ink" : low ? "text-warn-ink" : "text-ink")}
          >
            {fmtClock(remaining)}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <SaveIndicator state={saveState} />
          <Button variant="primary" size="sm" onClick={() => setConfirmOpen(true)} disabled={submitting || remaining === 0}>
            Terminer
          </Button>
        </div>
        {/* Temps restant en filet */}
        <span className="absolute inset-x-0 bottom-[-1px] h-px bg-line" aria-hidden>
          <span className={cn("block h-px transition-[width] duration-1000 ease-linear", critical ? "bg-danger" : low ? "bg-warn" : "bg-accent")} style={{ width: `${timePct}%` }} />
        </span>
      </header>

      <AnimatePresence>
        {showWarn ? (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="shrink-0 overflow-hidden border-b border-warn/60 bg-warn-soft"
            role="alert"
          >
            <div className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-warn-ink sm:px-6">
              <Warning size={16} weight="bold" aria-hidden />
              <span className="flex-1">
                Plus que 5 minutes. {total - answeredCount > 0 ? `${total - answeredCount} question${total - answeredCount > 1 ? "s" : ""} sans réponse.` : "Toutes les questions ont une réponse."} À zéro, l&apos;examen est envoyé automatiquement.
              </span>
              <button type="button" onClick={() => setWarnDismissed(true)} aria-label="Masquer l'alerte" className="p-1 hover:text-ink">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-4 pb-28 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:pb-12 lg:pt-12">
          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="font-display text-[13px] font-normal uppercase tracking-[0.14em] text-ink">
                Question <span className="tabular-nums">{index + 1}</span>
                <span className="text-ink-3"> / {total}</span>
              </p>
              <span className="text-[12px] text-ink-3">
                {TYPE_LABEL[q.type] ?? q.type} · compétence {q.competence}
              </span>
              <button
                type="button"
                onClick={toggleFlag}
                aria-pressed={flagged.has(q.id)}
                className={cn(
                  "ml-auto inline-flex items-center gap-1.5 border px-2.5 py-1 text-[12px] transition-colors duration-300",
                  flagged.has(q.id) ? "border-accent bg-accent-soft text-accent" : "border-line-strong text-ink-2 hover:border-ink hover:text-ink",
                )}
              >
                <BookmarkSimple size={13} weight={flagged.has(q.id) ? "fill" : "regular"} aria-hidden />
                {flagged.has(q.id) ? "À revoir" : "Marquer à revoir"}
              </button>
            </div>

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={q.id}
                custom={direction}
                initial={reduce ? false : { opacity: 0, x: 18 * direction }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -18 * direction }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <p id={`enonce-${q.id}`} role="heading" aria-level={1} data-enonce className="max-w-[68ch] text-[18px] leading-[1.5] text-ink sm:text-[20px]" style={{ textWrap: "pretty" }}>
                  {q.q}
                </p>
                <fieldset className="mt-8" aria-labelledby={`enonce-${q.id}`}>
                  <div className="grid gap-2">
                    {q.options.map((opt, i) => {
                      const sel = answers[q.id] === i;
                      return (
                        <label
                          key={i}
                          className={cn(
                            "group relative flex cursor-pointer items-start gap-4 border px-4 py-3.5 transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
                            sel ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong hover:bg-bg-elev",
                          )}
                        >
                          <input type="radio" name={`q-${q.id}`} className="sr-only" checked={sel} onChange={() => choose(i)} onClick={() => sel && choose(i)} />
                          <span
                            className={cn(
                              "num flex size-7 shrink-0 items-center justify-center border text-[12px] transition-colors duration-300",
                              sel ? "border-accent bg-accent text-accent-ink" : "border-line-strong text-ink-2 group-hover:border-ink",
                            )}
                            aria-hidden
                          >
                            {LETTERS[i]}
                          </span>
                          <span className="pt-0.5 text-[14.5px] leading-relaxed text-ink">{opt}</span>
                          {sel ? (
                            <motion.span layoutId="choice-mark" className="absolute inset-y-0 left-0 w-[3px] bg-accent" transition={{ type: "spring", stiffness: 500, damping: 40 }} aria-hidden />
                          ) : null}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
              <Button variant="ghost" onClick={() => go(index - 1)} disabled={index === 0}>
                <ArrowLeft size={14} aria-hidden /> Précédente
              </Button>
              <p className="hidden text-[12px] text-ink-3 sm:block">Touches A–D pour répondre, ← → pour naviguer, R pour marquer</p>
              {index < total - 1 ? (
                <Button variant="secondary" onClick={() => go(index + 1)}>
                  Suivante <ArrowRight size={14} aria-hidden />
                </Button>
              ) : (
                <Button variant="primary" onClick={() => setConfirmOpen(true)} disabled={submitting}>
                  Terminer l&apos;examen
                </Button>
              )}
            </div>
            {error ? (
              <p className="mt-4 border-s-2 border-danger px-3 py-2 text-[13px] text-danger-ink" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <aside className="hidden lg:block" aria-label="Navigation entre les questions">
            <div className="sticky top-0">
              <p className="mb-3 text-[12px] text-ink-3">
                <span className="num text-ink">{answeredCount}</span> sur {total} répondues
              </p>
              {navigator}
              <a href={exitHref} className="mt-8 inline-block text-[12px] text-ink-3 underline-offset-4 hover:text-ink hover:underline">
                Quitter (le chronomètre continue)
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile : barre basse + tiroir des numéros */}
      <div className="shrink-0 border-t border-line bg-bg px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 lg:hidden">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setNavOpen(true)} className="flex flex-1 items-center gap-2 border border-line-strong px-3 py-2.5 text-[13px] text-ink">
            <GridFour size={16} aria-hidden />
            <span>
              Questions · <span className="num">{answeredCount}</span>/{total}
            </span>
            {flagged.size ? <span className="ml-auto text-[12px] text-accent">{flagged.size} à revoir</span> : null}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {navOpen ? (
          <>
            <motion.div className="fixed inset-0 z-[36] bg-encre/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNavOpen(false)} />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-[37] pb-[max(env(safe-area-inset-bottom),20px)] border-t border-line-strong bg-bg px-4 pt-4 lg:hidden"
              initial={reduce ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 420, damping: 40 }}
              role="dialog"
              aria-label="Questions"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[13px] text-ink">Aller à la question</p>
                <button type="button" onClick={() => setNavOpen(false)} className="p-1 text-ink-2" aria-label="Fermer">
                  <X size={16} />
                </button>
              </div>
              {navigator}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <Dialog open={confirmOpen} onOpenChange={(o) => !submitting && setConfirmOpen(o)}>
        <DialogContent
          title="Terminer l'examen ?"
          description={unanswered.length ? `${unanswered.length} question${unanswered.length > 1 ? "s" : ""} sans réponse : elle${unanswered.length > 1 ? "s" : ""} compter${unanswered.length > 1 ? "ont" : "a"} comme fausse${unanswered.length > 1 ? "s" : ""}.` : "Toutes les questions ont une réponse."}
        >
          {unanswered.length ? (
            <RecapList label="Sans réponse" items={unanswered} onPick={(n) => (setConfirmOpen(false), go(n - 1))} />
          ) : null}
          {flaggedList.length ? <RecapList label="Marquées à revoir" items={flaggedList} onPick={(n) => (setConfirmOpen(false), go(n - 1))} accent /> : null}
          <p className="mt-5 text-[13px] text-ink-2">
            Temps restant : <span className="num text-ink">{fmtClock(remaining)}</span>. Après l&apos;envoi, vous ne pourrez plus modifier vos réponses.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button variant="ghost" disabled={submitting}>
                Continuer l&apos;examen
              </Button>
            </DialogClose>
            <Button variant="accent" loading={submitting} onClick={() => void submit(false)}>
              Envoyer mes réponses
            </Button>
          </div>
          {error ? (
            <p className="mt-4 text-[13px] text-danger-ink" role="alert">
              {error}
            </p>
          ) : null}
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {submitting && remaining === 0 ? (
          <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/95" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center">
              <CircleNotch size={28} className="mx-auto animate-spin text-accent" aria-hidden />
              <p className="mt-4 font-display text-[18px] font-light uppercase tracking-[0.08em] text-ink">Temps écoulé</p>
              <p className="mt-2 text-[13.5px] text-ink-2">Envoi de vos réponses enregistrées…</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function RecapList({ label, items, onPick, accent }: { label: string; items: { id: string; n: number }[]; onPick: (n: number) => void; accent?: boolean }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-[12px] text-ink-3">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => onPick(x.n)}
            className={cn("num flex h-8 min-w-8 items-center justify-center border px-2 text-[12px] transition-colors hover:border-ink hover:text-ink", accent ? "border-accent text-accent" : "border-line-strong text-ink-2")}
          >
            {x.n}
          </button>
        ))}
      </div>
    </div>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  const map = {
    idle: { icon: null, text: "Réponses enregistrées automatiquement", cls: "text-ink-3" },
    saving: { icon: <CircleNotch size={13} className="animate-spin" aria-hidden />, text: "Enregistrement…", cls: "text-ink-3" },
    saved: { icon: <CheckCircle size={13} aria-hidden />, text: "Enregistré", cls: "text-ok-ink" },
    offline: { icon: <CloudSlash size={13} aria-hidden />, text: "Hors ligne, nouvel essai…", cls: "text-warn-ink" },
  }[state];
  return (
    <span className={cn("hidden items-center gap-1.5 text-[12px] sm:inline-flex", map.cls)} role="status" aria-live="polite">
      {map.icon}
      <span className="hidden xl:inline">{map.text}</span>
      <span className="xl:hidden">{state === "idle" ? "" : map.text}</span>
    </span>
  );
}
