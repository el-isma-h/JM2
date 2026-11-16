"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, PaperPlaneTilt } from "@phosphor-icons/react";
import { inviteAction, renewInvitationAction, type InviteState } from "@/server/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Notice } from "@/components/ui/surface";
import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ROLE_LABELS = { learner: "Apprenant", trainer: "Formateur", admin: "Administrateur" } as const;

export function CopyField({ value, label = "Lien d'activation" }: { value: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const i = document.createElement("textarea");
      i.value = value;
      document.body.appendChild(i);
      i.select();
      document.execCommand("copy");
      i.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <div>
      <p className="mb-1.5 text-[12px] text-ink-3">{label}</p>
      <div className="flex">
        <input readOnly value={value} onFocus={(e) => e.currentTarget.select()} className="h-10 min-w-0 flex-1 border border-line-strong bg-bg-sunken px-3 font-mono text-[12px] text-ink outline-none" aria-label={label} data-testid="invitation-link" />
        <button type="button" onClick={copy} className="inline-flex h-10 shrink-0 items-center gap-2 border border-l-0 border-ink bg-ink px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-bg transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copié" : "Copier"}
        </button>
      </div>
    </div>
  );
}

export function InviteForm({ roles, mailEnabled }: { roles: ("learner" | "trainer" | "admin")[]; mailEnabled: boolean }) {
  const [state, action, pending] = useActionState<InviteState, FormData>(inviteAction, null);
  const formRef = React.useRef<HTMLFormElement>(null);
  React.useEffect(() => {
    if (state?.result) formRef.current?.reset();
  }, [state]);
  const v = state?.values;
  return (
    <div>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2" noValidate>
        <Field label="E-mail" htmlFor="inv-email" required error={state?.fieldErrors?.email} className="sm:col-span-2">
          <Input id="inv-email" name="email" type="email" autoComplete="off" required defaultValue={v?.email} aria-invalid={Boolean(state?.fieldErrors?.email)} placeholder="prenom.nom@entreprise.fr" />
        </Field>
        <Field label="Prénom" htmlFor="inv-first" error={state?.fieldErrors?.firstName}>
          <Input id="inv-first" name="firstName" autoComplete="off" defaultValue={v?.firstName} />
        </Field>
        <Field label="Nom" htmlFor="inv-last" error={state?.fieldErrors?.lastName}>
          <Input id="inv-last" name="lastName" autoComplete="off" defaultValue={v?.lastName} />
        </Field>
        <Field label="Rôle" htmlFor="inv-role" error={state?.fieldErrors?.role} className="sm:col-span-2" help={roles.length === 1 ? "En tant que formateur, vous invitez des apprenants." : "Le formateur voit tout l'espace d'administration, sauf les réglages et les rôles."}>
          <Select id="inv-role" name="role" defaultValue={v?.role ?? "learner"}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <Button type="submit" loading={pending}>
            <PaperPlaneTilt size={14} /> {mailEnabled ? "Envoyer l'invitation" : "Créer l'invitation"}
          </Button>
          <p className="text-[12px] text-ink-3">{mailEnabled ? "Un e-mail part immédiatement ; le lien s'affiche aussi ci-dessous." : "Envoi d'e-mails non configuré : vous transmettez vous-même le lien."}</p>
        </div>
      </form>
      {state?.error ? <Notice tone="danger" className="mt-4">{state.error}</Notice> : null}
      <AnimatePresence>
        {state?.result ? (
          <motion.div key={state.result.url} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: [0.165, 0.84, 0.44, 1] }} className="overflow-hidden">
            <div className="mt-6 border-t border-line pt-5">
              <Notice tone={state.result.mailError ? "warn" : "ok"}>
                {state.result.sent
                  ? `Invitation envoyée à ${state.result.email}.`
                  : state.result.mailError
                    ? `L'e-mail à ${state.result.email} n'est pas parti (${state.result.mailError}). Copiez le lien ci-dessous.`
                    : `Invitation créée pour ${state.result.email}. Copiez le lien et transmettez-le : il est valable 14 jours et ne sera plus affiché.`}
              </Notice>
              <div className="mt-4">
                <CopyField value={state.result.url} />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export type InvitationItem = {
  id: string;
  email: string;
  name: string;
  role: "learner" | "trainer" | "admin";
  state: "pending" | "accepted" | "expired";
  createdAt: string;
  expiresAt: string;
  acceptedAt: string | null;
  invitedBy: string | null;
  canRenew: boolean;
};

const dt = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short", year: "numeric" });

export function InvitationList({ items }: { items: InvitationItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<"all" | "pending" | "accepted" | "expired">("all");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [renewed, setRenewed] = React.useState<Record<string, { url?: string; message: string; ok: boolean }>>({});
  const shown = items.filter((i) => filter === "all" || i.state === filter);

  async function renew(id: string) {
    setBusy(id);
    try {
      const r = await renewInvitationAction(id);
      setRenewed((m) => ({ ...m, [id]: r.ok ? { url: r.url, message: r.message, ok: true } : { message: r.error, ok: false } }));
      if (r.ok) router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-line px-5 py-3" role="radiogroup" aria-label="Filtrer par état">
        {(["all", "pending", "accepted", "expired"] as const).map((f) => (
          <button
            key={f}
            type="button"
            role="radio"
            aria-checked={filter === f}
            onClick={() => setFilter(f)}
            className={cn("border px-3 py-1.5 text-[12.5px] transition-colors", filter === f ? "border-ink bg-ink text-bg" : "border-line-strong text-ink-2 hover:text-ink")}
          >
            {f === "all" ? "Toutes" : f === "pending" ? "Envoyées" : f === "accepted" ? "Acceptées" : "Expirées"}{" "}
            <span className="num opacity-70">{f === "all" ? items.length : items.filter((i) => i.state === f).length}</span>
          </button>
        ))}
      </div>
      <ul className="divide-y divide-line">
        {shown.map((i) => {
          const r = renewed[i.id];
          return (
            <li key={i.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] text-ink">
                    {i.name || i.email}
                    <span className="ml-2 align-middle">
                      <StatusBadge status={i.role} />
                    </span>
                  </p>
                  <p className="truncate text-[12px] text-ink-3">
                    {i.name ? `${i.email} · ` : ""}
                    invitée le {dt.format(new Date(i.createdAt))}
                    {i.invitedBy ? ` par ${i.invitedBy}` : ""} ·{" "}
                    {i.state === "accepted" ? `acceptée le ${dt.format(new Date(i.acceptedAt!))}` : i.state === "expired" ? `expirée le ${dt.format(new Date(i.expiresAt))}` : `expire le ${dt.format(new Date(i.expiresAt))}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={i.state === "pending" ? "pending" : i.state} />
                  {i.state !== "accepted" && i.canRenew ? (
                    <Button size="sm" variant="secondary" loading={busy === i.id} onClick={() => renew(i.id)}>
                      {i.state === "expired" ? "Renouveler" : "Renvoyer"}
                    </Button>
                  ) : null}
                </div>
              </div>
              {r ? (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 space-y-3">
                  <Notice tone={r.ok ? "ok" : "danger"}>{r.message}</Notice>
                  {r.url ? <CopyField value={r.url} label="Nouveau lien (l'ancien ne fonctionne plus)" /> : null}
                </motion.div>
              ) : null}
            </li>
          );
        })}
        {shown.length === 0 ? <li className="px-5 py-10 text-center text-[13.5px] text-ink-2">Aucune invitation dans cette catégorie.</li> : null}
      </ul>
    </div>
  );
}
