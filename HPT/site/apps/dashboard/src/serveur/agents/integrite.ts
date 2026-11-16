import { eq, isNull } from "drizzle-orm";
import { db } from "@/serveur/db";
import { documents } from "@/serveur/db/schema";
import { lirePiece } from "@/serveur/lib/coffre/stockage";
import { sha256 } from "@/serveur/lib/securite/crypto";
import { verifierChaine } from "@/serveur/lib/securite/journal";
import { signaler } from "./alertes";
import type { ResultatAgent } from "./types";

export async function integrite(): Promise<ResultatAgent> {
  const docs = await db.select().from(documents).where(isNull(documents.supprimeLe));
  let anomalies = 0;
  for (const d of docs) {
    let ok = false;
    try {
      ok = sha256(await lirePiece(d.compteId, d.id)) === d.empreinteChiffre;
    } catch {
      ok = false;
    }
    if (ok) {
      await db.update(documents).set({ verifieLe: new Date() }).where(eq(documents.id, d.id));
    } else {
      anomalies++;
      await signaler({
        agent: "integrite",
        gravite: "critique",
        titre: "Fichier chiffré absent ou modifié",
        description: "L'empreinte du fichier sur le disque ne correspond plus à celle enregistrée au dépôt. Restaurer depuis la sauvegarde.",
        compteId: d.compteId,
        documentId: d.id,
        cle: `integrite:${d.id}`,
      });
    }
  }
  const chaine = await verifierChaine();
  if (chaine.rompueA !== null) {
    anomalies++;
    await signaler({
      agent: "integrite",
      gravite: "critique",
      titre: "Journal d'audit altéré",
      description: `La chaîne d'empreintes du journal est rompue à l'entrée n° ${chaine.rompueA}. Une modification directe de la base est probable.`,
      cle: `journal:${chaine.rompueA}`,
    });
  }
  return {
    elements: docs.length + chaine.total,
    resume: `${docs.length} fichier(s) et ${chaine.total} entrée(s) de journal vérifiés, ${anomalies} anomalie(s).`,
  };
}
