"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { t } from "@/i18n/nl";
import { createVehicle, updateVehicle, type VehicleFormState } from "./actions";

const initialState: VehicleFormState = { ok: true };

export type VehicleFormDefaults = {
  id?: string;
  vin?: string;
  plate?: string;
  make?: string;
  model?: string;
  engine?: string | null;
  modelYear?: number | null;
  customerName?: string;
  customerPhone?: string | null;
};

/**
 * Shared form for creating and editing a vehicle.
 *
 * Same field set both ways — the `mode` prop just picks which server
 * action to bind and which submit label to show.
 */
export function VehicleForm({
  mode,
  defaults = {},
}: {
  mode: "create" | "edit";
  defaults?: VehicleFormDefaults;
}) {
  const action = mode === "create" ? createVehicle : updateVehicle;
  const [state, formAction, pending] = useActionState(action, initialState);
  const fieldErrors = !state.ok ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {mode === "edit" && defaults.id ? (
        <input type="hidden" name="id" value={defaults.id} />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="plate"
          label={t.vehicles.fields.plate}
          hint={t.vehicles.hints.plate}
          autoComplete="off"
          autoCapitalize="characters"
          autoFocus={mode === "create"}
          required
          defaultValue={defaults.plate ?? ""}
          error={fieldErrors?.plate}
        />
        <Field
          id="vin"
          label={t.vehicles.fields.vin}
          hint={t.vehicles.hints.vin}
          autoComplete="off"
          autoCapitalize="characters"
          required
          defaultValue={defaults.vin ?? ""}
          error={fieldErrors?.vin}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="make"
          label={t.vehicles.fields.make}
          autoComplete="off"
          required
          defaultValue={defaults.make ?? ""}
          error={fieldErrors?.make}
        />
        <Field
          id="model"
          label={t.vehicles.fields.model}
          autoComplete="off"
          required
          defaultValue={defaults.model ?? ""}
          error={fieldErrors?.model}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="engine"
          label={t.vehicles.fields.engine}
          autoComplete="off"
          defaultValue={defaults.engine ?? ""}
          error={fieldErrors?.engine}
        />
        <Field
          id="modelYear"
          label={t.vehicles.fields.modelYear}
          type="number"
          inputMode="numeric"
          min={1900}
          max={new Date().getFullYear() + 1}
          defaultValue={defaults.modelYear ?? ""}
          error={fieldErrors?.modelYear}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="customerName"
          label={t.vehicles.fields.customerName}
          autoComplete="off"
          required
          defaultValue={defaults.customerName ?? ""}
          error={fieldErrors?.customerName}
        />
        <Field
          id="customerPhone"
          label={t.vehicles.fields.customerPhone}
          type="tel"
          inputMode="tel"
          autoComplete="off"
          defaultValue={defaults.customerPhone ?? ""}
          error={fieldErrors?.customerPhone}
        />
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
          <Link
            href={
              mode === "edit" && defaults.id
                ? `/vehicles/${defaults.id}`
                : "/vehicles"
            }
          >
            {t.users.cancel}
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending
            ? t.users.creating
            : mode === "create"
              ? t.vehicles.new
              : t.users.save}
        </Button>
      </div>
    </form>
  );
}
