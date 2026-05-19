"use client";

import { useState, useTransition } from "react";
import type { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "@/i18n/nl";
import { resetPassword, setActive } from "./actions";

type RowUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
};

/**
 * One row of the users table.
 *
 * Lives in a client component so we can keep "expand to reset password"
 * state and surface inline error messages without a full page nav.
 */
export function UserRow({ user, isSelf }: { user: RowUser; isSelf: boolean }) {
  const [pending, startTransition] = useTransition();
  const [showReset, setShowReset] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetErr, setResetErr] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);

  const toggleActive = () => {
    setActionErr(null);
    const fd = new FormData();
    fd.set("userId", user.id);
    fd.set("active", String(!user.active));
    startTransition(async () => {
      const result = await setActive({ ok: true }, fd);
      if (!result.ok) setActionErr(result.error);
    });
  };

  const submitReset = (formData: FormData) => {
    setResetMsg(null);
    setResetErr(null);
    formData.set("userId", user.id);
    startTransition(async () => {
      const result = await resetPassword({ ok: true }, formData);
      if (result.ok) {
        setResetMsg(result.message ?? t.users.save);
        setShowReset(false);
      } else {
        setResetErr(result.error);
      }
    });
  };

  return (
    <>
      <tr className="border-t border-border">
        <td className="px-4 py-3">
          <div className="font-medium text-fg">
            {user.name}
            {isSelf ? (
              <span className="ml-2 text-xs text-fg-subtle">(jij)</span>
            ) : null}
          </div>
        </td>
        <td className="px-4 py-3 text-fg-subtle">{user.email}</td>
        <td className="px-4 py-3">
          {user.role === "ADMIN" ? t.users.roleAdmin : t.users.roleMechanic}
        </td>
        <td className="px-4 py-3">
          {user.active ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
              {t.users.active}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-fg-subtle">
              <span className="h-2 w-2 rounded-full bg-fg-subtle" aria-hidden />
              {t.users.inactive}
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowReset((v) => !v)}
              disabled={pending}
            >
              {t.users.resetPassword}
            </Button>
            <Button
              size="sm"
              variant={user.active ? "outline" : "primary"}
              onClick={toggleActive}
              disabled={pending || (isSelf && user.active)}
              title={
                isSelf && user.active ? t.users.cannotDeactivateSelf : undefined
              }
            >
              {user.active ? t.users.deactivate : t.users.activate}
            </Button>
          </div>
          {resetMsg ? (
            <p className="mt-2 text-right text-xs text-success">{resetMsg}</p>
          ) : null}
          {actionErr ? (
            <p className="mt-2 text-right text-xs text-danger">{actionErr}</p>
          ) : null}
        </td>
      </tr>
      {showReset ? (
        <tr className="bg-border/20 border-t border-border">
          <td colSpan={5} className="px-4 py-3">
            <form
              action={submitReset}
              className="flex flex-wrap items-end gap-3"
            >
              <div className="min-w-[280px] flex-1 space-y-1">
                <Label htmlFor={`new-pw-${user.id}`}>
                  Nieuw wachtwoord (min. 10 tekens)
                </Label>
                <Input
                  id={`new-pw-${user.id}`}
                  name="password"
                  type="text"
                  autoComplete="new-password"
                  required
                  minLength={10}
                />
              </div>
              <Button type="submit" size="md" disabled={pending}>
                {pending ? t.users.creating : t.users.save}
              </Button>
              <Button
                type="button"
                size="md"
                variant="ghost"
                onClick={() => setShowReset(false)}
              >
                {t.users.cancel}
              </Button>
              {resetErr ? (
                <p className="basis-full text-sm text-danger">{resetErr}</p>
              ) : null}
            </form>
          </td>
        </tr>
      ) : null}
    </>
  );
}
