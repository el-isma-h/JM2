/**
 * POST /ia/api/auth/demo — connexion directe au compte démo (bouton de la page de connexion).
 * Protections : origine du formulaire vérifiée (anti-CSRF), limitation de débit par IP, DEMO_ENABLED.
 */
import { createSession, demoEnabled, findDemoUser, requestMeta } from "@/server/auth";
import { sharedLimiter } from "@/lib/rate-limit";
import { routes, withBase } from "@/lib/paths";

const demoLimiter = sharedLimiter("demo-login", { limit: 10, windowMs: 60_000 });

function redirectTo(path: string): Response {
  // Location relative : correcte derrière Caddy quel que soit l'hôte public.
  return new Response(null, { status: 303, headers: { Location: withBase(path) } });
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return req.headers.get("sec-fetch-site") === "same-origin";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: Request): Promise<Response> {
  if (!sameOrigin(req)) return redirectTo(`${routes.login}?erreur=origine`);
  if (!demoEnabled()) return redirectTo(`${routes.login}?erreur=demo`);
  const { ip } = await requestMeta();
  if (!demoLimiter.hit(ip ?? "?").allowed) return redirectTo(`${routes.login}?erreur=trop`);
  const demo = await findDemoUser();
  if (!demo) return redirectTo(`${routes.login}?erreur=demo`);
  await createSession(demo.id);
  return redirectTo(routes.home);
}

export function GET(): Response {
  return redirectTo(routes.login);
}
