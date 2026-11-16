"use client";

import * as React from "react";
import { useActionState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { startExamAction, type StartState } from "@/server/actions/exams";

/** Bouton « Commencer l'examen » + confirmation : le chronomètre démarre côté serveur à la validation. */
export function StartExam({ niveau, attemptNumber, maxAttempts, minutes, questions }: { niveau: string; attemptNumber: number; maxAttempts: number; minutes: number; questions: number }) {
  const [state, action, pending] = useActionState<StartState, FormData>(startExamAction, { error: null });
  const [confirmed, setConfirmed] = React.useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="accent" size="lg" className="w-full">
          <Play size={14} weight="fill" aria-hidden />
          Commencer l&apos;examen
        </Button>
      </DialogTrigger>
      <DialogContent title={`Tentative ${attemptNumber} sur ${maxAttempts}`} description="Le chronomètre démarre dès que vous confirmez. Il continue de tourner si vous fermez la page.">
        <ul className="space-y-2.5 text-[13.5px] text-ink-2">
          <li className="flex gap-3">
            <span className="num w-16 shrink-0 text-ink">{minutes} min</span>
            <span>pour {questions} questions, en une seule fois. À zéro, vos réponses enregistrées sont envoyées automatiquement.</span>
          </li>
          <li className="flex gap-3">
            <span className="num w-16 shrink-0 text-ink">Auto</span>
            <span>Chaque réponse est enregistrée sur le serveur : en cas de coupure, rouvrez l&apos;examen pour reprendre.</span>
          </li>
          <li className="flex gap-3">
            <span className="num w-16 shrink-0 text-ink">7 j</span>
            <span>En cas d&apos;échec, la tentative suivante est possible 7 jours après la soumission.</span>
          </li>
        </ul>
        <label className="mt-6 flex cursor-pointer items-start gap-3 border border-line px-4 py-3 text-[13.5px] text-ink">
          <input type="checkbox" className="mt-0.5 size-4 accent-[var(--accent)]" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          <span>Je dispose de {minutes} minutes sans interruption.</span>
        </label>
        <AnimatePresence>
          {state.error ? (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 border-s-2 border-danger px-3 py-2 text-[13px] text-danger-ink" role="alert">
              {state.error}
            </motion.p>
          ) : null}
        </AnimatePresence>
        <form action={action} className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <input type="hidden" name="niveau" value={niveau} />
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Plus tard
            </Button>
          </DialogClose>
          <Button type="submit" variant="accent" disabled={!confirmed} loading={pending}>
            Démarrer le chronomètre
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
