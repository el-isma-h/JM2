/**
 * Commandant : traduit un ordre écrit en français en réponses et en propositions à valider.
 * Analyse par règles (fiable, hors ligne) ; l'IA ne sert qu'à répondre aux questions libres, sur données anonymisées.
 */
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/serveur/db";
import { commandes, comptes, documents, propositions } from "@/serveur/db/schema";
import { PRODUITS_NEXT } from "@/contenu/next";
import { DOSSIERS, nomDossier } from "@/serveur/lib/coffre/types";
import { interrogerIa } from "@/serveur/lib/ia/moteur";
import { porteConfiguree } from "@/serveur/lib/next/connecteur";
import { actualiserTout, etatsEnregistres } from "@/serveur/lib/next/ecosysteme";
import { proposer } from "@/serveur/lib/next/propositions";

const normal = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const MOTS_PRODUITS: [RegExp, string][] = [
  [/optimi|trop.?pay|reclamation/, "next-optimisation"],
  [/\bads?\b|publicit|campagne/, "next-ads"],
  [/\brh\b|\bpay\b|paie|bulletin|salari/, "next-pay"],
  [/courtage|assurance|\bbank\b|banque|crédit|credit|financement/, "next-courtage"],
  [/immobilier|logement|\bbail\b|locati/, "next-immobilier-solidaire"],
  [/legalcy|juridique|avocat|contentieux/, "next-legalcy"],
  [/formation|cfa|qualiopi/, "next-formation"],
  [/capital|invest|kyc|nxt/, "next-capital"],
  [/\bapp\b|mobile/, "next-app"],
  [/logiciel|developpement|application sur mesure/, "next-logiciel"],
  [/informatique|infogerance|reseau|materiel|parc/, "next-informatique"],
];
const MOTS_CATEGORIES: [RegExp, string][] = [
  [/urssaf|cotisation|dsn/, "urssaf"],
  [/energie|electricite|gaz|carburant|ticpe/, "energie"],
  [/fonciere|cfe/, "taxe-fonciere"],
  [/paie|bulletin|salaire/, "paie"],
  [/kbis|statut|juridique/, "juridique"],
  [/formation|convention/, "formation"],
  [/identite|passeport|\bcni\b/, "identite"],
];

export const AIDE_COMMANDANT = [
  "« état de l'écosystème » ou « état de Next Pay »",
  "« envoie les pièces URSSAF de Cabinet Test vers Optimisation »",
  "« lance les agents de Next Ads »",
  "« relance Cabinet Test »",
  "« clients sans pièce »",
  "« combien à valider »",
];

async function trouverClient(texte: string) {
  const t = normal(texte);
  const clients = await db.select().from(comptes).where(eq(comptes.role, "client"));
  return clients
    .filter((c) => c.societe && t.includes(normal(c.societe)))
    .sort((a, b) => b.societe.length - a.societe.length)[0] ?? null;
}

export async function commander(texte: string, auteurId: string) {
  const t = normal(texte.trim());
  const produits = MOTS_PRODUITS.filter(([r]) => r.test(t)).map(([, s]) => s);
  const categorie = MOTS_CATEGORIES.find(([r]) => r.test(t))?.[1] ?? null;
  let reponse = "";
  let moteur = "Règles";
  let creees = 0;

  if (/^(aide|help|\?)/.test(t)) {
    reponse = `Exemples d'ordres :\n${AIDE_COMMANDANT.map((a) => `• ${a}`).join("\n")}`;
  } else if (/envo|transm|copie|bascul/.test(t)) {
    const client = await trouverClient(texte);
    const cibles = produits.length ? produits : PRODUITS_NEXT.filter((p) => categorie && p.categories.includes(categorie)).map((p) => p.slug);
    if (!client) reponse = "Je n'ai pas reconnu le client : écrivez le nom de sa société tel qu'il apparaît dans la liste des clients.";
    else if (!cibles.length) reponse = "Précisez la destination (Optimisation, RH, Formation, Capital…) ou le type de pièces (URSSAF, paie…).";
    else {
      const docs = await db.select().from(documents).where(and(eq(documents.compteId, client.id), isNull(documents.supprimeLe)));
      const saines = docs.filter((d) => ["sain", "non_analyse"].includes(d.statut));
      const choisies = categorie ? saines.filter((d) => (d.dossier !== "autre" ? d.dossier : d.categorieIa) === categorie) : saines;
      const fermees: string[] = [];
      let dejaLa = 0;
      for (const slug of cibles) {
        const p = PRODUITS_NEXT.find((x) => x.slug === slug)!;
        if (!porteConfiguree(slug)) {
          fermees.push(p.nom);
          continue;
        }
        for (const d of choisies) {
          const cat = categorie ?? (d.dossier !== "autre" ? d.dossier : (d.categorieIa ?? "autre"));
          if (
            await proposer({
              agent: "commandant",
              type: "envoi_piece",
              produit: slug,
              compteId: client.id,
              documentId: d.id,
              titre: `Copier une pièce de ${client.societe} vers ${p.nom}`,
              raison: `Ordre donné dans la console : « ${texte.slice(0, 160)} ». Dossier de la pièce : ${nomDossier(d.dossier)}.`,
              donnees: { categorie: cat },
              cle: `envoi:${d.id}:${slug}`,
            })
          )
            creees++;
          else dejaLa++;
        }
      }
      reponse = choisies.length
        ? `${creees} envoi(s) préparé(s) pour ${client.societe} (${choisies.length} pièce(s) concernée(s)). Validez-les dans « À valider ».${dejaLa ? ` ${dejaLa} envoi(s) existaient déjà : en attente, déjà faits, refusés ou en échec récent (voir l'historique de « À valider »).` : ""}`
        : `Aucune pièce saine${categorie ? ` dans « ${nomDossier(categorie)} »` : ""} pour ${client.societe}.`;
      if (fermees.length) reponse += ` Porte HPT non configurée pour : ${fermees.join(", ")}.`;
    }
  } else if (/lanc|demarr|reveill/.test(t) && /agent/.test(t)) {
    if (!produits.length) reponse = "Précisez le Next dont il faut lancer les agents.";
    for (const slug of produits) {
      const p = PRODUITS_NEXT.find((x) => x.slug === slug)!;
      if (!porteConfiguree(slug)) {
        reponse += `${p.nom} : porte HPT non configurée. `;
        continue;
      }
      if (await proposer({ agent: "commandant", type: "lancer_agents_next", produit: slug, titre: `Lancer les agents de ${p.nom}`, raison: `Ordre donné dans la console : « ${texte.slice(0, 160)} ».`, cle: `agents:${slug}:${Date.now()}` }))
        creees++;
      reponse += `${p.nom} : lancement préparé, à valider. `;
    }
  } else if (/relan/.test(t)) {
    const client = await trouverClient(texte);
    if (!client) reponse = "Je n'ai pas reconnu le client à relancer.";
    else {
      await proposer({
        agent: "commandant",
        type: "relance_client",
        compteId: client.id,
        titre: `Relancer ${client.societe}`,
        raison: `Ordre donné dans la console : « ${texte.slice(0, 160)} ».`,
        donnees: { sujet: "Point sur votre dossier HPT", message: `Bonjour ${client.prenom || ""},\n\nNous revenons vers vous au sujet de votre dossier. Pouvez-vous nous indiquer vos disponibilités pour un point rapide ?\n\nL'équipe HPT GIE` },
        cle: `relance-console:${client.id}:${Date.now()}`,
      });
      creees = 1;
      reponse = `Message de relance préparé pour ${client.societe}, à valider (vous pouvez le modifier avant envoi depuis la messagerie).`;
    }
  } else if (/sans (piece|document)/.test(t)) {
    const r = await db.execute<{ societe: string; email: string }>(
      sql`select c.societe, c.email from comptes c where c.role = 'client' and c.onboarding_etape = 99 and not exists (select 1 from documents d where d.compte_id = c.id) order by c.cree_le desc limit 20`,
    );
    reponse = r.rows.length ? `${r.rows.length} client(s) sans pièce :\n${r.rows.map((x) => `• ${x.societe || x.email}`).join("\n")}` : "Tous les clients inscrits ont déposé au moins une pièce.";
  } else if (/valid|attente/.test(t)) {
    const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(propositions).where(eq(propositions.statut, "a_valider"));
    reponse = `${n} proposition(s) attendent une décision dans « À valider ».`;
  } else if (/etat|statut|sante|comment va|tableau|point/.test(t)) {
    await actualiserTout();
    const etats = await etatsEnregistres();
    const choix = produits.length ? etats.filter((e) => produits.includes(e.produit.slug)) : etats;
    reponse = choix
      .map((e) =>
        e.statut === "ok" && e.etat
          ? `${e.produit.nom} : en ligne. ${e.etat.indicateurs.map((i) => `${i.libelle} ${i.valeur}${i.unite ?? ""}`).join(", ")}${e.etat.alertes.length ? `. ${e.etat.alertes.length} alerte(s)` : ""}.`
          : `${e.produit.nom} : ${e.statut === "fermee" ? "porte HPT non configurée" : (e.erreur ?? e.statut)}.`,
      )
      .join("\n");
  } else {
    const etats = await etatsEnregistres();
    const contexte = etats.map((e) => `${e.produit.nom} : ${e.statut}${e.etat ? `, ${e.etat.indicateurs.map((i) => `${i.libelle} ${i.valeur}`).join(", ")}` : ""}`).join("\n");
    const ia = await interrogerIa({
      sensible: false,
      systeme: "Tu es le Commandant des agents de HPT GIE. Réponds en français, brièvement, sans tiret cadratin. Tu ne peux rien exécuter toi-même : indique l'ordre précis à donner si une action est souhaitée.",
      invite: `Contexte de l'écosystème :\n${contexte}\n\nQuestion : ${texte}`,
    });
    if (ia) {
      reponse = ia.texte;
      moteur = ia.moteur === "locale" ? "IA locale" : "Grok (anonymisé)";
    } else reponse = `Je n'ai pas compris cet ordre. Exemples :\n${AIDE_COMMANDANT.map((a) => `• ${a}`).join("\n")}`;
  }

  await db.insert(commandes).values({ auteurId, texte: texte.slice(0, 1000), reponse, moteur, propositions: creees });
  return { reponse, moteur, propositions: creees };
}

export const dernieresCommandes = () => db.select().from(commandes).orderBy(desc(commandes.creeLe)).limit(12);
export const dossiersConnus = DOSSIERS;
