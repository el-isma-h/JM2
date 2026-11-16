"use client";

/** Formulaires du profil : nom, mot de passe, thème, objectif quotidien. */
import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Check, Desktop, Moon, Sun } from "@phosphor-icons/react";
import { DAILY_GOAL_OPTIONS } from "@/domain/streak";
import { changePasswordAction, updateDailyGoalAction, updateNameAction, type ProfileFormState } from "@/server/actions/profile";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useTheme, type ThemePref } from "@/components/ui/theme-toggle";
import { toast } from "@/components/feedback/toaster";
import { cn } from "@/lib/utils";

function useFormToast(state: ProfileFormState) {
  React.useEffect(() => {
    if (state?.ok) toast({ title: state.ok });
  }, [state]);
}

export function NameForm({ firstName, lastName, locked }: { firstName: string; lastName: string; locked: boolean }) {
  const [state, action, pending] = React.useActionState(updateNameAction, null);
  useFormToast(state);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <Field label="Prénom" htmlFor="firstName" error={state?.fieldErrors?.firstName}>
        <Input id="firstName" name="firstName" defaultValue={firstName} autoComplete="given-name" disabled={locked} required maxLength={80} aria-invalid={!!state?.fieldErrors?.firstName} />
      </Field>
      <Field label="Nom" htmlFor="lastName" error={state?.fieldErrors?.lastName}>
        <Input id="lastName" name="lastName" defaultValue={lastName} autoComplete="family-name" disabled={locked} required maxLength={80} aria-invalid={!!state?.fieldErrors?.lastName} />
      </Field>
      {state?.error ? (
        <p className="text-[12.5px] text-danger-ink sm:col-span-2" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="sm:col-span-2">
        <Button type="submit" variant="secondary" loading={pending} disabled={locked}>
          Enregistrer le nom
        </Button>
      </div>
    </form>
  );
}

export function PasswordForm({ locked }: { locked: boolean }) {
  const [state, action, pending] = React.useActionState(changePasswordAction, null);
  const formRef = React.useRef<HTMLFormElement>(null);
  useFormToast(state);
  React.useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);
  const fe = state?.fieldErrors ?? {};
  return (
    <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
      <Field label="Mot de passe actuel" htmlFor="current" error={fe.current} className="sm:col-span-2">
        <Input id="current" name="current" type="password" autoComplete="current-password" disabled={locked} required aria-invalid={!!fe.current} />
      </Field>
      <Field label="Nouveau mot de passe" htmlFor="password" help="12 caractères minimum, avec majuscule, minuscule et chiffre." error={fe.password}>
        <Input id="password" name="password" type="password" autoComplete="new-password" disabled={locked} required minLength={12} aria-invalid={!!fe.password} />
      </Field>
      <Field label="Confirmation" htmlFor="confirm" error={fe.confirm}>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" disabled={locked} required aria-invalid={!!fe.confirm} />
      </Field>
      {state?.error ? (
        <p className="text-[12.5px] text-danger-ink sm:col-span-2" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="sm:col-span-2">
        <Button type="submit" variant="secondary" loading={pending} disabled={locked}>
          Changer le mot de passe
        </Button>
      </div>
    </form>
  );
}

const THEMES: { id: ThemePref; label: string; Icon: typeof Sun }[] = [
  { id: "light", label: "Clair", Icon: Sun },
  { id: "dark", label: "Sombre", Icon: Moon },
  { id: "system", label: "Système", Icon: Desktop },
];

export function ThemeChoice() {
  const [pref, setPref] = useTheme();
  return <Segmented name="theme" label="Thème" value={pref} onChange={(v) => setPref(v as ThemePref)} options={THEMES.map((t) => ({ value: t.id, label: t.label, icon: <t.Icon size={16} aria-hidden /> }))} />;
}

export function DailyGoalChoice({ value }: { value: number }) {
  const router = useRouter();
  const [goal, setGoal] = React.useState(value);
  const [pending, start] = React.useTransition();
  const onChange = (v: string) => {
    const xp = Number(v);
    const prev = goal;
    setGoal(xp);
    start(async () => {
      const r = await updateDailyGoalAction(xp);
      if (!r.ok) {
        setGoal(prev);
        toast({ kind: "error", title: r.error ?? "Objectif non enregistré." });
      } else {
        toast({ title: `Objectif quotidien : ${xp} XP` });
        router.refresh();
      }
    });
  };
  return (
    <div aria-busy={pending}>
      <Segmented
        name="goal"
        label="Objectif quotidien"
        value={String(goal)}
        onChange={onChange}
        columns={4}
        options={DAILY_GOAL_OPTIONS.map((o) => {
          const [title, detail] = o.label.split(" — ");
          return { value: String(o.xp), label: title, detail: `${o.xp} XP${detail ? ` · ${detail}` : ""}` };
        })}
      />
    </div>
  );
}

/** Choix exclusif en cartes (radiogroup natif : flèches du clavier). */
function Segmented({ name, label, value, onChange, options, columns = 3 }: { name: string; label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string; detail?: string; icon?: React.ReactNode }[]; columns?: 3 | 4 }) {
  const reduce = useReducedMotion();
  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div className={cn("grid gap-px border border-line bg-line", columns === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3")}>
        {options.map((o) => {
          const on = o.value === value;
          return (
            <label key={o.value} className={cn("relative flex cursor-pointer flex-col gap-1 p-4 transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus", on ? "bg-bg" : "bg-bg-elev hover:bg-bg-sunken")}>
              <input type="radio" name={name} value={o.value} checked={on} onChange={() => onChange(o.value)} className="sr-only" />
              {on ? <motion.span layoutId={`seg-${name}`} className="absolute inset-x-0 top-0 h-[2px] bg-accent" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }} /> : null}
              <span className={cn("flex items-center gap-2 text-[13px]", on ? "text-ink" : "text-ink-2")}>
                {o.icon}
                {o.label}
                {on ? <Check size={13} weight="bold" className="ml-auto text-accent" aria-hidden /> : null}
              </span>
              {o.detail ? <span className="num text-[11px] text-ink-3">{o.detail}</span> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
