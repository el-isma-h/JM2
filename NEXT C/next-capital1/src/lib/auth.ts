import { cookies } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "./db";
import type { Utilisateur } from "./types";

const COOKIE = "next_session";
const DUREE_JOURS = 7;

export async function utilisateurCourant(): Promise<Utilisateur | null> {
  const jar = await cookies();
  const jeton = jar.get(COOKIE)?.value;
  if (!jeton) return null;
  const row = db()
    .prepare(`SELECT u.* FROM sessions s JOIN utilisateurs u ON u.id = s.utilisateur_id WHERE s.jeton = ? AND s.expire_le > datetime('now')`)
    .get(jeton) as Utilisateur | undefined;
  return row ?? null;
}

export async function connecter(email: string, motDePasse: string): Promise<Utilisateur | null> {
  const u = db().prepare("SELECT * FROM utilisateurs WHERE lower(email) = lower(?)").get(email.trim()) as Utilisateur | undefined;
  if (!u || !bcrypt.compareSync(motDePasse, u.mot_de_passe_hash)) return null;
  const jeton = crypto.randomBytes(32).toString("hex");
  const expire = new Date(Date.now() + DUREE_JOURS * 86400000);
  db().prepare("INSERT INTO sessions (jeton, utilisateur_id, expire_le) VALUES (?, ?, ?)").run(jeton, u.id, expire.toISOString().replace("T", " ").slice(0, 19));
  const jar = await cookies();
  jar.set(COOKIE, jeton, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires: expire });
  return u;
}

export async function ouvrirSession(utilisateurId: number) {
  const jeton = crypto.randomBytes(32).toString("hex");
  const expire = new Date(Date.now() + DUREE_JOURS * 86400000);
  db().prepare("INSERT INTO sessions (jeton, utilisateur_id, expire_le) VALUES (?, ?, ?)").run(jeton, utilisateurId, expire.toISOString().replace("T", " ").slice(0, 19));
  const jar = await cookies();
  jar.set(COOKIE, jeton, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires: expire });
}

export async function deconnecter() {
  const jar = await cookies();
  const jeton = jar.get(COOKIE)?.value;
  if (jeton) db().prepare("DELETE FROM sessions WHERE jeton = ?").run(jeton);
  jar.delete(COOKIE);
}

export function hacher(motDePasse: string) {
  return bcrypt.hashSync(motDePasse, 10);
}
