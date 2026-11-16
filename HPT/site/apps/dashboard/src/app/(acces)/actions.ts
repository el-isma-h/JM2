"use server";

import { and, eq, gt, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/serveur/db";
import { comptes, jetonsReinitialisation, sessions } from "@/serveur/db/schema";
import { envoyerEmail } from "@/serveur/lib/email";
import { config } from "@/serveur/lib/config";
import { contexteRequete } from "@/serveur/lib/requete";
import { cleClient } from "@/serveur/lib/securite/cles";
import { dechiffrerTexte, jetonAleatoire, sha256 } from "@/serveur/lib/securite/crypto";
import { journaliser } from "@/serveur/lib/securite/journal";
import { limiter } from "@/serveur/lib/securite/limite";
import { evaluerMotDePasse, hacher, hashLeurre, verifierMotDePasse } from "@/serveur/lib/securite/mots-de-passe";
import { aUnDeuxiemeFacteur, creerSession, estEquipe, lireSession, terminerSession, validerDeuxiemeFacteur } from "@/serveur/lib/securite/session";
import { normaliserCodeSecours, verifierTotp } from "@/serveur/lib/securite/totp";

export type EtatFormulaire = { erreur?: string; champs?: Record<string, string>; succes?: string } | undefined;

const MAX_ECHECS = 5;
const VERROU_MIN = 15;
const MESSAGE_GENERIQUE = "E-mail ou mot de passe incorrect, ou compte temporairement verrouillé.";

const destination = (role: string, onboarding: number) => (estEquipe(role) ? "/admin" : onboarding === 99 ? "/espace" : "/onboarding");

export async function connexion(_: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const motDePasse = String(form.get("motDePasse") ?? "").slice(0, 200);
  const { ip } = await contexteRequete();

  const parIp = await limiter(`connexion:ip:${ip}`, 30, 900);
  const parEmail = await limiter(`connexion:email:${email}`, 10, 900);
  if (!parIp.ok || !parEmail.ok) {
    await journaliser({ action: "connexion.limitee", ip, details: { email } });
    return { erreur: "Trop de tentatives. Réessayez dans quelques minutes.", champs: { email } };
  }

  const [compte] = await db.select().from(comptes).where(eq(comptes.email, email));
  if (!compte) {
    await verifierMotDePasse(await hashLeurre(), motDePasse);
    await journaliser({ action: "connexion.echec", ip, details: { motif: "compte_inconnu" } });
    return { erreur: MESSAGE_GENERIQUE, champs: { email } };
  }
  if (compte.verrouilleJusqua && compte.verrouilleJusqua > new Date()) {
    await journaliser({ action: "connexion.echec", ip, cibleType: "compte", cibleId: compte.id, compteConcerne: compte.id, details: { motif: "verrouille" } });
    return { erreur: MESSAGE_GENERIQUE, champs: { email } };
  }
  if (!(await verifierMotDePasse(compte.motDePasseHash, motDePasse)) || compte.suspendu) {
    const echecs = compte.tentativesEchouees + 1;
    const verrouiller = echecs >= MAX_ECHECS;
    await db
      .update(comptes)
      .set({ tentativesEchouees: verrouiller ? 0 : echecs, verrouilleJusqua: verrouiller ? new Date(Date.now() + VERROU_MIN * 60_000) : compte.verrouilleJusqua })
      .where(eq(comptes.id, compte.id));
    await journaliser({ action: "connexion.echec", ip, cibleType: "compte", cibleId: compte.id, compteConcerne: compte.id, details: { motif: compte.suspendu ? "suspendu" : "mot_de_passe" } });
    if (verrouiller) await journaliser({ action: "compte.verrouille", ip, cibleType: "compte", cibleId: compte.id, compteConcerne: compte.id, details: { minutes: VERROU_MIN } });
    return { erreur: MESSAGE_GENERIQUE, champs: { email } };
  }

  const deuxFacteurs = await aUnDeuxiemeFacteur(compte);
  await db.update(comptes).set({ tentativesEchouees: 0, verrouilleJusqua: null }).where(eq(comptes.id, compte.id));
  await creerSession(compte.id, !deuxFacteurs);
  if (deuxFacteurs) {
    await journaliser({ action: "connexion.premier_facteur", acteurId: compte.id, acteurRole: compte.role, ip, compteConcerne: compte.id });
    redirect("/connexion/verification");
  }
  await finaliserConnexion(compte.id, compte.role, ip);
  redirect(destination(compte.role, compte.onboardingEtape));
}

async function finaliserConnexion(compteId: string, role: string, ip: string) {
  await db.update(comptes).set({ derniereConnexion: new Date(), derniereIp: ip }).where(eq(comptes.id, compteId));
  await journaliser({ action: "connexion.reussie", acteurId: compteId, acteurRole: role, ip, compteConcerne: compteId });
}

export async function verifierCode(_: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  const s = await lireSession();
  if (!s) redirect("/connexion");
  const { ip } = await contexteRequete();
  if (!(await limiter(`2fa:${s.sessionId}`, 6, 900)).ok) {
    await terminerSession();
    await journaliser({ action: "2fa.limitee", acteurId: s.compte.id, ip, compteConcerne: s.compte.id });
    redirect("/connexion?raison=2fa");
  }
  const saisie = String(form.get("code") ?? "").trim();
  const c = s.compte;
  let ok = false;
  let methode = "totp";
  if (/^\d{6}$/.test(saisie) && c.totpActif && c.totpSecretChiffre) {
    const secret = dechiffrerTexte(c.totpSecretChiffre, await cleClient(c.id), `totp:${c.id}`);
    ok = verifierTotp(saisie, secret);
  } else if (saisie.length >= 10) {
    methode = "code_secours";
    const h = sha256(normaliserCodeSecours(saisie));
    if (c.codesSecoursHash.includes(h)) {
      ok = true;
      await db.update(comptes).set({ codesSecoursHash: c.codesSecoursHash.filter((x) => x !== h) }).where(eq(comptes.id, c.id));
    }
  }
  if (!ok) {
    await journaliser({ action: "2fa.echec", acteurId: c.id, ip, compteConcerne: c.id, details: { methode } });
    return { erreur: "Code incorrect." };
  }
  await validerDeuxiemeFacteur();
  await finaliserConnexion(c.id, c.role, ip);
  if (methode === "code_secours") await journaliser({ action: "2fa.code_secours_utilise", acteurId: c.id, ip, compteConcerne: c.id });
  redirect(destination(c.role, c.onboardingEtape));
}

const schemaInscription = z.object({
  email: z.email("Adresse e-mail invalide.").max(200),
  motDePasse: z.string().max(128),
  confirmation: z.string(),
  cgu: z.literal("on", { error: "Vous devez accepter les conditions d'utilisation." }),
});

export async function inscription(_: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  const brut = Object.fromEntries(form);
  const email = String(brut.email ?? "").trim().toLowerCase();
  const { ip } = await contexteRequete();
  if (!(await limiter(`inscription:${ip}`, 5, 3600)).ok) return { erreur: "Trop d'inscriptions depuis cette adresse. Réessayez plus tard.", champs: { email } };
  const r = schemaInscription.safeParse({ ...brut, email });
  if (!r.success) return { erreur: r.error.issues[0].message, champs: { email } };
  const faible = evaluerMotDePasse(r.data.motDePasse, email);
  if (faible) return { erreur: faible, champs: { email } };
  if (r.data.motDePasse !== r.data.confirmation) return { erreur: "Les deux mots de passe ne correspondent pas.", champs: { email } };

  const [existe] = await db.select({ id: comptes.id }).from(comptes).where(eq(comptes.email, email));
  if (existe) return { erreur: "Un compte existe déjà avec cet e-mail. Connectez-vous ou réinitialisez le mot de passe.", champs: { email } };

  const [c] = await db.insert(comptes).values({ email, motDePasseHash: await hacher(r.data.motDePasse), role: "client", onboardingEtape: 1 }).returning();
  await cleClient(c.id); // clé du coffre créée dès l'inscription
  await journaliser({ action: "compte.cree", acteurId: c.id, acteurRole: "client", ip, cibleType: "compte", cibleId: c.id, compteConcerne: c.id, details: { consentement_cgu: new Date().toISOString() } });
  await creerSession(c.id, true);
  await finaliserConnexion(c.id, "client", ip);
  redirect("/onboarding");
}

export async function deconnexion() {
  const s = await lireSession();
  await terminerSession();
  if (s) await journaliser({ action: "deconnexion", acteurId: s.compte.id, acteurRole: s.compte.role, compteConcerne: s.compte.id });
  redirect("/connexion");
}

export async function demanderReinitialisation(_: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const { ip } = await contexteRequete();
  const reponse = { succes: "Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé. Il expire dans 30 minutes." };
  if (!(await limiter(`reinit:${ip}`, 5, 3600)).ok || !(await limiter(`reinit:${email}`, 3, 3600)).ok) return reponse;
  const [c] = await db.select().from(comptes).where(eq(comptes.email, email));
  if (!c) return reponse;
  const jeton = jetonAleatoire(32);
  await db.insert(jetonsReinitialisation).values({ id: sha256(jeton), compteId: c.id, expireLe: new Date(Date.now() + 30 * 60_000) });
  const lien = `${config.urlPublique}/mot-de-passe/nouveau?jeton=${jeton}`;
  await envoyerEmail({
    a: c.email,
    sujet: "Réinitialisation de votre mot de passe HPT",
    texte: `Bonjour,\n\nPour choisir un nouveau mot de passe, ouvrez ce lien (valable 30 minutes) :\n${lien}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez ce message : votre mot de passe reste inchangé.\n\nHPT GIE`,
  });
  await journaliser({ action: "mot_de_passe.demande", ip, cibleType: "compte", cibleId: c.id, compteConcerne: c.id });
  return reponse;
}

export async function reinitialiser(_: EtatFormulaire, form: FormData): Promise<EtatFormulaire> {
  const jeton = String(form.get("jeton") ?? "");
  const motDePasse = String(form.get("motDePasse") ?? "");
  const { ip } = await contexteRequete();
  const [j] = await db
    .select({ j: jetonsReinitialisation, c: comptes })
    .from(jetonsReinitialisation)
    .innerJoin(comptes, eq(comptes.id, jetonsReinitialisation.compteId))
    .where(and(eq(jetonsReinitialisation.id, sha256(jeton)), isNull(jetonsReinitialisation.utiliseLe), gt(jetonsReinitialisation.expireLe, new Date())));
  if (!j) return { erreur: "Lien invalide ou expiré. Refaites une demande." };
  const faible = evaluerMotDePasse(motDePasse, j.c.email);
  if (faible) return { erreur: faible };
  if (motDePasse !== String(form.get("confirmation") ?? "")) return { erreur: "Les deux mots de passe ne correspondent pas." };
  await db.update(comptes).set({ motDePasseHash: await hacher(motDePasse), motDePasseChangeLe: new Date(), tentativesEchouees: 0, verrouilleJusqua: null }).where(eq(comptes.id, j.c.id));
  await db.update(jetonsReinitialisation).set({ utiliseLe: new Date() }).where(eq(jetonsReinitialisation.id, j.j.id));
  await db.update(sessions).set({ revoqueLe: new Date() }).where(and(eq(sessions.compteId, j.c.id), isNull(sessions.revoqueLe)));
  await journaliser({ action: "mot_de_passe.reinitialise", ip, cibleType: "compte", cibleId: j.c.id, compteConcerne: j.c.id });
  redirect("/connexion?raison=reinitialise");
}
