"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowSquareOut, CaretDown, Check, X } from "@phosphor-icons/react";
import type { CorrectionItem } from "@/domain/exam-session";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D", "E", "F"];
type Filter = "all" | "wrong" | "empty";

/** Correction question par question (après soumission uniquement) avec filtres. */
export function CorrectionList({ items, lessonTitles, lessonHref }: { items: CorrectionItem[]; lessonTitles: Record<string, string>; lessonHref: Record<string, string> }) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = React.useState<Filter>(() => (items.some((i) => !i.correct) ? "wrong" : "all"));
  const [open, setOpen] = React.useState<Set<string>>(() => new Set());
  const counts = { all: items.length, wrong: items.filter((i) => !i.correct && i.given !== null).length, empty: items.filter((i) => i.given === null).length };
  const shown = items.filter((i) => (filter === "all" ? true : filter === "wrong" ? !i.correct && i.given !== null : i.given === null));
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const allOpen = shown.length > 0 && shown.every((i) => open.has(i.questionId));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex border border-line" role="tablist" aria-label="Filtrer la correction">
          {(
            [
              ["all", "Toutes"],
              ["wrong", "Erreurs"],
              ["empty", "Sans réponse"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={filter === k}
              onClick={() => setFilter(k)}
              className={cn("relative px-3.5 py-2 text-[12.5px] transition-colors duration-300", filter === k ? "text-ink" : "text-ink-3 hover:text-ink")}
            >
              {filter === k ? <motion.span layoutId="correction-tab" className="absolute inset-0 bg-bg-muted" transition={{ type: "spring", stiffness: 500, damping: 40 }} /> : null}
              <span className="relative">
                {label} <span className="num text-ink-3">{counts[k]}</span>
              </span>
            </button>
          ))}
        </div>
        <button type="button" className="text-[12.5px] text-accent underline-offset-4 hover:underline" onClick={() => setOpen(allOpen ? new Set() : new Set(shown.map((i) => i.questionId)))}>
          {allOpen ? "Tout replier" : "Tout déplier"}
        </button>
      </div>

      {shown.length === 0 ? (
        <p className="border border-dashed border-line-strong px-5 py-6 text-[13.5px] text-ink-2">{filter === "empty" ? "Vous avez répondu à toutes les questions." : "Aucune erreur : toutes vos réponses sont justes."}</p>
      ) : (
        <ol className="divide-y divide-line border-y border-line">
          {shown.map((it) => {
            const isOpen = open.has(it.questionId);
            return (
              <li key={it.questionId}>
                <button type="button" onClick={() => toggle(it.questionId)} aria-expanded={isOpen} className="flex w-full items-start gap-4 py-4 text-left transition-colors hover:bg-bg-elev sm:px-2">
                  <span
                    className={cn("num mt-0.5 flex size-7 shrink-0 items-center justify-center border text-[12px]", it.correct ? "border-ok/60 text-ok-ink" : it.given === null ? "border-line-strong text-ink-3" : "border-danger/60 text-danger-ink")}
                    aria-label={it.correct ? "Juste" : it.given === null ? "Sans réponse" : "Fausse"}
                  >
                    {it.index}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block max-w-[78ch] text-[14px] leading-relaxed text-ink">{it.q}</span>
                    <span className="mt-1 block text-[12px] text-ink-3">
                      Compétence {it.competence}
                      {it.given === null ? " · sans réponse" : it.correct ? " · juste" : ` · votre réponse ${LETTERS[it.given]}, bonne réponse ${LETTERS[it.correctIndex]}`}
                    </span>
                  </span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} className="mt-1 shrink-0 text-ink-3">
                    <CaretDown size={14} aria-hidden />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pl-11 sm:pl-[3.25rem]">
                        <ul className="grid gap-1.5">
                          {it.options.map((opt, i) => {
                            const good = i === it.correctIndex;
                            const mine = i === it.given;
                            return (
                              <li
                                key={i}
                                className={cn(
                                  "flex items-start gap-3 border px-3 py-2.5 text-[13.5px]",
                                  good ? "border-ok/60 bg-ok-soft text-ink" : mine ? "border-danger/50 bg-danger-soft text-ink" : "border-line text-ink-2",
                                )}
                              >
                                <span className="num w-4 shrink-0 text-ink-3">{LETTERS[i]}</span>
                                <span className="flex-1">{opt}</span>
                                {good ? (
                                  <span className="inline-flex shrink-0 items-center gap-1 text-[11.5px] text-ok-ink">
                                    <Check size={12} weight="bold" aria-hidden /> Bonne réponse
                                  </span>
                                ) : mine ? (
                                  <span className="inline-flex shrink-0 items-center gap-1 text-[11.5px] text-danger-ink">
                                    <X size={12} weight="bold" aria-hidden /> Votre réponse
                                  </span>
                                ) : null}
                              </li>
                            );
                          })}
                        </ul>
                        <p className="mt-4 max-w-[72ch] border-s-2 border-accent ps-4 text-[13.5px] leading-relaxed text-ink-2">{it.explanation}</p>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px]">
                          {it.lessonId && lessonHref[it.lessonId] ? (
                            <Link href={lessonHref[it.lessonId]} className="text-accent underline-offset-4 hover:underline">
                              Revoir {it.lessonId} · {lessonTitles[it.lessonId] ?? "la leçon"}
                            </Link>
                          ) : null}
                          {it.source ? (
                            <a href={it.source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink-2 underline-offset-4 hover:text-ink hover:underline">
                              Source : {it.source.title} <ArrowSquareOut size={12} aria-hidden />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
