"use server";

/**
 * Clés API du tuteur : clé personnelle (tout utilisateur connecté, sauf compte démo) et clé de la plateforme
 * (administrateur uniquement). La clé est testée par un appel minimal avant d'être enregistrée chiffrée ;
 * elle n'est jamais renvoyée en clair.
 */
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/server/auth";
import { canManageSettings } from "@/lib/roles";
import { AI_PROVIDERS, PROVIDERS, maskKey, resolveModel, validateKeyShape, type AiProviderId } from "@/lib/ai";
import { routes } from "@/lib/paths";
import { syncBadges } from "@/server/gamification";
import { deletePersonalKey, deletePlatformKey, getPersonalKey, getPlatformKey, savePersonalKey, savePlatformKey } from "@/server/ai/keys";
import { testCredentials } from "@/server/ai/client";
import { logAdminAction } from "@/server/admin/audit";

export type KeyFormState = {
  ok?: boolean;
  message?: string;
  error?: string;
  warning?: string;
  fieldErrors?: Record<string, string>;
  values?: { provider?: string; model?: string };
  newBadges?: string[];
} | null;

const formSchema = z.object({
  provider: z.enum(AI_PROVIDERS),
  key: z.string().max(400),
  model: z.string().trim().max(80).optional(),
});

function readForm(formData: FormData) {
  return formSchema.safeParse({ provider: formData.get("provider"), key: String(formData.get("key") ?? ""), model: String(formData.get("model") ?? "") || undefined });
}

function modelFor(provider: AiProviderId, model: string | undefined) {
  return model && PROVIDERS[provider].models.some((m) => m.id === model) ? model : null;
}

async function checkAndSave(formData: FormData, save: (v: { provider: AiProviderId; key: string; model: string | null }) => Promise<void>): Promise<KeyFormState> {
  const parsed = readForm(formData);
  if (!parsed.success) return { error: "Choisissez un fournisseur et collez votre clé." };
  const { provider } = parsed.data;
  const key = parsed.data.key.trim();
  const model = modelFor(provider, parsed.data.model);
  const values = { provider, model: model ?? "" };
  const shape = validateKeyShape(provider, key);
  if (shape) return { fieldErrors: { key: shape }, values };
  const test = await testCredentials({ provider, key, model: resolveModel(provider, model, process.env) });
  if (!test.ok && !/joindre/.test(test.error)) return { fieldErrors: { key: test.error }, values };
  await save({ provider, key, model });
  if (!test.ok) return { ok: true, values, message: `Clé ${maskKey(key)} enregistrée et chiffrée.`, warning: `${test.error} Le test sera à refaire une fois le serveur connecté.` };
  return { ok: true, values, message: `Clé ${maskKey(key)} vérifiée auprès de ${PROVIDERS[provider].company} et enregistrée chiffrée.` };
}

// ---------- Clé personnelle ----------

export async function savePersonalKeyAction(_prev: KeyFormState, formData: FormData): Promise<KeyFormState> {
  const user = await getSession();
  if (!user) return { error: "Session expirée : reconnectez-vous." };
  if (user.isDemo) return { error: "Le compte démo ne peut pas enregistrer de clé personnelle." };
  const res = await checkAndSave(formData, (v) => savePersonalKey(user.id, v));
  if (res?.ok) {
    res.newBadges = await syncBadges(user.id).catch(() => []);
    revalidatePath(routes.apiKey);
    revalidatePath(routes.profile);
  }
  return res;
}

export async function testPersonalKeyAction(): Promise<KeyFormState> {
  const user = await getSession();
  if (!user) return { error: "Session expirée : reconnectez-vous." };
  const k = await getPersonalKey(user.id);
  if (!k) return { error: "Aucune clé personnelle enregistrée." };
  const t = await testCredentials({ provider: k.provider, key: k.key, model: resolveModel(k.provider, k.model, process.env) });
  return t.ok ? { ok: true, message: `La clé ${maskKey(k.key)} fonctionne (${t.model}).` } : { error: t.error };
}

export async function deletePersonalKeyAction(): Promise<KeyFormState> {
  const user = await getSession();
  if (!user) return { error: "Session expirée : reconnectez-vous." };
  if (user.isDemo) return { error: "Action indisponible sur le compte démo." };
  await deletePersonalKey(user.id);
  revalidatePath(routes.apiKey);
  revalidatePath(routes.profile);
  return { ok: true, message: "Clé supprimée de la plateforme. Pensez à la révoquer aussi dans la console du fournisseur." };
}

// ---------- Clé de la plateforme (admin) ----------

async function admin() {
  const user = await getSession();
  if (!user || !canManageSettings(user.role)) return null;
  return user;
}

export async function savePlatformKeyAction(_prev: KeyFormState, formData: FormData): Promise<KeyFormState> {
  const user = await admin();
  if (!user) return { error: "Réservé aux administrateurs." };
  const res = await checkAndSave(formData, async (v) => {
    await savePlatformKey(v);
    await logAdminAction(user.id, "settings.ai.save", { refId: v.provider, details: { masked: maskKey(v.key), model: v.model } });
  });
  if (res?.ok) revalidatePath(routes.adminSettings);
  return res;
}

export async function testPlatformKeyAction(): Promise<KeyFormState> {
  const user = await admin();
  if (!user) return { error: "Réservé aux administrateurs." };
  const k = await getPlatformKey();
  if (!k) return { error: "Aucune clé de plateforme enregistrée." };
  const t = await testCredentials({ provider: k.provider, key: k.key, model: resolveModel(k.provider, k.model, process.env) });
  await logAdminAction(user.id, "settings.ai.test", { refId: k.provider, details: { ok: t.ok } });
  return t.ok ? { ok: true, message: `La clé ${maskKey(k.key)} répond correctement (${t.model}).` } : { error: t.error };
}

export async function testEnvKeyAction(provider: AiProviderId): Promise<KeyFormState> {
  const user = await admin();
  if (!user) return { error: "Réservé aux administrateurs." };
  const key = process.env[PROVIDERS[provider]?.envKey ?? ""]?.trim();
  if (!key) return { error: "Variable d'environnement absente." };
  const t = await testCredentials({ provider, key, model: resolveModel(provider, null, process.env) });
  return t.ok ? { ok: true, message: `${PROVIDERS[provider].envKey} répond correctement (${t.model}).` } : { error: t.error };
}

export async function deletePlatformKeyAction(): Promise<KeyFormState> {
  const user = await admin();
  if (!user) return { error: "Réservé aux administrateurs." };
  await deletePlatformKey();
  await logAdminAction(user.id, "settings.ai.delete");
  revalidatePath(routes.adminSettings);
  return { ok: true, message: "Clé de la plateforme supprimée." };
}
