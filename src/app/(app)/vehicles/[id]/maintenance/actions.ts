"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";
import {
  maintenanceEntrySchema,
  updateMaintenanceEntrySchema,
  partsListSchema,
} from "@/lib/validators";
import { t } from "@/i18n/nl";

type FieldErrors = Partial<Record<string, string>>;

export type MaintenanceFormState =
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

/**
 * Parts come into the form as a JSON string in a hidden input. The
 * client-side parts editor manages an array in state and serialises on
 * submit; the server then revalidates with zod so we never trust the
 * client wire format.
 */
function readPartsField(formData: FormData): unknown {
  const raw = formData.get("parts");
  if (typeof raw !== "string" || raw.length === 0) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readEntryFields(formData: FormData) {
  return {
    vehicleId: formData.get("vehicleId"),
    date: formData.get("date"),
    km: formData.get("km"),
    oilType: formData.get("oilType"),
    oilLiters: formData.get("oilLiters"),
    notes: formData.get("notes"),
    parts: readPartsField(formData),
  };
}

/**
 * Create a maintenance entry along with its parts.
 *
 * Wrapped in a transaction so a failed parts insert rolls back the
 * entry too — partial state in the timeline is worse than nothing.
 */
export async function createMaintenanceEntry(
  _prev: MaintenanceFormState,
  formData: FormData
): Promise<MaintenanceFormState> {
  const me = await requireUser();

  const parsed = maintenanceEntrySchema.safeParse(readEntryFields(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: t.errors.unknown,
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  // Verify the vehicle exists before we hit the FK.
  const vehicle = await db.vehicle.findUnique({
    where: { id: parsed.data.vehicleId },
    select: { id: true },
  });
  if (!vehicle) {
    return { ok: false, error: t.errors.notFound };
  }

  const { parts, ...entryData } = parsed.data;
  await db.maintenanceEntry.create({
    data: {
      ...entryData,
      createdById: me.id,
      parts: { create: parts },
    },
  });

  revalidatePath(`/vehicles/${parsed.data.vehicleId}`);
  revalidatePath("/");
  redirect(`/vehicles/${parsed.data.vehicleId}`);
}

/**
 * Update an existing entry. Strategy: validate, then in a single
 * transaction wipe the existing parts and recreate from the new list.
 *
 * Replace-all is simpler than diffing rows, and parts have no
 * meaningful identity to preserve (no FK from photos to parts).
 */
export async function updateMaintenanceEntry(
  _prev: MaintenanceFormState,
  formData: FormData
): Promise<MaintenanceFormState> {
  const me = await requireUser();

  const parsed = updateMaintenanceEntrySchema.safeParse({
    id: formData.get("id"),
    ...readEntryFields(formData),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: t.errors.unknown,
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  const existing = await db.maintenanceEntry.findUnique({
    where: { id: parsed.data.id },
    select: { id: true, vehicleId: true, createdById: true },
  });
  if (!existing) {
    return { ok: false, error: t.errors.notFound };
  }

  const isAuthor = existing.createdById === me.id;
  const isAdmin = me.role === "ADMIN";
  if (!isAuthor && !isAdmin) {
    return { ok: false, error: t.maintenance.actions.forbidden };
  }

  const { id, parts, vehicleId, ...entryData } = parsed.data;
  void vehicleId; // vehicleId can't be reassigned via this action

  await db.$transaction([
    db.partUsed.deleteMany({ where: { maintenanceId: id } }),
    db.maintenanceEntry.update({
      where: { id },
      data: {
        ...entryData,
        parts: { create: parts },
      },
    }),
  ]);

  revalidatePath(`/vehicles/${existing.vehicleId}`);
  revalidatePath(`/vehicles/${existing.vehicleId}/maintenance/${id}/edit`);
  redirect(`/vehicles/${existing.vehicleId}`);
}

/**
 * Delete a maintenance entry. Cascade also drops its parts (and later
 * its photos in PR #7) thanks to the schema's onDelete: Cascade.
 */
export async function deleteMaintenanceEntry(
  formData: FormData
): Promise<void> {
  const me = await requireUser();

  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) return;

  const existing = await db.maintenanceEntry.findUnique({
    where: { id },
    select: { vehicleId: true, createdById: true },
  });
  if (!existing) return;

  const isAuthor = existing.createdById === me.id;
  const isAdmin = me.role === "ADMIN";
  if (!isAuthor && !isAdmin) return;

  await db.maintenanceEntry.delete({ where: { id } });

  revalidatePath(`/vehicles/${existing.vehicleId}`);
  revalidatePath("/");
}

// Re-exported for use elsewhere (if needed).
export { partsListSchema };
