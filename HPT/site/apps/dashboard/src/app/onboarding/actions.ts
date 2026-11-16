"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/serveur/db";
import { abonnements, plans } from "@/serveur/db/schema";
import { siretValide, type Reponses } from "@/contenu/onboarding";
import { config } from "@/serveur/lib/config";
import { ecrireReponses, lireReponses } from "@/serveur/lib/profil";
import { journaliser } from "@/serveur/lib/securite/journal";
import { lireSession } from "@/serveur/lib/securite/session";
import { stripeActif, urlPaiement } from "@/serveur/lib/stripe";

export type EtatEtape = { erreur?: string; champ?: string; ok?: number } | undefined;

const texte = (max = 200) => z.string().trim().max(max);
const requis = (msg: string, max = 200) => z.string().trim().min(1, msg).max(max);
const liste = z.array(z.string().max(120)).max(20);

const SCHEMAS: Record<number, z.ZodType<Reponses>> = {
  1: z.object({
    civilite: texte(30),
    prenom: requis("Indiquez votre prénom.", 80),
    nom: requis("Indiquez votre nom.", 80),
    telephone: z.string().trim().regex(/^\+?[0-9 .()-]{8,20}$/, "Numéro de téléphone invalide."),
    dateNaissance: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide.")]),
    fonction: requis("Indiquez votre fonction."),
    metier: requis("Décrivez votre métier en quelques mots.", 300),
  }),
  2: z.object({
    siret: z.string().transform((s) => s.replace(/\s/g, "")).refine(siretValide, "SIRET invalide : 14 chiffres, clé de contrôle incorrecte."),
    raisonSociale: requis("Indiquez la raison sociale."),
    formeJuridique: texte(80),
    codeNaf: texte(10),
    adresse: requis("Indiquez l'adresse du siège.", 200),
    codePostal: z.string().trim().regex(/^\d{5}$/, "Code postal à 5 chiffres."),
    ville: requis("Indiquez la ville.", 100),
    dateCreation: texte(10),
    tvaIntra: z.union([z.literal(""), z.string().trim().regex(/^FR[0-9A-Z]{2}\d{9}$/i, "Numéro de TVA intracommunautaire invalide (FR + 11 caractères).")]),
    siteWeb: z.union([z.literal(""), z.url("Adresse de site invalide (commencez par https://).").max(200)]),
    kbisRecent: texte(10),
  }),
  3: z.object({
    secteur: requis("Choisissez un secteur."),
    effectif: requis("Indiquez le nombre de salariés."),
    chiffreAffaires: texte(40),
    etablissements: z.string().regex(/^\d{0,4}$/, "Nombre d'établissements invalide."),
    locaux: texte(40),
    fournisseurEnergie: texte(80),
  }),
  4: z.object({
    besoins: liste.min(1, "Choisissez au moins un besoin."),
    produitsNext: liste,
    usagesCoffre: liste,
    priorite: texte(500),
    delai: requis("Indiquez votre délai."),
    source: texte(60),
    message: texte(2000),
  }),
  5: z.object({
    planSouhaite: z.enum(["basique", "pro", "ultra", "plus-tard"], { error: "Choisissez une formule ou « plus tard »." }),
    consentementRgpd: z.literal("on", { error: "Votre accord sur le traitement des données est nécessaire." }),
    consentementContact: texte(5),
    consentementNext: texte(5),
  }),
};

const LISTES = ["besoins", "produitsNext", "usagesCoffre"];

export async function enregistrerEtape(etape: number, _: EtatEtape, form: FormData): Promise<EtatEtape> {
  const s = await lireSession();
  if (!s || s.compte.role !== "client") redirect("/connexion");
  const schema = SCHEMAS[etape];
  if (!schema) return { erreur: "Étape inconnue." };
  const brut: Record<string, unknown> = {};
  for (const [k, v] of form.entries()) {
    if (k.startsWith("$")) continue;
    if (LISTES.includes(k)) (brut[k] = (brut[k] as string[] | undefined) ?? []).push(String(v));
    else brut[k] = String(v);
  }
  for (const l of LISTES) if (etape === 4) brut[l] ??= [];
  for (const k of ["consentementContact", "consentementNext"]) if (etape === 5) brut[k] ??= "";
  const r = schema.safeParse(brut);
  if (!r.success) {
    const i = r.error.issues[0];
    return { erreur: i.message, champ: String(i.path[0] ?? "") };
  }
  const actuelles = await lireReponses(s.compte);
  const fusion: Reponses = { ...actuelles, ...r.data };
  const fini = etape === 5;
  if (fini) fusion.termineLe = new Date().toISOString();
  if (s.compte.onboardingEtape === 99 && etape === 5) return { erreur: "Changez de formule depuis la page Abonnement." };
  await ecrireReponses(s.compte.id, fusion, { onboardingEtape: fini ? 99 : Math.max(s.compte.onboardingEtape, etape + 1) });
  const edition = s.compte.onboardingEtape === 99;
  await journaliser({ action: edition ? "profil.modifie" : fini ? "onboarding.termine" : "onboarding.etape", acteurId: s.compte.id, acteurRole: "client", compteConcerne: s.compte.id, details: { etape } });

  if (!fini) return { ok: etape + 1 };

  const planId = fusion.planSouhaite;
  if (planId && planId !== "plus-tard") {
    const [plan] = await db.select().from(plans).where(eq(plans.id, planId));
    if (plan) {
      if (stripeActif()) {
        const url = await urlPaiement({ ...s.compte, societe: fusion.raisonSociale ?? "" }, plan, "/espace/abonnement");
        redirect(url);
      }
      if (config.modeDemo) {
        await db
          .insert(abonnements)
          .values({ compteId: s.compte.id, planId, statut: "demo", finPeriode: new Date(Date.now() + 30 * 86_400_000) })
          .onConflictDoUpdate({ target: abonnements.compteId, set: { planId, statut: "demo", majLe: new Date() } });
        await journaliser({ action: "abonnement.demo", acteurId: s.compte.id, compteConcerne: s.compte.id, details: { planId } });
      }
    }
  }
  redirect("/espace?bienvenue=1");
}

