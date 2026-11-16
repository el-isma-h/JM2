"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Notice } from "@/components/ui/surface";

export function LoginForm({ suite }: { suite: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, null);
  return (
    <form action={action} className="space-y-5" noValidate>
      {suite ? <input type="hidden" name="suite" value={suite} /> : null}
      {state?.error ? <Notice tone="danger">{state.error}</Notice> : null}
      <Field label="E-mail" htmlFor="email" error={state?.fieldErrors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} aria-invalid={Boolean(state?.fieldErrors?.email)} autoFocus />
      </Field>
      <Field label="Mot de passe" htmlFor="password" error={state?.fieldErrors?.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" required aria-invalid={Boolean(state?.fieldErrors?.password)} />
      </Field>
      <Button type="submit" size="lg" className="w-full" loading={pending}>
        Se connecter
      </Button>
    </form>
  );
}
