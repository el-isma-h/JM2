/**
 * Primitives cryptographiques (Node uniquement) — reprises de Next Formation, clé dérivée propre à Next Formation IA.
 *
 * - `encrypt` / `decrypt` : AES-256-GCM, clé dérivée d'APP_SECRET (≥ 32 caractères) par HKDF-SHA256 et par usage
 *   (`purpose`), format `v1.iv.tag.data` (base64url). Usages en place : "ai-key" (clés API apprenant et plateforme).
 * - `sha256`, `randomToken`, `safeEqual`, `cryptoRandom`.
 *
 * Ne jamais changer APP_SECRET en production : les clés API chiffrées deviendraient illisibles.
 */
import { createCipheriv, createDecipheriv, createHash, hkdfSync, randomBytes, timingSafeEqual } from "node:crypto";

export const MIN_SECRET_LENGTH = 32;

function appSecret(): string {
  const s = process.env.APP_SECRET;
  if (!s || s.length < MIN_SECRET_LENGTH) throw new Error(`APP_SECRET manquant ou trop court (${MIN_SECRET_LENGTH} caractères minimum).`);
  return s;
}

function key(purpose: string): Buffer {
  return Buffer.from(hkdfSync("sha256", appSecret(), "next-formation-ia", purpose, 32));
}

/** Chiffre une chaîne sensible (clé API…) en AES-256-GCM. */
export function encrypt(plain: string, purpose = "field"): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(purpose), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ["v1", iv.toString("base64url"), tag.toString("base64url"), data.toString("base64url")].join(".");
}

export function decrypt(payload: string, purpose = "field"): string {
  const [v, ivB, tagB, dataB] = payload.split(".");
  if (v !== "v1" || !ivB || !tagB || !dataB) throw new Error("Format chiffré invalide");
  const decipher = createDecipheriv("aes-256-gcm", key(purpose), Buffer.from(ivB, "base64url"));
  decipher.setAuthTag(Buffer.from(tagB, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(dataB, "base64url")), decipher.final()]).toString("utf8");
}

export function sha256(input: string | Buffer): string {
  return createHash("sha256").update(input).digest("hex");
}

/** Jeton aléatoire URL-safe (sessions, invitations). */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Réel uniforme dans [0, 1) issu de l'aléa cryptographique (numéros de certificat, mélange d'examen). */
export function cryptoRandom(): number {
  return randomBytes(6).readUIntBE(0, 6) / 2 ** 48;
}

/** Masque une clé API pour l'affichage : « sk-ant-…a1b2 ». */
export function maskSecret(secret: string): string {
  const s = secret.trim();
  if (s.length <= 10) return "…" + s.slice(-2);
  return `${s.slice(0, 7)}…${s.slice(-4)}`;
}
