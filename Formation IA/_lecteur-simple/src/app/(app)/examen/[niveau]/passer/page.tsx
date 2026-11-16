import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/server/auth";
import { openAttemptFor, takingPayloadFor } from "@/server/exams";
import { getLevel } from "@/content";
import { levelIdFromParam, routes, withBase } from "@/lib/paths";
import { ExamRunner } from "@/components/exam/exam-runner";

export const metadata: Metadata = { title: "Passer l'examen" };
export const dynamic = "force-dynamic";

/**
 * Passage de l'examen. La tentative est créée par la confirmation de /examen/[niveau] (server action
 * startExamAction, jamais par un simple GET) ; cette page reprend la tentative ouverte, ou renvoie à l'accueil.
 */
export default async function ExamenNiveauPasserPage({ params }: { params: Promise<{ niveau: string }> }) {
  const { niveau } = await params;
  const levelId = levelIdFromParam(niveau);
  const user = await requireUser(levelId ? routes.examTake(levelId) : undefined);
  const level = levelId ? getLevel(levelId) : null;
  if (!level || !levelId) notFound();
  const now = new Date();
  const attempt = await openAttemptFor(user.id, levelId, now);
  if (!attempt) redirect(routes.exam(levelId));
  // Payload public : questions mélangées, sans `answer` ni `explanation`.
  const payload = takingPayloadFor(attempt, now);
  return <ExamRunner payload={payload} exitHref={withBase(routes.exam(levelId))} />;
}
