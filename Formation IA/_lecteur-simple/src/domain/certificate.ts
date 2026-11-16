/**
 * Numéro de certificat : `NF-IA-N{n}-{AAAA}-{6 car.}` (SPEC § Certificat), ex. NF-IA-N1-2026-7KQ3XM.
 * Alphabet sans caractères ambigus (pas de 0/O, 1/I/L) pour la saisie manuelle sur /verifier.
 * L'année est celle de délivrance à Paris. L'unicité est garantie par l'index unique en base : en cas de collision,
 * regénérer (probabilité ≈ 1 / 30^6 ≈ 1,4e-9 par paire).
 */
import { TIME_ZONE } from "./streak";

export const CERT_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const CERT_SUFFIX_LENGTH = 6;
export const CERT_NUMBER_REGEX = /^NF-IA-N([1-9])-(\d{4})-([23456789ABCDEFGHJKMNPQRSTUVWXYZ]{6})$/;

const yearFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric" });

/** `rand` renvoie un réel dans [0, 1) ; utiliser `cryptoRandom` (lib/crypto) en production. */
export function generateCertificateNumber(levelId: string, issuedAt: Date, rand: () => number): string {
  const m = /^N([1-9])$/.exec(levelId);
  if (!m) throw new Error(`Identifiant de niveau invalide : ${levelId}`);
  const year = yearFormatter.format(issuedAt);
  let suffix = "";
  for (let i = 0; i < CERT_SUFFIX_LENGTH; i++) suffix += CERT_ALPHABET[Math.floor(rand() * CERT_ALPHABET.length) % CERT_ALPHABET.length];
  return `NF-IA-N${m[1]}-${year}-${suffix}`;
}

/** Normalise une saisie (espaces, minuscules) puis valide le format. Renvoie null si invalide. */
export function normalizeCertificateNumber(input: string): string | null {
  const s = input.trim().toUpperCase().replace(/\s+/g, "");
  return CERT_NUMBER_REGEX.test(s) ? s : null;
}

export function parseCertificateNumber(n: string): { level: number; year: number; suffix: string } | null {
  const m = CERT_NUMBER_REGEX.exec(n);
  return m ? { level: Number(m[1]), year: Number(m[2]), suffix: m[3] } : null;
}

/** Chemin public de vérification (sans basePath : utiliser `absoluteUrl()` pour le QR code). */
export function verificationPath(number: string): string {
  return `/verifier/${encodeURIComponent(number)}`;
}
