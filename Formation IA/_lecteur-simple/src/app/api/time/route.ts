/**
 * POST /ia/api/time — ping de temps passé sur une leçon (toutes les 30 s, onglet visible).
 * Corps JSON : { lessonId: "L001", seconds: 30 } (seconds = 0 au premier affichage : marque la leçon « commencée »).
 * Le serveur borne chaque ping et plafonne le cumul à 1,5 × la durée prévue (domain/lesson-time.ts).
 */
import { z } from "zod";
import { getLesson } from "@/content";
import { canAccessLesson } from "@/domain";
import { getSession } from "@/server/auth";
import { loadAccess } from "@/server/learner";
import { addLessonTime } from "@/server/progress";
import { sharedLimiter } from "@/lib/rate-limit";

const bodySchema = z.object({ lessonId: z.string().regex(/^L\d{3}$/), seconds: z.number().int().min(0).max(3600) });
const limiter = sharedLimiter("time-ping", { limit: 20, windowMs: 60_000 });

export async function POST(req: Request): Promise<Response> {
  const user = await getSession();
  if (!user) return Response.json({ error: "unauthenticated" }, { status: 401 });
  if (!limiter.hit(user.id).allowed) return Response.json({ error: "rate_limited" }, { status: 429 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "invalid_body" }, { status: 400 });
  const lesson = getLesson(parsed.data.lessonId);
  if (!lesson) return Response.json({ error: "not_found" }, { status: 404 });
  const { access } = await loadAccess(user.id);
  if (!canAccessLesson(access, lesson.id)) return Response.json({ error: "locked" }, { status: 403 });
  const r = await addLessonTime(user.id, lesson.id, parsed.data.seconds, lesson.minutes);
  return Response.json({ ok: true, accepted: r.accepted, total: r.total });
}
