/**
 * POST /ia/api/tutor — tuteur IA en streaming (text/plain, morceaux de Markdown).
 * Corps : { lessonId: "L012", messages: [{ role: "user" | "assistant", content }] } (dernier message = question).
 *
 * Contrôles : session, accès à la leçon (apprenant), limitation de débit par utilisateur, clé disponible.
 * Réponses d'erreur JSON : 401 unauthenticated · 400 invalid · 403 locked · 404 lesson · 409 no_key · 429 rate_limited.
 * En-têtes de succès : X-Tutor-Provider, X-Tutor-Source (personal|platform|env), X-New-Badges (ids séparés par des virgules).
 */
import { z } from "zod";
import { getSession, isStaff } from "@/server/auth";
import { getLesson } from "@/content";
import { canAccessLesson } from "@/domain";
import { loadAccess } from "@/server/learner";
import { logActivity, syncBadges } from "@/server/gamification";
import { sharedLimiter } from "@/lib/rate-limit";
import { lessonIdFromParam, routes } from "@/lib/paths";
import { credentialsFor } from "@/server/ai/keys";
import { fakeProviderEnabled, streamChat } from "@/server/ai/client";
import { buildTutorSystemPrompt } from "@/server/ai/tutor-prompt";

export const dynamic = "force-dynamic";

const perMinutes = sharedLimiter("tutor-burst", { limit: 12, windowMs: 5 * 60_000 });
const perDay = sharedLimiter("tutor-day", { limit: 150, windowMs: 24 * 3_600_000 });

const bodySchema = z.object({
  lessonId: z.string().max(10),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(4000) }))
    .min(1)
    .max(24)
    .refine((m) => m.at(-1)?.role === "user", "Le dernier message doit être une question."),
});

function json(status: number, data: Record<string, unknown>) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

/** GET : le tuteur est-il utilisable pour cet utilisateur ? (jamais la clé, seulement le fournisseur et la source) */
export async function GET() {
  const user = await getSession();
  if (!user) return json(401, { error: "unauthenticated" });
  const creds = await credentialsFor(user.id);
  if (fakeProviderEnabled()) return json(200, { available: true, provider: "simulation", source: "simulation", model: "simulation" });
  if (!creds) return json(200, { available: false, configureUrl: routes.apiKey });
  return json(200, { available: true, provider: creds.provider, source: creds.source, model: creds.model });
}

export async function POST(req: Request) {
  const user = await getSession();
  if (!user) return json(401, { error: "unauthenticated", message: "Session expirée : reconnectez-vous." });

  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return json(400, { error: "invalid", message: "Requête invalide." });
  }
  if (!parsed.success) return json(400, { error: "invalid", message: "Question vide ou trop longue (4 000 caractères maximum)." });

  const lessonId = lessonIdFromParam(parsed.data.lessonId);
  const lesson = lessonId ? getLesson(lessonId) : null;
  if (!lesson) return json(404, { error: "lesson", message: "Leçon introuvable." });
  if (!isStaff(user.role)) {
    const { access } = await loadAccess(user.id);
    if (!canAccessLesson(access, lesson.id)) return json(403, { error: "locked", message: "Cette leçon n'est pas encore débloquée." });
  }

  const creds = await credentialsFor(user.id);
  if (!creds && !fakeProviderEnabled()) {
    return json(409, { error: "no_key", message: "Aucune clé API n'est configurée pour le tuteur.", configureUrl: routes.apiKey });
  }

  const burst = perMinutes.hit(user.id);
  const day = burst.allowed ? perDay.hit(user.id) : burst;
  if (!burst.allowed || !day.allowed) {
    const s = Math.ceil(Math.max(burst.retryAfterMs, day.retryAfterMs) / 1000);
    return json(429, { error: "rate_limited", message: `Vous avez posé beaucoup de questions. Réessayez dans ${s < 120 ? `${s} s` : `${Math.ceil(s / 60)} min`}.`, retryAfter: s });
  }

  // Trace « tuteur consulté » (preuve FOAD + badge), avant la réponse : les en-têtes partent avec le premier octet.
  await logActivity(user.id, "tutor", { lessonId: lesson.id, refId: creds?.provider ?? "fake" });
  const fresh = user.isDemo ? [] : await syncBadges(user.id).catch(() => [] as string[]);

  const system = buildTutorSystemPrompt(lesson, user);
  const call = creds ?? { provider: "anthropic" as const, key: "fake", model: "simulation", source: "env" as const };
  const encoder = new TextEncoder();
  const iterator = streamChat(call, system, parsed.data.messages, req.signal);

  // Premier morceau lu avant de répondre : une erreur d'authentification / réseau devient un JSON clair.
  let first: IteratorResult<string>;
  try {
    first = await iterator.next();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Le tuteur est indisponible.";
    return json(502, { error: "provider", message, configureUrl: routes.apiKey });
  }

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      if (!first.done && first.value) controller.enqueue(encoder.encode(first.value));
      if (first.done) controller.close();
    },
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();
        if (done) controller.close();
        else controller.enqueue(encoder.encode(value));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Réponse interrompue.";
        controller.enqueue(encoder.encode(`\n\n> ⚠️ ${message}`));
        controller.close();
      }
    },
    async cancel() {
      await iterator.return?.(undefined);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Tutor-Provider": fakeProviderEnabled() ? "simulation" : call.provider,
      "X-Tutor-Source": creds?.source ?? "simulation",
      "X-New-Badges": fresh.join(","),
    },
  });
}
