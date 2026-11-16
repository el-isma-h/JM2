import { NextResponse } from "next/server";
import { repondre, type MessageChat } from "@/lib/chat";

export async function POST(req: Request) {
  let corps: { locale?: string; messages?: MessageChat[] } = {};
  try { corps = await req.json(); } catch { /* corps vide */ }
  const messages = (corps.messages ?? []).filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.contenu === "string").slice(-10);
  if (messages.length === 0) return NextResponse.json({ reponse: "" }, { status: 400 });
  const reponse = await repondre(corps.locale ?? "fr", messages);
  return NextResponse.json({ reponse });
}
