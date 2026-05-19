"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { t } from "@/i18n/nl";
import {
  createMaintenanceEntry,
  updateMaintenanceEntry,
  type MaintenanceFormState,
} from "./actions";
import { emptyPart, PartsEditor, type PartDraft } from "./parts-editor";

const initialState: MaintenanceFormState = { ok: true };

export type MaintenanceFormDefaults = {
  id?: string;
  date?: Date;
  km?: number;
  oilType?: string | null;
  oilLiters?: number | null;
  notes?: string | null;
  parts?: PartDraft[];
};

const today = () => {
  const d = new Date();
  // toISOString gives UTC; subtract the timezone offset so the date
  // input shows today's local date even at 23:00 in Brussels.
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000);
  return local.toISOString().slice(0, 10);
};

const toDateInput = (d?: Date) => {
  if (!d) return today();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60 * 1000);
  return local.toISOString().slice(0, 10);
};

/**
 * Shared form for creating and editing a maintenance entry.
 *
 * Parts are managed in client state so the user can add/remove rows
 * without server round-trips. On submit the parts array is serialised
 * into a hidden `parts` JSON field — the server action revalidates it
 * with zod regardless.
 */
export function MaintenanceForm({
  vehicleId,
  mode,
  defaults = {},
}: {
  vehicleId: string;
  mode: "create" | "edit";
  defaults?: MaintenanceFormDefaults;
}) {
  const action =
    mode === "create" ? createMaintenanceEntry : updateMaintenanceEntry;
  const [state, formAction, pending] = useActionState(action, initialState);
  const fieldErrors = !state.ok ? state.fieldErrors : undefined;

  const [parts, setParts] = useState<PartDraft[]>(
    defaults.parts && defaults.parts.length > 0 ? defaults.parts : [emptyPart()]
  );

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <input type="hidden" name="vehicleId" value={vehicleId} />
      {mode === "edit" && defaults.id ? (
        <input type="hidden" name="id" value={defaults.id} />
      ) : null}
      {/* Parts are JSON-encoded into a single field; server zod-revalidates. */}
      <input type="hidden" name="parts" value={JSON.stringify(parts)} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          id="date"
          label={t.maintenance.fields.date}
          type="date"
          required
          autoFocus={mode === "create"}
          defaultValue={toDateInput(defaults.date)}
          error={fieldErrors?.date}
        />
        <Field
          id="km"
          label={t.maintenance.fields.km}
          type="number"
          inputMode="numeric"
          min={0}
          required
          defaultValue={defaults.km ?? ""}
          error={fieldErrors?.km}
        />
        <Field
          id="oilLiters"
          label={t.maintenance.fields.oilLiters}
          type="number"
          inputMode="decimal"
          step="0.1"
          min={0}
          max={99.99}
          defaultValue={defaults.oilLiters ?? ""}
          error={fieldErrors?.oilLiters}
        />
      </div>

      <Field
        id="oilType"
        label={t.maintenance.fields.oilType}
        autoComplete="off"
        defaultValue={defaults.oilType ?? ""}
        error={fieldErrors?.oilType}
        hint="Bv. Castrol Edge 5W30"
      />

      <div className="space-y-1.5">
        <Label htmlFor="notes">{t.maintenance.fields.notes}</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={defaults.notes ?? ""}
          aria-invalid={!!fieldErrors?.notes}
        />
        {fieldErrors?.notes ? (
          <p className="text-sm text-danger">{fieldErrors.notes}</p>
        ) : null}
      </div>

      <section className="space-y-3 border-t border-border pt-4">
        <h3 className="text-lg font-semibold">{t.maintenance.parts.title}</h3>
        <PartsEditor parts={parts} onChange={setParts} />
      </section>

      {!state.ok && state.error ? (
        <p
          role="alert"
          className="border-danger/40 bg-danger/5 rounded border px-3 py-2 text-sm text-danger"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button asChild variant="ghost" className="w-full sm:w-auto">
          <Link href={`/vehicles/${vehicleId}`}>{t.users.cancel}</Link>
        </Button>
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending
            ? t.users.creating
            : mode === "create"
              ? t.maintenance.new
              : t.users.save}
        </Button>
      </div>
    </form>
  );
}
