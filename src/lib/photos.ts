import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, basename } from "node:path";
import sharp from "sharp";

/**
 * Photo storage helpers.
 *
 * Files live on disk, never in the database. The DB row has the
 * filename; the bytes live at PHOTOS_DIR/<filename>. In production
 * PHOTOS_DIR is mapped to a Docker volume so it survives image rebuilds
 * and is included in the nightly off-site backup.
 *
 * All uploaded images are normalised on the way in:
 *   - rotated based on EXIF orientation, then EXIF stripped
 *   - resized to fit within 2000 x 2000 (no upscaling)
 *   - re-encoded as JPEG quality 80 with mozjpeg
 *
 * That gives us predictable mime types, no metadata leakage, and
 * roughly 200-400 KB per photo.
 */

export const MAX_PHOTOS_PER_ENTRY = 10;
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB before we resize

export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const PHOTOS_DIR = process.env.PHOTOS_DIR ?? "./photos";

/**
 * Compute the absolute path on disk for a stored photo. Refuses any
 * filename containing path separators — defence against `../etc/passwd`
 * style traversal.
 */
export function photoPath(filename: string): string {
  const safe = basename(filename);
  if (safe !== filename || safe.length === 0) {
    throw new Error("Invalid photo filename");
  }
  return join(PHOTOS_DIR, safe);
}

async function ensureDir(): Promise<void> {
  if (!existsSync(PHOTOS_DIR)) {
    await mkdir(PHOTOS_DIR, { recursive: true });
  }
}

export type ProcessedPhoto = {
  filename: string;
  mimeType: "image/jpeg";
  sizeBytes: number;
};

/**
 * Resize, strip EXIF, and write a single uploaded image to disk.
 *
 * Sharp throws on unrecognised inputs (e.g. a renamed PDF), which the
 * caller surfaces as a per-file error. We never trust the client-
 * provided mimeType — the actual format is detected by sharp.
 */
export async function saveProcessedPhoto(
  file: File,
  filename: string
): Promise<ProcessedPhoto> {
  await ensureDir();

  const bytes = await file.arrayBuffer();
  const buf = Buffer.from(bytes);

  const out = await sharp(buf)
    .rotate() // honour EXIF orientation, then drop EXIF
    .resize({
      width: 2000,
      height: 2000,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();

  const target = photoPath(filename);
  await writeFile(target, out);

  return {
    filename,
    mimeType: "image/jpeg",
    sizeBytes: out.byteLength,
  };
}

/**
 * Best-effort delete; missing files are silently OK because the DB row
 * is the source of truth. We don't want a 404 on disk to break the
 * delete-photo server action.
 */
export async function deletePhotoFile(filename: string): Promise<void> {
  try {
    await unlink(photoPath(filename));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
}

export async function readPhotoFile(filename: string): Promise<Buffer> {
  return readFile(photoPath(filename));
}
