"use client";

/** Bloc de fin de leçon : « J'ai terminé la leçon » (+20 XP, confettis légers, badges) puis étape suivante. */
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CheckCircle, Lightning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { celebrate } from "@/components/ui/celebrate";
import { announceRewards, toast } from "@/components/feedback/toaster";
import { completeLessonAction } from "@/server/actions/learning";
import { formatDate } from "@/lib/utils";

export function CompleteLesson({
  lessonId,
  completedAt,
  next,
}: {
  lessonId: string;
  completedAt: string | null;
  next: { href: string; label: string } | null;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [doneAt, setDoneAt] = React.useState<string | null>(completedAt);
  const [nextStep, setNextStep] = React.useState(next);
  const [pending, start] = React.useTransition();
  const [gained, setGained] = React.useState(0);

  const onComplete = () =>
    start(async () => {
      const r = await completeLessonAction(lessonId);
      if (!r.ok) {
        toast({ kind: "error", title: r.error });
        return;
      }
      setDoneAt(new Date().toISOString());
      if (r.nextHref && r.nextLabel) setNextStep({ href: r.nextHref, label: r.nextLabel });
      if (!r.alreadyDone) {
        setGained(r.rewards.xp);
        void celebrate("small");
        announceRewards(r.rewards);
      }
      router.refresh();
    });

  return (
    <div className="relative overflow-hidden border border-line bg-bg-elev">
      <AnimatePresence mode="wait" initial={false}>
        {doneAt ? (
          <motion.div
            key="done"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
          >
            <div className="flex items-start gap-4">
              <motion.span
                initial={reduce ? false : { scale: 0.4, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center bg-ink text-bg"
              >
                <CheckCircle size={24} weight="fill" aria-hidden />
              </motion.span>
              <div>
                <p className="font-display text-[17px] font-light uppercase tracking-[0.06em] text-ink">Leçon terminée</p>
                <p className="mt-1 text-[13px] text-ink-2">
                  {gained > 0 ? (
                    <span className="num mr-2 inline-flex items-center gap-1 text-accent">
                      <Lightning size={13} weight="fill" aria-hidden />+{gained} XP
                    </span>
                  ) : null}
                  {gained > 0 ? "Bien joué, la suite est ouverte." : `Terminée le ${formatDate(doneAt)}.`}
                </p>
              </div>
            </div>
            {nextStep ? (
              <Button asChild size="lg" variant="accent">
                <Link href={nextStep.href}>
                  {nextStep.label} <ArrowRight size={14} aria-hidden />
                </Link>
              </Button>
            ) : null}
          </motion.div>
        ) : (
          <motion.div key="todo" exit={reduce ? undefined : { opacity: 0, y: -8 }} className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="font-display text-[17px] font-light uppercase tracking-[0.06em] text-ink">Vous avez tout lu ?</p>
              <p className="mt-1 max-w-[46ch] text-[13px] text-ink-2">Validez la leçon pour gagner 20 XP et ouvrir la suivante.</p>
            </div>
            <Button size="lg" variant="accent" onClick={onComplete} loading={pending} className="w-full sm:w-auto">
              <CheckCircle size={16} weight="bold" aria-hidden /> J&apos;ai terminé la leçon
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
