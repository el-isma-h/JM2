/** GET /ia/api/health — sonde Docker / supervision : base joignable et contenu lisible. */
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { getProgramme } from "@/content";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    await db.execute(sql`select 1`);
    const prog = getProgramme();
    return Response.json({ ok: true, programme: prog.code, version: prog.version });
  } catch (e) {
    console.error("[health]", e);
    return Response.json({ ok: false }, { status: 503 });
  }
}
