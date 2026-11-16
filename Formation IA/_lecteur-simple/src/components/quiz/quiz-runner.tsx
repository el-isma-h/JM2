"use client";

/**
 * Lecteur de quiz de module : une question à la fois, options en cartes (clavier 1-4, Entrée pour valider),
 * correction de chaque question par server action (la bonne réponse n'arrive qu'après validation), puis
 * soumission corrigée à nouveau côté serveur (quiz_attempts, XP, badges, déblocage du module suivant).
 * Reçoit uniquement un PublicQuiz (sans réponses ni explications).
 */
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowCounterClockwise, ArrowRight, ArrowSquareOut, Check, Heart, LockOpen, X, XCircle } from "@phosphor-icons/react";
import type { PublicQuizQuestion } from "@/content/types";
import { heartsLeft, QUIZ_HEARTS } from "@/domain/quiz";
import { correctCount, initialQuizState, keyToChoice, mistakeCount, quizProgress, quizReducer } from "@/lib/quiz-session";
import { checkQuizAnswerAction, submitQuizAction, type SubmitQuizResult } from "@/server/actions/learning";
import { Button } from "@/components/ui/button";
import { Progress, ProgressRing } from "@/components/ui/progress";
import { celebrate } from "@/components/ui/celebrate";
import { announceRewards, toast } from "@/components/feedback/toaster";
import { BadgeIcon } from "@/components/badges/badge-icon";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = { qcm: "Choix multiple", vrai_faux: "Vrai ou faux", trouve_erreur: "Trouvez l'erreur", mise_en_situation: "Mise en situation" };

type Done = Extract<SubmitQuizResult, { ok: true }>;

export function QuizRunner({ moduleId, moduleTitle, questions, exitHref }: { moduleId: string; moduleTitle: string; questions: PublicQuizQuestion[]; exitHref: string }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [s, dispatch] = React.useReducer(quizReducer, questions.length, initialQuizState);
  const [result, setResult] = React.useState<Done | null>(null);
  const [showMistakes, setShowMistakes] = React.useState(false);
  const [attempt, setAttempt] = React.useState(0);
  const q = questions[s.index];
  const fb = q ? s.feedback[q.id] : undefined;
  const continueRef = React.useRef<HTMLButtonElement>(null);

  const check = React.useCallback(async () => {
    if (!q || s.phase !== "answering" || s.selected === null) return;
    dispatch({ type: "check" });
    try {
      const r = await checkQuizAnswerAction(moduleId, q.id, s.selected);
      if (!r.ok) dispatch({ type: "failed", error: r.error });
      else dispatch({ type: "checked", questionId: q.id, feedback: { correct: r.correct, answer: r.answer, explanation: r.explanation, source: r.source } });
    } catch {
      dispatch({ type: "failed", error: "Connexion perdue. Réessayez." });
    }
  }, [moduleId, q, s.phase, s.selected]);

  // Soumission finale
  React.useEffect(() => {
    if (s.phase !== "submitting") return;
    let cancelled = false;
    (async () => {
      try {
        const r = await submitQuizAction(moduleId, s.choices);
        if (cancelled) return;
        if (!r.ok) {
          toast({ kind: "error", title: r.error });
          dispatch({ type: "failed", error: r.error });
          return;
        }
        setResult(r);
        dispatch({ type: "submitted" });
        if (r.passed) void celebrate(r.perfect ? "big" : "small");
        announceRewards(r.rewards);
        router.refresh();
      } catch {
        if (!cancelled) dispatch({ type: "failed", error: "Connexion perdue : le résultat n'a pas été enregistré." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [s.phase, s.choices, moduleId, router, attempt]);

  React.useEffect(() => {
    if (s.phase === "feedback") continueRef.current?.focus({ preventScroll: true });
  }, [s.phase]);

  // Clavier : 1-4 pour choisir, Entrée pour vérifier / continuer.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || !q) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      const c = keyToChoice(e.key, q.options.length);
      if (c !== null && s.phase === "answering") {
        e.preventDefault();
        dispatch({ type: "select", choice: c });
        return;
      }
      if (e.key === "Enter" && !(t && (t.tagName === "BUTTON" || t.tagName === "A"))) {
        if (s.phase === "answering") void check();
        else if (s.phase === "feedback") dispatch({ type: "next" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, s.phase, check]);

  const restart = () => {
    setResult(null);
    setShowMistakes(false);
    setAttempt((a) => a + 1);
    dispatch({ type: "restart" });
    window.scrollTo({ top: 0 });
  };

  if (s.phase === "result" && result) {
    return <QuizResultView result={result} questions={questions} state={s} showMistakes={showMistakes} onToggleMistakes={() => setShowMistakes((v) => !v)} onRestart={restart} moduleTitle={moduleTitle} />;
  }

  const mistakes = mistakeCount(s);
  const hearts = heartsLeft(mistakes);

  return (
    <div className="mx-auto max-w-[720px]">
      {/* Barre de progression */}
      <div className="flex items-center gap-4">
        <Link href={exitHref} className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-line text-ink-2 transition-colors hover:border-ink hover:text-ink" aria-label="Quitter le quiz">
          <X size={16} />
        </Link>
        <Progress value={quizProgress(s) * 100} size="lg" className="flex-1" label="Progression du quiz" />
        <div className="flex items-center gap-1" aria-label={`${hearts} cœurs sur ${QUIZ_HEARTS} (non bloquants)`} title="Cœurs décoratifs : le quiz continue même à zéro">
          {Array.from({ length: QUIZ_HEARTS }, (_, i) => (
            <motion.span key={i} animate={i >= hearts && !reduce ? { scale: [1, 1.4, 1] } : undefined} transition={{ duration: 0.35 }}>
              <Heart size={16} weight={i < hearts ? "fill" : "regular"} className={i < hearts ? "text-accent" : "text-ink-3"} aria-hidden />
            </motion.span>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
        <span>
          Question <span className="num text-ink">{s.index + 1}</span> / {questions.length}
        </span>
        <span aria-live="polite">
          <span className="num text-ok-ink">{correctCount(s)}</span> bonne{correctCount(s) > 1 ? "s" : ""} réponse{correctCount(s) > 1 ? "s" : ""}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {q ? (
          <motion.section
            key={`${attempt}-${q.id}`}
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.165, 0.84, 0.44, 1] }}
            className="mt-8"
            aria-labelledby="quiz-question"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">{TYPE_LABEL[q.type] ?? "Question"}</p>
            <p id="quiz-question" role="heading" aria-level={2} className="mt-3 max-w-[60ch] text-[18px] font-medium leading-snug text-ink sm:text-[21px]">
              {q.q}
            </p>

            <div role="radiogroup" aria-labelledby="quiz-question" className="mt-7 grid gap-2.5">
              {q.options.map((opt, i) => (
                <OptionCard
                  key={i}
                  index={i}
                  text={opt}
                  selected={s.selected === i || (fb !== undefined && s.choices[q.id] === i)}
                  disabled={s.phase !== "answering"}
                  verdict={fb ? (i === fb.answer ? "right" : s.choices[q.id] === i ? "wrong" : "none") : null}
                  onSelect={() => dispatch({ type: "select", choice: i })}
                />
              ))}
            </div>

            {s.error ? (
              <p className="mt-4 text-[13px] text-danger-ink" role="alert">
                {s.error}
              </p>
            ) : null}

            {!fb ? (
              <div className="mt-8 flex items-center justify-between gap-4">
                <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 sm:block">Touches 1–{q.options.length} puis Entrée</p>
                <Button size="lg" onClick={() => void check()} disabled={s.selected === null} loading={s.phase === "checking"} className="w-full sm:w-auto">
                  Vérifier
                </Button>
              </div>
            ) : null}
          </motion.section>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {fb && q ? (
          <motion.div
            key={`fb-${q.id}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className={cn("sticky bottom-[calc(env(safe-area-inset-bottom)+4.75rem)] z-10 mt-8 border-l-2 bg-bg-elev p-5 shadow-[var(--shadow-2)] sm:p-6 lg:bottom-6", fb.correct ? "border-ok" : "border-danger")}
            role="status"
          >
            <div className="flex items-start gap-3">
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center", fb.correct ? "bg-ok-soft text-ok-ink" : "bg-danger-soft text-danger-ink")}>
                {fb.correct ? <Check size={16} weight="bold" aria-hidden /> : <X size={16} weight="bold" aria-hidden />}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("font-display text-[16px] font-light uppercase tracking-[0.06em]", fb.correct ? "text-ok-ink" : "text-danger-ink")}>{fb.correct ? "Bonne réponse" : "Pas tout à fait"}</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{fb.explanation}</p>
                {fb.source ? (
                  <a href={fb.source.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-accent underline decoration-1 underline-offset-4 hover:decoration-2">
                    {fb.source.title} <ArrowSquareOut size={12} aria-hidden />
                  </a>
                ) : null}
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button ref={continueRef} size="lg" variant={fb.correct ? "primary" : "secondary"} onClick={() => dispatch({ type: "next" })} className="w-full sm:w-auto">
                {s.index + 1 >= questions.length ? "Voir mon résultat" : "Continuer"} <ArrowRight size={14} aria-hidden />
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {s.phase === "submitting" ? (
        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3" role="status">
          {s.error ? (
            <>
              {s.error}{" "}
              <button type="button" className="ml-2 text-accent underline" onClick={() => setAttempt((a) => a + 1)}>
                Réessayer
              </button>
            </>
          ) : (
            "Enregistrement du résultat…"
          )}
        </p>
      ) : null}
    </div>
  );
}

function OptionCard({ index, text, selected, disabled, verdict, onSelect }: { index: number; text: string; selected: boolean; disabled: boolean; verdict: "right" | "wrong" | "none" | null; onSelect: () => void }) {
  const reduce = useReducedMotion();
  const anim = verdict === "wrong" && !reduce ? { x: [0, -7, 7, -4, 4, 0] } : verdict === "right" && !reduce ? { scale: [1, 1.02, 1] } : undefined;
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      onClick={() => !disabled && onSelect()}
      animate={anim}
      transition={{ duration: 0.4 }}
      className={cn(
        "group flex w-full items-start gap-4 border bg-bg-elev px-4 py-3.5 text-left text-[14.5px] leading-snug transition-[border-color,background-color,color] duration-200",
        verdict === null && (selected ? "border-ink bg-bg-sunken" : "border-line-strong hover:border-ink hover:bg-bg-sunken"),
        verdict === "right" && "border-ok bg-ok-soft",
        verdict === "wrong" && "border-danger bg-danger-soft",
        verdict === "none" && "border-line opacity-55",
        disabled ? "cursor-default" : "cursor-pointer",
      )}
    >
      <span
        className={cn(
          "num flex h-7 w-7 shrink-0 items-center justify-center border text-[12px]",
          verdict === "right" ? "border-ok bg-ok text-bg" : verdict === "wrong" ? "border-danger bg-danger text-bg" : selected ? "border-ink bg-ink text-bg" : "border-line-strong text-ink-2",
        )}
        aria-hidden
      >
        {verdict === "right" ? <Check size={13} weight="bold" /> : verdict === "wrong" ? <X size={13} weight="bold" /> : index + 1}
      </span>
      <span className="min-w-0 flex-1 pt-0.5 text-ink">{text}</span>
    </motion.button>
  );
}

function QuizResultView({
  result,
  questions,
  state,
  showMistakes,
  onToggleMistakes,
  onRestart,
  moduleTitle,
}: {
  result: Done;
  questions: PublicQuizQuestion[];
  state: ReturnType<typeof initialQuizState>;
  showMistakes: boolean;
  onToggleMistakes: () => void;
  onRestart: () => void;
  moduleTitle: string;
}) {
  const reduce = useReducedMotion();
  const wrong = questions.filter((q) => state.feedback[q.id] && !state.feedback[q.id].correct);
  const title = result.perfect ? "Sans faute" : result.passed ? "Quiz réussi" : "Pas encore";
  const sub = result.passed
    ? result.perfect
      ? "Toutes les réponses sont justes."
      : `Seuil de ${result.passScore} % atteint.`
    : `Il faut ${result.passScore} % pour valider le module. Relisez vos erreurs et retentez : les essais sont illimités.`;

  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-[720px]">
      <div className="border border-line bg-bg-elev p-6 text-center sm:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">{moduleTitle}</p>
        <div className="mt-8 flex justify-center">
          <ProgressRing value={result.percent} max={100} size={168} stroke={4}>
            <span className="flex flex-col items-center">
              <span className="num text-[40px] leading-none text-ink">
                {result.score}
                <span className="text-[18px] text-ink-3">/{result.total}</span>
              </span>
              <span className="num mt-1 text-[12px] text-ink-3">{result.percent} %</span>
            </span>
          </ProgressRing>
        </div>
        <motion.h2
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 20 }}
          className={cn("mt-8 text-[30px] sm:text-[38px]", result.passed ? "text-ink" : "text-ink-2")}
        >
          {title}
        </motion.h2>
        <p className="mx-auto mt-3 max-w-[48ch] text-[13.5px] text-ink-2">{sub}</p>

        {result.rewards.xp > 0 ? (
          <motion.p initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="num mt-6 inline-flex items-center gap-2 border border-accent/40 bg-accent-soft px-3 py-1.5 text-[14px] text-accent">
            +{result.rewards.xp} XP
          </motion.p>
        ) : result.passed ? (
          <p className="mt-6 text-[12px] text-ink-3">XP déjà accordés pour ce quiz.</p>
        ) : null}

        {result.unlockedModule ? (
          <p className="mx-auto mt-5 flex max-w-[46ch] items-center justify-center gap-2 text-[13px] text-ink">
            <LockOpen size={16} className="text-accent" aria-hidden />
            Module débloqué : {result.unlockedModule.title}
          </p>
        ) : null}

        {result.rewards.badges.length ? (
          <ul className="mx-auto mt-6 flex max-w-[520px] flex-wrap justify-center gap-3">
            {result.rewards.badges.map((b, i) => (
              <motion.li
                key={b.id}
                initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.12, type: "spring", stiffness: 380, damping: 18 }}
                className="flex items-center gap-3 border border-accent bg-bg px-3 py-2 text-left"
              >
                <span className="flex h-8 w-8 items-center justify-center bg-accent text-accent-ink">
                  <BadgeIcon name={b.icon} size={18} weight="regular" />
                </span>
                <span>
                  <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-3">Badge obtenu</span>
                  <span className="block text-[13px] text-ink">{b.title}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        ) : null}

        <div className="mt-10 flex flex-col-reverse justify-center gap-2.5 sm:flex-row">
          {wrong.length ? (
            <Button variant="ghost" size="lg" onClick={onToggleMistakes} aria-expanded={showMistakes} aria-controls="quiz-mistakes">
              <XCircle size={15} aria-hidden /> {showMistakes ? "Masquer mes erreurs" : `Revoir mes erreurs (${wrong.length})`}
            </Button>
          ) : null}
          <Button variant="secondary" size="lg" onClick={onRestart}>
            <ArrowCounterClockwise size={15} aria-hidden /> Recommencer
          </Button>
          <Button asChild size="lg" variant={result.passed ? "accent" : "primary"}>
            <Link href={result.continueHref}>
              {result.continueLabel} <ArrowRight size={14} aria-hidden />
            </Link>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showMistakes ? (
          <motion.ol id="quiz-mistakes" initial={reduce ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={reduce ? undefined : { opacity: 0, height: 0 }} className="mt-6 space-y-4 overflow-hidden">
            {wrong.map((q) => {
              const f = state.feedback[q.id];
              const mine = state.choices[q.id];
              return (
                <li key={q.id} className="border border-line bg-bg-elev p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">Question {questions.indexOf(q) + 1}</p>
                  <p className="mt-2 text-[14.5px] font-medium text-ink">{q.q}</p>
                  <p className="mt-3 flex gap-2 text-[13px] text-danger-ink">
                    <X size={14} weight="bold" className="mt-0.5 shrink-0" aria-hidden />
                    <span>
                      <span className="sr-only">Votre réponse : </span>
                      {q.options[mine]}
                    </span>
                  </p>
                  <p className="mt-1.5 flex gap-2 text-[13px] text-ok-ink">
                    <Check size={14} weight="bold" className="mt-0.5 shrink-0" aria-hidden />
                    <span>
                      <span className="sr-only">Bonne réponse : </span>
                      {q.options[f.answer]}
                    </span>
                  </p>
                  <p className="mt-3 border-t border-line pt-3 text-[13px] leading-relaxed text-ink-2">{f.explanation}</p>
                  {f.source ? (
                    <a href={f.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] text-accent underline decoration-1 underline-offset-4">
                      {f.source.title} <ArrowSquareOut size={12} aria-hidden />
                    </a>
                  ) : null}
                </li>
              );
            })}
          </motion.ol>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
