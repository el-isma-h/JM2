"use server";

/** Server actions des examens (démarrage, sauvegarde automatique, soumission). Rôle et propriété vérifiés côté serveur. */
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/server/auth";
import { ExamError, saveExamAnswers, startExamAttempt, submitExamAttempt, type SaveResult } from "@/server/exams";
import { levelIdFromParam, routes } from "@/lib/paths";

export type StartState = { error: string | null };

export async function startExamAction(_prev: StartState, formData: FormData): Promise<StartState> {
  const user = await requireUser();
  const levelId = levelIdFromParam(String(formData.get("niveau") ?? ""));
  if (!levelId) return { error: "Niveau inconnu." };
  try {
    await startExamAttempt(user.id, levelId);
  } catch (e) {
    if (e instanceof ExamError) return { error: e.message };
    throw e;
  }
  redirect(routes.examTake(levelId));
}

const uuid = z.string().uuid();
const updateSchema = z.object({
  questionId: z.string().min(1).max(40),
  choice: z.number().int().min(0).max(20).nullable().optional(),
  flagged: z.boolean().optional(),
});
const saveSchema = z.object({ attemptId: uuid, updates: z.array(updateSchema).min(1).max(80) });

/** Sauvegarde automatique (lot des modifications en attente côté client). */
export async function saveExamAnswersAction(input: z.input<typeof saveSchema>): Promise<SaveResult> {
  const user = await requireUser();
  const p = saveSchema.safeParse(input);
  if (!p.success) return { ok: false, reason: "invalid_choice", serverNow: new Date().toISOString() };
  return saveExamAnswers(user.id, p.data.attemptId, p.data.updates);
}

const submitSchema = z.object({
  attemptId: uuid,
  answers: z.record(z.string().max(40), z.number().int().min(0).max(20).nullable()).nullable(),
});

export type SubmitActionResult = { ok: true; url: string; late: boolean } | { ok: false; error: string };

export async function submitExamAction(input: z.input<typeof submitSchema>): Promise<SubmitActionResult> {
  const user = await requireUser();
  const p = submitSchema.safeParse(input);
  if (!p.success) return { ok: false, error: "Soumission invalide." };
  try {
    const r = await submitExamAttempt(user.id, p.data.attemptId, p.data.answers);
    return { ok: true, url: `${routes.examResult(r.levelId, r.attemptId)}${r.passed ? "?celebrer=1" : ""}`, late: r.late };
  } catch (e) {
    if (e instanceof ExamError) return { ok: false, error: e.message };
    throw e;
  }
}
