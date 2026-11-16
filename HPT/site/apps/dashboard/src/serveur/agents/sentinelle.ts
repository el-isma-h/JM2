import { and, inArray, isNull } from "drizzle-orm";
import { db } from "@/serveur/db";
import { documents } from "@/serveur/db/schema";
import { analyserDocument } from "@/serveur/lib/coffre/coffre";
import { config } from "@/serveur/lib/config";
import type { ResultatAgent } from "./types";

export async function sentinelle(): Promise<ResultatAgent> {
  const statuts = config.clamav.hote ? ["analyse", "non_analyse"] : ["analyse"];
  const lot = await db
    .select()
    .from(documents)
    .where(and(inArray(documents.statut, statuts), isNull(documents.supprimeLe)))
    .limit(50);
  let quarantaine = 0;
  for (const doc of lot) {
    const v = await analyserDocument(doc);
    if (v.statut === "quarantaine") quarantaine++;
  }
  return {
    elements: lot.length,
    resume: lot.length ? `${lot.length} pièce(s) analysée(s), ${quarantaine} en quarantaine.` : "Aucune pièce en attente.",
  };
}
