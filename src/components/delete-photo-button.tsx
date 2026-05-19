"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n/nl";
import { deletePhoto } from "@/app/(app)/vehicles/[id]/maintenance/actions";

/**
 * Tiny client wrapper around the deletePhoto server action so we can
 * window.confirm() before submission. Lives in its own file so PhotoGrid
 * can stay a pure server component.
 */
export function DeletePhotoButton({ photoId }: { photoId: string }) {
  return (
    <form
      action={deletePhoto}
      onSubmit={(ev) => {
        if (!window.confirm(t.maintenance.photos.deleteConfirm)) {
          ev.preventDefault();
        }
      }}
    >
      <input type="hidden" name="photoId" value={photoId} />
      <Button
        type="submit"
        size="sm"
        variant="danger"
        aria-label={t.maintenance.photos.delete}
        className="h-7 w-7 p-0"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
      </Button>
    </form>
  );
}
