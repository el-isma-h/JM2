"use client";

import { useActionState } from "react";
import type { FormState } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Notice } from "@/components/ui/surface";

export function ActivationForm({ action, defaults }: { action: (prev: FormState, fd: FormData) => Promise<FormState>; defaults: { firstName: string; lastName: string } }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, null);
  const fe = state?.fieldErrors ?? {};
  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state?.error ? <Notice tone="danger">{state.error}</Notice> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Prénom" htmlFor="firstName" error={fe.firstName} required>
          <Input id="firstName" name="firstName" autoComplete="given-name" defaultValue={state?.values?.firstName ?? defaults.firstName} aria-invalid={Boolean(fe.firstName)} />
        </Field>
        <Field label="Nom" htmlFor="lastName" error={fe.lastName} required>
          <Input id="lastName" name="lastName" autoComplete="family-name" defaultValue={state?.values?.lastName ?? defaults.lastName} aria-invalid={Boolean(fe.lastName)} />
        </Field>
      </div>
      <Field label="Mot de passe" htmlFor="password" error={fe.password} help="12 caractères minimum, avec majuscule, minuscule et chiffre." required>
        <Input id="password" name="password" type="password" autoComplete="new-password" aria-invalid={Boolean(fe.password)} />
      </Field>
      <Field label="Confirmation" htmlFor="confirm" error={fe.confirm} required>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" aria-invalid={Boolean(fe.confirm)} />
      </Field>
      <Button type="submit" size="lg" className="w-full" loading={pending}>
        Activer et commencer
      </Button>
    </form>
  );
}
