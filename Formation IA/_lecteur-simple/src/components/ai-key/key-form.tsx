"use client";

/**
 * Formulaire « Enregistrer ma clé » (clé personnelle) ou clé de la plateforme (admin) :
 * choix du fournisseur et du modèle, test immédiat par un appel minimal, chiffrement, suppression.
 * La clé enregistrée n'est jamais réaffichée : seule sa version masquée l'est.
 */
import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeSlash, ShieldCheck } from "@phosphor-icons/react";
import { AI_PROVIDERS, PROVIDERS, type AiProviderId } from "@/lib/ai";
import type { KeyFormState } from "@/server/actions/ai-key";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Notice } from "@/components/ui/surface";
import { celebrate } from "@/components/ui/celebrate";
import { cn } from "@/lib/utils";

export type KeyStatusView = { configured: false } | { configured: true; provider: AiProviderId; masked: string; model: string; updatedAt: string | null };

const dt = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "long", year: "numeric" });

export function KeyStatusLine({ status, emptyLabel = "Aucune clé enregistrée" }: { status: KeyStatusView; emptyLabel?: string }) {
  if (!status.configured) return <p className="text-[13.5px] text-ink-2">{emptyLabel}</p>;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px]">
      <span className="inline-flex items-center gap-2 text-ok-ink">
        <ShieldCheck size={16} weight="fill" aria-hidden /> Configurée
      </span>
      <span className="text-ink">{PROVIDERS[status.provider].company}</span>
      <span className="num text-ink-2" data-testid="masked-key">
        {status.masked}
      </span>
      <span className="text-ink-3">{status.model}</span>
      {status.updatedAt ? <span className="text-ink-3">· {dt.format(new Date(status.updatedAt))}</span> : null}
    </div>
  );
}

export function KeyForm({
  status,
  saveAction,
  testAction,
  deleteAction,
  disabledReason,
  submitLabel = "Tester et enregistrer",
}: {
  status: KeyStatusView;
  saveAction: (prev: KeyFormState, fd: FormData) => Promise<KeyFormState>;
  testAction: () => Promise<KeyFormState>;
  deleteAction: () => Promise<KeyFormState>;
  disabledReason?: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<KeyFormState, FormData>(saveAction, null);
  const [provider, setProvider] = React.useState<AiProviderId>(status.configured ? status.provider : "anthropic");
  const [show, setShow] = React.useState(false);
  const [side, setSide] = React.useState<KeyFormState>(null);
  const [sidePending, startSide] = React.useTransition();
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const info = PROVIDERS[provider];

  React.useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      if (state.newBadges?.length) void celebrate();
      router.refresh();
    }
  }, [state, router]);

  function runSide(fn: () => Promise<KeyFormState>, refresh = false) {
    startSide(async () => {
      const r = await fn();
      setSide(r);
      setConfirmDelete(false);
      if (refresh && r?.ok) router.refresh();
    });
  }

  const disabled = Boolean(disabledReason);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border border-line bg-bg px-4 py-3.5">
        <KeyStatusLine status={status} />
        {status.configured ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="secondary" loading={sidePending && !confirmDelete} onClick={() => runSide(testAction)}>
              Tester
            </Button>
            {confirmDelete ? (
              <>
                <Button size="sm" variant="danger" loading={sidePending} onClick={() => runSide(deleteAction, true)} disabled={disabled}>
                  Confirmer la suppression
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Annuler
                </Button>
              </>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(true)} disabled={disabled}>
                Supprimer
              </Button>
            )}
          </div>
        ) : null}
      </div>
      <AnimatePresence>
        {side ? (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Notice tone={side.ok ? "ok" : "danger"}>{side.ok ? side.message : side.error}</Notice>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {disabled ? <Notice tone="info">{disabledReason}</Notice> : null}

      <form ref={formRef} action={action} onSubmit={() => setSide(null)} className="space-y-5" noValidate>
        <fieldset disabled={disabled} className="space-y-5 disabled:opacity-50">
          <div>
            <legend className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink-3">Fournisseur</legend>
            <div className="grid grid-cols-3 border border-line-strong" role="radiogroup">
              {AI_PROVIDERS.map((p) => (
                <label key={p} className={cn("relative flex cursor-pointer flex-col items-start gap-0.5 border-l border-line-strong px-3 py-3 transition-colors first:border-l-0", provider === p ? "bg-ink text-bg" : "text-ink hover:bg-bg-sunken")}>
                  <input type="radio" name="provider" value={p} checked={provider === p} onChange={() => setProvider(p)} className="sr-only" />
                  <span className="text-[13.5px] font-medium">{PROVIDERS[p].company}</span>
                  <span className={cn("text-[11.5px]", provider === p ? "text-bg/70" : "text-ink-3")}>{PROVIDERS[p].name}</span>
                </label>
              ))}
            </div>
          </div>
          <Field label="Clé API" htmlFor="ai-key" required error={state?.fieldErrors?.key} help={`Une clé ${info.company} commence par « ${info.keyPrefix} ». Elle est vérifiée puis chiffrée (AES-256-GCM) ; elle ne sera plus jamais affichée.`}>
            <div className="flex">
              <Input
                id="ai-key"
                name="key"
                type={show ? "text" : "password"}
                autoComplete="off"
                spellCheck={false}
                placeholder={info.keyExample}
                className="font-mono text-[13px]"
                aria-invalid={Boolean(state?.fieldErrors?.key)}
                required
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-l-0 border-line-strong text-ink-2 hover:text-ink" aria-label={show ? "Masquer la clé" : "Afficher la clé"}>
                {show ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>
          <Field label="Modèle" htmlFor="ai-model" help="Le premier modèle de la liste suffit largement pour le tutorat et coûte le moins cher.">
            <Select id="ai-model" name="model" key={provider} defaultValue={status.configured && status.provider === provider ? status.model : info.defaultModel}>
              {info.models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" loading={pending}>
              {submitLabel}
            </Button>
            {pending ? <span className="text-[12.5px] text-ink-3">Appel de test auprès de {info.company}…</span> : null}
          </div>
        </fieldset>
      </form>
      <AnimatePresence>
        {state?.ok || state?.error ? (
          <motion.div key={state.message ?? state.error} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            {state.ok ? <Notice tone="ok">{state.message}</Notice> : <Notice tone="danger">{state.error}</Notice>}
            {state.warning ? <Notice tone="warn">{state.warning}</Notice> : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
