"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";
import { vehicleSchema, updateVehicleSchema } from "@/lib/validators";
import { t } from "@/i18n/nl";

type FieldErrors = Partial<Record<string, string>>;

export type VehicleFormState =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

function flattenZodErrors<T extends z.ZodSchema>(
  err: z.ZodError<z.infer<T>>
): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function readFormData(formData: FormData) {
  return {
    vin: formData.get("vin"),
    plate: formData.get("plate"),
    make: formData.get("make"),
    model: formData.get("model"),
    engine: formData.get("engine"),
    modelYear: formData.get("modelYear"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
  };
}

function isUniqueViolation(err: unknown): boolean {
  return Boolean(
    err &&
    typeof err === "object" &&
    "code" in err &&
    (err as { code: string }).code === "P2002"
  );
}

/**
 * Create a vehicle.
 *
 * Any logged-in user can add cars — that's the daily-use case (mechanic
 * sees a new wagen, registers it). VIN uniqueness violations come back
 * as a friendly field-level error rather than a 500.
 */
export async function createVehicle(
  _prev: VehicleFormState,
  formData: FormData
): Promise<VehicleFormState> {
  await requireUser();

  const parsed = vehicleSchema.safeParse(readFormData(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: t.errors.unknown,
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  let createdId: string;
  try {
    const created = await db.vehicle.create({ data: parsed.data });
    createdId = created.id;
  } catch (err) {
    if (isUniqueViolation(err)) {
      return {
        ok: false,
        error: t.vehicles.actions.vinExists,
        fieldErrors: { vin: t.vehicles.actions.vinExists },
      };
    }
    throw err;
  }

  revalidatePath("/vehicles");
  revalidatePath("/");
  redirect(`/vehicles/${createdId}`);
}

/**
 * Update an existing vehicle. Same validation as create. VIN can be
 * edited (rare but happens — typo correction) and is still unique-checked.
 */
export async function updateVehicle(
  _prev: VehicleFormState,
  formData: FormData
): Promise<VehicleFormState> {
  await requireUser();

  const parsed = updateVehicleSchema.safeParse({
    id: formData.get("id"),
    ...readFormData(formData),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: t.errors.unknown,
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  const { id, ...data } = parsed.data;
  try {
    await db.vehicle.update({ where: { id }, data });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return {
        ok: false,
        error: t.vehicles.actions.vinExists,
        fieldErrors: { vin: t.vehicles.actions.vinExists },
      };
    }
    throw err;
  }

  revalidatePath("/vehicles");
  revalidatePath(`/vehicles/${id}`);
  revalidatePath("/");
  redirect(`/vehicles/${id}`);
}

/**
 * Archive / unarchive a vehicle (soft delete).
 *
 * Form-action style — bound to a button. We never do hard deletes:
 * cars come back, customers ring up about historical work, etc.
 */
export async function toggleArchiveVehicle(formData: FormData): Promise<void> {
  await requireUser();

  const id = formData.get("id");
  const wantArchived = formData.get("archived") === "true";
  if (typeof id !== "string" || id.length === 0) return;

  await db.vehicle.update({
    where: { id },
    data: { archived: wantArchived },
  });

  revalidatePath("/vehicles");
  revalidatePath(`/vehicles/${id}`);
  revalidatePath("/");
  // Redirect back to force a full page refresh with the new state
  redirect(`/vehicles/${id}`);
}
