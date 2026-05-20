"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-helpers";
import {
  maintenanceEntrySchema,
  updateMaintenanceEntrySchema,
} from "@/lib/validators";
import {
  ALLOWED_MIME_TYPES,
  MAX_PHOTOS_PER_ENTRY,
  MAX_UPLOAD_BYTES,
  deletePhotoFile,
  saveProcessedPhoto,
} from "@/lib/photos";
import { t } from "@/i18n/nl";

type FieldErrors = Partial<Record<string, string>>;

export type MaintenanceFormState =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

export type PhotoUploadState =
  | { ok: true; uploaded: number }
  | { ok: false; error: string };

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
 * Owner check used by every entry-mutation action. Returns the entry
 * if the caller may act on it, otherwise null.
 */
async function getEntryIfAuthorized(
  entryId: string,
  user: { id: string; role: "ADMIN" | "MECHANIC" }
) {
  const entry = await db.maintenanceEntry.findUnique({
    where: { id: entryId },
    select: { id: true, vehicleId: true, createdById: true },
  });
  if (!entry) return null;
  if (entry.createdById === user.id || user.role === "ADMIN") return entry;
  return null;
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

  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > MAX_PHOTOS_PER_ENTRY) {
    return {
      ok: false,
      error: t.maintenance.photos.tooMany,
    };
  }

  for (const f of files) {
    if (f.size > MAX_UPLOAD_BYTES) {
      return { ok: false, error: t.maintenance.photos.tooLarge };
    }
    if (!ALLOWED_MIME_TYPES.has(f.type)) {
      return { ok: false, error: t.maintenance.photos.wrongType };
    }
  }

  const { parts, ...entryData } = parsed.data;

  const entry = await db.maintenanceEntry.create({
    data: {
      ...entryData,
      createdById: me.id,
      parts: { create: parts },
    },
  });

  const uploadedFilenames: string[] = [];
  try {
    for (const f of files) {
      const filename = `${randomUUID()}.jpg`;
      const processed = await saveProcessedPhoto(f, filename);
      uploadedFilenames.push(processed.filename);
      await db.photo.create({
        data: {
          maintenanceId: entry.id,
          filename: processed.filename,
          mimeType: processed.mimeType,
          sizeBytes: processed.sizeBytes,
        },
      });
    }
  } catch (error) {
    console.error("Failed to upload photos during creation:", error);
    await Promise.all(uploadedFilenames.map((name) => deletePhotoFile(name).catch(() => {})));
    await db.maintenanceEntry.delete({ where: { id: entry.id } }).catch(() => {});
    return {
      ok: false,
      error: t.maintenance.photos.uploadError,
    };
  }

  revalidatePath(`/vehicles/${parsed.data.vehicleId}`);
  revalidatePath("/");
  redirect(`/vehicles/${parsed.data.vehicleId}`);
}

/**
 * Update an existing entry. Strategy: validate, then in a single
 * transaction wipe the existing parts and recreate from the new list.
 *
 * Replace-all is simpler than diffing rows, and parts have no
 * meaningful identity to preserve.
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

  const entry = await getEntryIfAuthorized(parsed.data.id, me);
  if (!entry) {
    return { ok: false, error: t.maintenance.actions.forbidden };
  }

  const { id, parts, vehicleId, ...entryData } = parsed.data;
  void vehicleId; // can't be reassigned via this action

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

  revalidatePath(`/vehicles/${entry.vehicleId}`);
  revalidatePath(`/vehicles/${entry.vehicleId}/maintenance/${id}/edit`);
  redirect(`/vehicles/${entry.vehicleId}`);
}

/**
 * Delete a maintenance entry. Cascade drops parts and photo rows; we
 * also unlink the photo files from disk because Postgres can't reach
 * into the volume.
 */
export async function deleteMaintenanceEntry(
  formData: FormData
): Promise<void> {
  const me = await requireUser();

  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) return;

  const entry = await getEntryIfAuthorized(id, me);
  if (!entry) return;

  // Capture filenames before the cascade nukes the rows.
  const photos = await db.photo.findMany({
    where: { maintenanceId: id },
    select: { filename: true },
  });

  await db.maintenanceEntry.delete({ where: { id } });

  await Promise.all(photos.map((p) => deletePhotoFile(p.filename)));

  revalidatePath(`/vehicles/${entry.vehicleId}`);
  revalidatePath("/");
}

/**
 * Upload one or more photos and attach them to an existing entry.
 *
 * Per-file failures (corrupt image, oversized, wrong type) are folded
 * into a single state — we don't want to roll back the photos that did
 * succeed just because one was a renamed PDF.
 */
export async function uploadPhotos(
  _prev: PhotoUploadState,
  formData: FormData
): Promise<PhotoUploadState> {
  const me = await requireUser();

  const entryId = formData.get("entryId");
  if (typeof entryId !== "string" || entryId.length === 0) {
    return { ok: false, error: t.errors.unknown };
  }

  const entry = await getEntryIfAuthorized(entryId, me);
  if (!entry) {
    return { ok: false, error: t.maintenance.actions.forbidden };
  }

  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return { ok: false, error: t.errors.unknown };
  }

  // Reject on counts before we burn CPU on resize.
  const existingCount = await db.photo.count({
    where: { maintenanceId: entryId },
  });
  if (existingCount + files.length > MAX_PHOTOS_PER_ENTRY) {
    return { ok: false, error: t.maintenance.photos.tooMany };
  }

  for (const f of files) {
    if (f.size > MAX_UPLOAD_BYTES) {
      return { ok: false, error: t.maintenance.photos.tooLarge };
    }
    if (!ALLOWED_MIME_TYPES.has(f.type)) {
      return { ok: false, error: t.maintenance.photos.wrongType };
    }
  }

  let uploaded = 0;
  let anyFailed = false;

  for (const f of files) {
    const filename = `${randomUUID()}.jpg`;
    try {
      const processed = await saveProcessedPhoto(f, filename);
      await db.photo.create({
        data: {
          maintenanceId: entryId,
          filename: processed.filename,
          mimeType: processed.mimeType,
          sizeBytes: processed.sizeBytes,
        },
      });
      uploaded += 1;
    } catch (err) {
      anyFailed = true;
      // Best-effort: if we wrote the file but the DB insert fell over,
      // try to remove the orphaned file. The opposite case (DB row
      // without file) can't happen because we write the file first.
      await deletePhotoFile(filename).catch(() => {});
      console.error("photo upload failed", err);
    }
  }

  revalidatePath(`/vehicles/${entry.vehicleId}`);
  revalidatePath(`/vehicles/${entry.vehicleId}/maintenance/${entryId}/edit`);

  if (uploaded === 0) {
    return { ok: false, error: t.maintenance.photos.uploadError };
  }
  if (anyFailed) {
    return { ok: false, error: t.maintenance.photos.uploadError };
  }
  return { ok: true, uploaded };
}

/**
 * Delete a single photo from an entry. DB row first, then disk.
 */
export async function deletePhoto(formData: FormData): Promise<void> {
  const me = await requireUser();

  const photoId = formData.get("photoId");
  if (typeof photoId !== "string" || photoId.length === 0) return;

  const photo = await db.photo.findUnique({
    where: { id: photoId },
    select: {
      id: true,
      filename: true,
      maintenance: {
        select: { id: true, vehicleId: true, createdById: true },
      },
    },
  });
  if (!photo) return;

  const canEdit =
    photo.maintenance.createdById === me.id || me.role === "ADMIN";
  if (!canEdit) return;

  await db.photo.delete({ where: { id: photoId } });
  await deletePhotoFile(photo.filename);

  revalidatePath(`/vehicles/${photo.maintenance.vehicleId}`);
  revalidatePath(
    `/vehicles/${photo.maintenance.vehicleId}/maintenance/${photo.maintenance.id}/edit`
  );
}
