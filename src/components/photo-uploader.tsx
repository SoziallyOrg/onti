"use client";

import { useActionState, useEffect, useRef } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n/nl";
import {
  uploadPhotos,
  type PhotoUploadState,
} from "@/app/(app)/vehicles/[id]/maintenance/actions";

const initialState: PhotoUploadState = { ok: true, uploaded: 0 };

/**
 * Multi-file upload control bound to the `uploadPhotos` server action.
 *
 * The picker accepts a wide image MIME range so iPhone HEIC uploads go
 * through; sharp normalises everything to JPEG on the server. The
 * server action enforces count, size, and type limits — this UI just
 * keeps the user from being completely surprised.
 */
export function PhotoUploader({
  entryId,
  remainingSlots,
}: {
  entryId: string;
  remainingSlots: number;
}) {
  const [state, action, pending] = useActionState(uploadPhotos, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // After a successful upload, clear the file input so the user can
  // immediately pick a new batch without a page reload. Done in an
  // effect because mutating the ref during render is a hooks violation.
  useEffect(() => {
    if (state.ok && state.uploaded > 0 && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [state]);

  const disabled = remainingSlots <= 0 || pending;

  return (
    <form ref={formRef} action={action} className="space-y-2">
      <input type="hidden" name="entryId" value={entryId} />
      <input
        ref={inputRef}
        type="file"
        name="photos"
        multiple
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        disabled={disabled}
        className="hover:file:bg-border/50 block w-full text-sm text-fg file:mr-3 file:cursor-pointer file:rounded file:border file:border-border-strong file:bg-bg file:px-3 file:py-2 file:text-sm file:font-medium file:text-fg"
        onChange={() => formRef.current?.requestSubmit()}
      />

      <p className="text-xs text-fg-subtle">
        {t.maintenance.photos.uploadHint}
        {remainingSlots > 0
          ? ` (${remainingSlots} plekken vrij)`
          : ` (${t.maintenance.photos.tooMany})`}
      </p>

      {pending ? (
        <p
          role="status"
          className="flex items-center gap-1.5 text-sm text-fg-subtle"
        >
          <Upload className="h-3.5 w-3.5 animate-pulse" aria-hidden />
          {t.maintenance.photos.uploading}
        </p>
      ) : null}

      {!state.ok ? (
        <p
          role="alert"
          className="border-danger/40 bg-danger/5 flex items-center gap-1.5 rounded border px-2 py-1 text-sm text-danger"
        >
          <AlertCircle className="h-3.5 w-3.5" aria-hidden />
          {state.error}
        </p>
      ) : null}

      {/* No-JS fallback: explicit submit. With JS, onChange auto-submits. */}
      <noscript>
        <Button type="submit" size="sm" disabled={disabled}>
          {t.maintenance.photos.add}
        </Button>
      </noscript>
    </form>
  );
}
