"use server";

/**
 * Server actions d'authentification (CSRF géré par Next : vérification de l'origine des server actions).
 */
import { redirect } from "next/navigation";
import { z } from "zod";
import { safeNextPath } from "@/lib/utils";
import { sharedLimiter } from "@/lib/rate-limit";
import { routes } from "@/lib/paths";
import { acceptInvitation, peekInvitation } from "@/server/invitations";
import { authenticate, createSession, destroySession, requestMeta, validatePasswordStrength } from "@/server/auth";

export type FormState = { error?: string; fieldErrors?: Record<string, string>; values?: Record<string, string> } | null;

const loginByIp = sharedLimiter("login-ip", { limit: 30, windowMs: 15 * 60_000 });
const loginByAccount = sharedLimiter("login-account", { limit: 5, windowMs: 15 * 60_000 });

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide.").max(254),
  password: z.string().min(1, "Mot de passe requis.").max(200),
  suite: z.string().optional(),
});

function minutes(ms: number) {
  return Math.max(1, Math.ceil(ms / 60_000));
}

const INVALID: FormState = { error: "Requête invalide. Rechargez la page." };

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!(formData instanceof FormData)) return INVALID;
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password"), suite: formData.get("suite") ?? undefined });
  const email = String(formData.get("email") ?? "");
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { fieldErrors, values: { email } };
  }
  const { ip } = await requestMeta();
  const ipHit = loginByIp.hit(`ip:${ip ?? "?"}`);
  const accHit = loginByAccount.hit(`acc:${ip ?? "?"}:${parsed.data.email}`);
  if (!ipHit.allowed || !accHit.allowed) {
    return { error: `Trop de tentatives. Réessayez dans ${minutes(Math.max(ipHit.retryAfterMs, accHit.retryAfterMs))} min.`, values: { email } };
  }
  const user = await authenticate(parsed.data.email, parsed.data.password);
  if (!user) return { error: "E-mail ou mot de passe incorrect.", values: { email } };
  loginByAccount.reset(`acc:${ip ?? "?"}:${parsed.data.email}`);
  await createSession(user.id);
  redirect(safeNextPath(parsed.data.suite, routes.home));
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect(routes.login);
}

const activationSchema = z
  .object({
    firstName: z.string().trim().min(1, "Prénom requis.").max(80),
    lastName: z.string().trim().min(1, "Nom requis.").max(80),
    password: z.string().max(200),
    confirm: z.string().max(200),
  })
  .superRefine((v, ctx) => {
    const weak = validatePasswordStrength(v.password);
    if (weak) ctx.addIssue({ code: "custom", path: ["password"], message: weak });
    if (v.password !== v.confirm) ctx.addIssue({ code: "custom", path: ["confirm"], message: "Les mots de passe ne correspondent pas." });
  });

/** Activation d'un compte invité (le jeton est lié via .bind côté page). */
export async function activateInvitationAction(token: string, _prev: FormState, formData: FormData): Promise<FormState> {
  if (typeof token !== "string" || !(formData instanceof FormData)) return INVALID;
  const values = { firstName: String(formData.get("firstName") ?? ""), lastName: String(formData.get("lastName") ?? "") };
  const parsed = activationSchema.safeParse({ ...values, password: formData.get("password") ?? "", confirm: formData.get("confirm") ?? "" });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { fieldErrors, values };
  }
  if (!(await peekInvitation(token))) return { error: "Ce lien d'invitation n'est plus valide.", values };
  const r = await acceptInvitation(token, parsed.data);
  if (!r.ok) {
    return { error: r.error === "email_taken" ? "Un compte existe déjà pour cette adresse : connectez-vous." : "Ce lien d'invitation n'est plus valide.", values };
  }
  await createSession(r.userId);
  redirect(routes.home);
}
