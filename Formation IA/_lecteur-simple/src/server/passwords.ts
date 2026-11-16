/** Hachage bcrypt (sans dépendance à Next : utilisable par les scripts). */
import bcrypt from "bcryptjs";

export const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Règle de robustesse : 12 caractères, majuscule, minuscule, chiffre. Renvoie un message d'erreur ou null. */
export function validatePasswordStrength(pw: string): string | null {
  if (pw.length < 12) return "12 caractères minimum.";
  if (pw.length > 200) return "200 caractères maximum.";
  if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw) || !/[0-9]/.test(pw)) return "Au moins une majuscule, une minuscule et un chiffre.";
  return null;
}
