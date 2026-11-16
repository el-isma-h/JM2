// src/app/api/health/route.ts — sonde utilisée par Docker, Caddy, la CI et la supervision.
import { sante } from "../../../lib/sante";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";   // jamais mise en cache

export function GET(): Response {
  const { code, corps } = sante();
  return Response.json(corps, { status: code, headers: { "cache-control": "no-store" } });
}
