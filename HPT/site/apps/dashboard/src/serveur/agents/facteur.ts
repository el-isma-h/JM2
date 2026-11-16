/**
 * Facteur : le courrier de HPT. À chaque passage :
 * 1. relève la boîte IMAP si elle est configurée (réponses des clients, dépôts par e-mail) ;
 * 2. envoie les e-mails programmés dont l'heure est venue ;
 * 3. envoie les relances automatiques dues (e-mails restés sans réponse).
 * Sans IMAP ni SMTP, il tourne quand même et le dit clairement : ce n'est pas une erreur.
 */
import { imapConfigure, smtpConfigure } from "@/serveur/lib/courrier/config";
import { releverCourrier } from "@/serveur/lib/courrier/imap";
import { traiterEnvoisProgrammes, traiterRelances } from "@/serveur/lib/courrier/relances";
import type { ResultatAgent } from "./types";

export async function facteur(): Promise<ResultatAgent> {
  const parts: string[] = [];
  let elements = 0;

  if (imapConfigure()) {
    try {
      const r = await releverCourrier();
      elements += r.nouveaux;
      parts.push(r.releves ? `${r.releves} e-mail(s) relevé(s), ${r.nouveaux} nouveau(x), ${r.deposes} pièce(s) déposée(s)${r.ignores ? `, ${r.ignores} expéditeur(s) inconnu(s)` : ""}.` : "Aucun nouvel e-mail reçu.");
    } catch (e) {
      parts.push(`Relève IMAP impossible : ${(e as Error).message.slice(0, 160)}.`);
    }
  } else parts.push("IMAP non configuré : pas de relève du courrier entrant.");

  const p = await traiterEnvoisProgrammes();
  elements += p.envoyes;
  if (p.traites) parts.push(`${p.envoyes} e-mail(s) programmé(s) envoyé(s)${p.echecs ? `, ${p.echecs} échec(s)` : ""}.`);

  const r = await traiterRelances();
  elements += r.envoyees;
  if (r.dues) parts.push(`${r.envoyees} relance(s) envoyée(s) sur ${r.dues} due(s).`);

  if (!smtpConfigure() && (p.traites || r.dues)) parts.push("SMTP absent : les envois sont consignés, pas expédiés.");
  if (!p.traites && !r.dues) parts.push("Aucun envoi programmé ni relance à faire.");
  return { elements, resume: parts.join(" ") };
}
