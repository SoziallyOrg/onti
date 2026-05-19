"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "@/i18n/nl";
import { createUser, type FormState } from "../actions";

const initialState: FormState = { ok: true };

export function NewUserForm() {
  const [state, action, pending] = useActionState(createUser, initialState);
  const fieldErrors = !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={action} className="space-y-4" noValidate>
      <Field
        id="name"
        label={t.users.name}
        autoComplete="name"
        autoFocus
        required
        error={fieldErrors?.name}
      />

      <Field
        id="email"
        label={t.auth.email}
        type="email"
        autoComplete="email"
        required
        error={fieldErrors?.email}
      />

      <Field
        id="password"
        label={`${t.auth.password} (min. 10 tekens)`}
        type="text"
        autoComplete="new-password"
        required
        minLength={10}
        error={fieldErrors?.password}
      />

      <div className="space-y-2">
        <Label htmlFor="role">{t.users.role}</Label>
        <select
          id="role"
          name="role"
          defaultValue="MECHANIC"
          className="flex h-11 w-full rounded border border-border-strong bg-bg px-3 text-base text-fg focus-visible:border-primary"
        >
          <option value="MECHANIC">{t.users.roleMechanic}</option>
          <option value="ADMIN">{t.users.roleAdmin}</option>
        </select>
        {fieldErrors?.role ? (
          <p className="text-sm text-danger">{fieldErrors.role}</p>
        ) : null}
      </div>

      {!state.ok && state.error ? (
        <p
          role="alert"
          className="border-danger/40 bg-danger/5 rounded border px-3 py-2 text-sm text-danger"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <Button asChild variant="ghost">
          <Link href="/admin/users">{t.users.cancel}</Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? t.users.creating : t.users.create}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  ...inputProps
}: {
  id: string;
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} aria-invalid={!!error} {...inputProps} />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
