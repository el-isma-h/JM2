/**
 * Stockage chiffré des clés IA (AES-256-GCM, `encrypt(…, "ai-key")`) :
 * - clé personnelle : `user_settings` (aiProvider, aiKeyEncrypted, aiModel) ;
 * - clé plateforme : `app_settings["ai.platform"]` = JSON { provider, key, model } chiffré.
 * Les clés ne sortent JAMAIS en clair vers le client : seules les versions masquées (`maskKey`) sont exposées.
 */
import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { decrypt, encrypt } from "@/lib/crypto";
import { envCredentials, isAiProvider, maskKey, resolveCredentials, resolveModel, type AiProviderId, type ResolvedCredentials, type StoredKey } from "@/lib/ai";

export const PLATFORM_KEY_SETTING = "ai.platform";

export type KeyStatus = { configured: false } | { configured: true; provider: AiProviderId; masked: string; model: string; updatedAt: Date | null };

function safeDecrypt(payload: string | null | undefined): string | null {
  if (!payload) return null;
  try {
    return decrypt(payload, "ai-key");
  } catch {
    return null; // APP_SECRET changé ou donnée corrompue : on considère la clé absente.
  }
}

export async function getPersonalKey(userId: string): Promise<(StoredKey & { updatedAt: Date }) | null> {
  const [row] = await db.select().from(schema.userSettings).where(eq(schema.userSettings.userId, userId)).limit(1);
  const key = safeDecrypt(row?.aiKeyEncrypted);
  if (!row || !key || !isAiProvider(row.aiProvider)) return null;
  return { provider: row.aiProvider, key, model: row.aiModel, updatedAt: row.updatedAt };
}

export async function savePersonalKey(userId: string, input: StoredKey): Promise<void> {
  const values = { aiProvider: input.provider, aiKeyEncrypted: encrypt(input.key.trim(), "ai-key"), aiModel: input.model ?? null, updatedAt: new Date() };
  await db
    .insert(schema.userSettings)
    .values({ userId, ...values })
    .onConflictDoUpdate({ target: schema.userSettings.userId, set: values });
}

export async function deletePersonalKey(userId: string): Promise<void> {
  await db.update(schema.userSettings).set({ aiProvider: null, aiKeyEncrypted: null, aiModel: null, updatedAt: new Date() }).where(eq(schema.userSettings.userId, userId));
}

export async function getPlatformKey(): Promise<(StoredKey & { updatedAt: Date }) | null> {
  const [row] = await db.select().from(schema.appSettings).where(eq(schema.appSettings.key, PLATFORM_KEY_SETTING)).limit(1);
  const json = safeDecrypt(row?.valueEncrypted);
  if (!row || !json) return null;
  try {
    const v = JSON.parse(json) as Partial<StoredKey>;
    if (!isAiProvider(v.provider) || typeof v.key !== "string" || !v.key) return null;
    return { provider: v.provider, key: v.key, model: typeof v.model === "string" ? v.model : null, updatedAt: row.updatedAt };
  } catch {
    return null;
  }
}

export async function savePlatformKey(input: StoredKey): Promise<void> {
  const valueEncrypted = encrypt(JSON.stringify({ provider: input.provider, key: input.key.trim(), model: input.model ?? null }), "ai-key");
  await db
    .insert(schema.appSettings)
    .values({ key: PLATFORM_KEY_SETTING, valueEncrypted })
    .onConflictDoUpdate({ target: schema.appSettings.key, set: { valueEncrypted, updatedAt: new Date() } });
}

export async function deletePlatformKey(): Promise<void> {
  await db.delete(schema.appSettings).where(eq(schema.appSettings.key, PLATFORM_KEY_SETTING));
}

export function statusOf(k: (StoredKey & { updatedAt?: Date }) | null): KeyStatus {
  if (!k) return { configured: false };
  return { configured: true, provider: k.provider, masked: maskKey(k.key), model: resolveModel(k.provider, k.model, process.env), updatedAt: k.updatedAt ?? null };
}

export function envKeyStatus(): KeyStatus {
  return statusOf(envCredentials(process.env));
}

/** Clé effective pour le tuteur de cet utilisateur (personnelle > environnement > plateforme). */
export async function credentialsFor(userId: string): Promise<ResolvedCredentials | null> {
  const [personal, platform] = await Promise.all([getPersonalKey(userId), getPlatformKey()]);
  return resolveCredentials({ personal, platform, env: process.env });
}
