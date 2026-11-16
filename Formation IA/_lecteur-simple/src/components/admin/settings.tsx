"use client";

import * as React from "react";
import { testEnvKeyAction, type KeyFormState } from "@/server/actions/ai-key";
import type { AiProviderId } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { TutorSlot } from "@/components/tutor/slot";
import { cn } from "@/lib/utils";

export function EnvKeyTest({ provider }: { provider: AiProviderId }) {
  const [pending, start] = React.useTransition();
  const [r, setR] = React.useState<KeyFormState>(null);
  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button size="sm" variant="secondary" loading={pending} onClick={() => start(async () => setR(await testEnvKeyAction(provider)))}>
        Tester
      </Button>
      {r ? <p className={cn("max-w-[34ch] text-right text-[12px]", r.ok ? "text-ok-ink" : "text-danger-ink")}>{r.ok ? r.message : r.error}</p> : null}
    </div>
  );
}

/** Essai du tuteur sur une leçon au choix (même composant que dans le lecteur de leçon). */
export function TutorPreview({ lessons }: { lessons: { id: string; title: string }[] }) {
  const [lessonId, setLessonId] = React.useState(lessons[0]?.id ?? "L001");
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label htmlFor="preview-lesson" className="sr-only">
        Leçon
      </label>
      <Select id="preview-lesson" value={lessonId} onChange={(e) => setLessonId(e.target.value)} className="max-w-md">
        {lessons.map((l) => (
          <option key={l.id} value={l.id}>
            {l.id} — {l.title}
          </option>
        ))}
      </Select>
      <p className="text-[12.5px] text-ink-3">Le bouton « Demander au tuteur » apparaît en bas à droite de l&apos;écran.</p>
      <TutorSlot key={lessonId} lessonId={lessonId} />
    </div>
  );
}
