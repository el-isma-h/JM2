// src/app/api/chat/route.ts — route mince : toute la logique est dans src/lib/chat.ts (testée par vitest).
import { traiterChat } from "../../../lib/chat";
import { dependances } from "../../../lib/dependances";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;   // Vercel : durée maximale de la fonction (selon l'offre, à vérifier)

export async function POST(req: Request): Promise<Response> {
  return traiterChat(req, dependances());
}
