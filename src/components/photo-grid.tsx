import Link from "next/link";
import type { PhotoView } from "@/lib/maintenance";
import { DeletePhotoButton } from "@/components/delete-photo-button";
import { t } from "@/i18n/nl";

/**
 * Grid of thumbnails for an entry's photos.
 *
 * The thumbnails are the full-size image scaled by the browser. With
 * `sharp` capping uploads at 2000 px, JPEG q80, that's typically ~300 KB
 * per photo — fine for a workshop wifi but worth revisiting if a garage
 * accumulates thousands of entries.
 *
 * Click on a tile opens the image in a new tab (no lightbox dependency
 * for v1).
 */
export function PhotoGrid({
  photos,
  canEdit,
}: {
  photos: PhotoView[];
  canEdit: boolean;
}) {
  if (photos.length === 0) {
    return (
      <p className="text-sm text-fg-subtle">{t.maintenance.photos.none}</p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {photos.map((p) => {
        const url = `/api/photos/${p.filename}`;
        return (
          <li
            key={p.id}
            className="bg-border/30 group relative aspect-square overflow-hidden rounded border border-border"
          >
            <Link
              href={url}
              target="_blank"
              rel="noopener"
              className="block h-full w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={p.caption ?? ""}
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </Link>
            {canEdit ? (
              <div className="absolute right-1 top-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                <DeletePhotoButton photoId={p.id} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
