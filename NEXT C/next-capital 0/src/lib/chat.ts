import { dict } from "@/i18n";
import { estLocale, type Locale, LANGUES } from "@/i18n/config";
import { FONDS, ADHESIONS, STATUTS, THESES } from "@/config/fonds";

export interface MessageChat { role: "user" | "assistant"; contenu: string }

/** Réponse de secours par mots-clés, sans IA. */
export function reponseSecours(locale: Locale, question: string): string {
  const s = dict(locale).chatbot.secours;
  const q = question.toLowerCase();
  if (/nxt|token|jeton|erc|blockchain|トークン|토큰|代币|رمز/.test(q)) return s.token;
  if (/ticket|minimum|1 ?500|montant|最低|최소|最少|الحد/.test(q)) return s.ticket;
  if (/frais|fee|commission|coût|cost|comisi|commissioni|手数料|수수료|费用|رسوم/.test(q)) return s.frais;
  if (/candidat|apply|inscri|rejoindre|join|solicit|申請|신청|申请|طلب/.test(q)) return s.candidature;
  if (/dépôt|depot|deposit|sepa|virement|carte|card|crypto|apple|入金|입금|存入|إيداع/.test(q)) return s.depot;
  if (/risque|risk|perte|loss|riesgo|rischio|リスク|위험|风险|مخاطر/.test(q)) return s.risque;
  return s.defaut;
}

function contexteSysteme(locale: Locale) {
  const langue = LANGUES[locale].nom;
  const niveaux = ADHESIONS.map((a) => `${a.id}: ${a.prixAnnuelCents / 100} €/an, plafond annuel ${a.plafondAnnuelCents ? a.plafondAnnuelCents / 100 + " €" : "illimité"}, frais ${a.fraisStructurationPct} %`).join("; ");
  const statuts = STATUTS.map((s) => `${s.id} dès ${s.seuilCents / 100} € investis`).join("; ");
  const theses = THESES.map((t) => `${t.id} (${t.allocationCiblePct} %, ${t.stades}, horizon ${t.horizonAnnees} ans)`).join("; ");
  return `Tu es l'assistant de ${FONDS.nom}, un fonds d'investissement tokenisé (plateforme de démonstration, non agréée). Rôle : informer et orienter les visiteurs, jamais conseiller un investissement personnel. Réponds en ${langue}, en 3 phrases maximum, ton sobre et institutionnel.
Faits : token ${FONDS.token.symbole}, 1 ${FONDS.token.symbole} = ${FONDS.token.prixEmissionCents / 100} € à l'émission, standard prévu ${FONDS.token.standardPrevu} (registre interne pour l'instant). Ticket minimum ${FONDS.ticketMinimumCents / 100} € par multiples de ${FONDS.ticketPasCents / 100} €. Frais : structuration 3 à 5 % selon adhésion, gestion ${FONDS.fraisGestionAnnuelsPct.min} à ${FONDS.fraisGestionAnnuelsPct.max} %/an, commission ${FONDS.commissionPlusValuePct} % sur plus-value uniquement. Pas de marché secondaire. Adhésions : ${niveaux}. Statuts : ${statuts}. Thèses : ${theses}. Dépôts : virement SEPA, carte / Apple Pay (Stripe), crypto. Parcours : candidature (questionnaire + pièces) → examen par l'équipe → ouverture du compte → adhésion → dépôt → souscription. Siège prévu : Luxembourg. Une page « Études de marché » synthétise des publications de BlackRock, J.P. Morgan, Morgan Stanley et Goldman Sachs par thèse (chiffres sourcés, non garantis). Canaux : Y Combinator, Europe multi-stage, deals internes, réseaux Luxembourg et Miami.
Si on te demande un conseil personnalisé, une prévision de rendement ou une garantie, rappelle les risques (perte en capital, illiquidité) et renvoie vers un conseiller indépendant. Ne jamais inventer de performance.`;
}

export async function repondre(localeBrute: string, messages: MessageChat[]): Promise<string> {
  const locale: Locale = estLocale(localeBrute) ? localeBrute : "fr";
  const derniere = messages.filter((m) => m.role === "user").at(-1)?.contenu ?? "";
  const cle = process.env.XAI_API_KEY;
  if (!cle) return reponseSecours(locale, derniere);
  try {
    const r = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${cle}` },
      body: JSON.stringify({
        model: process.env.XAI_MODEL || "grok-3-mini",
        temperature: 0.3,
        max_tokens: 300,
        messages: [{ role: "system", content: contexteSysteme(locale) }, ...messages.map((m) => ({ role: m.role, content: m.contenu.slice(0, 1500) }))],
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) throw new Error(`xai_${r.status}`);
    const j = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    return j.choices?.[0]?.message?.content?.trim() || reponseSecours(locale, derniere);
  } catch {
    return reponseSecours(locale, derniere);
  }
}
