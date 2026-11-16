import { createCipheriv, createDecipheriv, createHash, hkdfSync, randomBytes, timingSafeEqual } from "node:crypto";

function appSecret(): string {
  const s = process.env.APP_SECRET;
  if (!s || s.length < 32) throw new Error("APP_SECRET manquant ou trop court (32 caractères minimum).");
  return s;
}

function key(purpose: string): Buffer {
  return Buffer.from(hkdfSync("sha256", appSecret(), "next-rh", purpose, 32));
}

/** Chiffre une chaîne sensible (RIB, NIR, secret TOTP) en AES-256-GCM. Format : v1.iv.tag.data (base64url). */
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

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Masque un IBAN : FR76 **** **** **** 1234 */
export function maskIban(last4: string): string {
  return `**** **** **** **** ${last4}`;
}
