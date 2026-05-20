"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n/nl";
import { deleteMaintenanceEntry } from "@/app/(app)/vehicles/[id]/maintenance/actions";

/**
 * Tiny client wrapper around the delete server action.
 *
 * Lives in its own file so the (server-rendered) timeline doesn't have
 * to be marked `"use client"` just to gate one window.confirm() call.
 */
export function DeleteEntryButton({ entryId }: { entryId: string }) {
  return (
    <form
      action={deleteMaintenanceEntry}
      onSubmit={(ev) => {
        if (!window.confirm(t.maintenance.deleteConfirm)) {
          ev.preventDefault();
        }
      }}
      className="inline-flex"
    >
      <input type="hidden" name="id" value={entryId} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="min-h-[44px] min-w-[44px] px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
        <span className="sr-only sm:not-sr-only sm:ml-1">
          {t.maintenance.delete}
        </span>
      </Button>
    </form>
  );
}
