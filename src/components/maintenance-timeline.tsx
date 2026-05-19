import Link from "next/link";
import { Pencil } from "lucide-react";
import type { MaintenanceEntryView } from "@/lib/maintenance";
import { Button } from "@/components/ui/button";
import { formatDate, formatKm } from "@/lib/format";
import { t } from "@/i18n/nl";
import { DeleteEntryButton } from "@/components/delete-entry-button";

/**
 * Reverse-chronological timeline of maintenance entries.
 *
 * Read-side only — server component. Edit and delete are exposed per
 * row but only when the current user can act on the entry. The server
 * action enforces the same check independently.
 */
export function MaintenanceTimeline({
  vehicleId,
  entries,
  canEdit,
}: {
  vehicleId: string;
  entries: MaintenanceEntryView[];
  /**
   * Returns whether the current viewer may edit/delete this entry.
   * Lifted to a callback so the parent can encode role + ownership
   * however it likes.
   */
  canEdit: (entry: MaintenanceEntryView) => boolean;
}) {
  if (entries.length === 0) {
    return (
      <p className="rounded border border-dashed border-border-strong bg-bg p-6 text-center text-fg-subtle">
        {t.vehicles.detail.timelineEmpty}
      </p>
    );
  }

  return (
    <ol className="space-y-3 md:space-y-4">
      {entries.map((e) => (
        <li
          key={e.id}
          className="rounded-lg border border-border bg-bg p-3 shadow-sm md:p-4"
        >
          <header className="mb-3 space-y-2">
            {/* Date + km: always top-left, large enough to read at a glance */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-base font-semibold leading-tight">
                  {formatDate(e.date)}
                  <span className="ml-2 font-normal text-fg-subtle">
                    · {formatKm(e.km)}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-fg-subtle">
                  {t.maintenance.by} {e.createdBy.name}
                </p>
              </div>

              {/* Action buttons: min-h-11 (44px) tap target per Apple HIG */}
              {canEdit(e) ? (
                <div className="flex gap-1">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="min-h-[44px] min-w-[44px] px-2"
                  >
                    <Link
                      href={`/vehicles/${vehicleId}/maintenance/${e.id}/edit`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                      <span className="sr-only sm:not-sr-only sm:ml-1">
                        {t.vehicles.edit}
                      </span>
                    </Link>
                  </Button>
                  <DeleteEntryButton entryId={e.id} />
                </div>
              ) : null}
            </div>
          </header>

          {(e.oilType || e.oilLiters !== null) && (
            <p className="mb-2 text-sm">
              <span className="text-fg-subtle">
                {t.maintenance.fields.oilType}:{" "}
              </span>
              {e.oilType ?? "—"}
              {e.oilLiters !== null
                ? ` · ${e.oilLiters.toString().replace(".", ",")} L`
                : null}
            </p>
          )}

          {e.notes ? (
            <p className="mb-3 whitespace-pre-wrap text-sm text-fg">
              {e.notes}
            </p>
          ) : null}

          {e.parts.length > 0 ? (
            <details className="text-sm" open={e.parts.length <= 4}>
              <summary className="min-h-[44px] cursor-pointer py-2 font-medium text-fg">
                {t.maintenance.parts.title} ({e.parts.length})
              </summary>
              <ul className="mt-1 space-y-2">
                {e.parts.map((p) => (
                  <li
                    key={p.id}
                    className="border-border/60 bg-border/20 rounded border px-2.5 py-1.5"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="bg-border/80 rounded px-1.5 py-0.5 text-[11px] uppercase tracking-wide text-fg-muted">
                        {t.maintenance.categories[p.category]}
                      </span>
                      {p.oemNumber ? (
                        <span className="font-mono text-xs font-medium">
                          {p.oemNumber}
                        </span>
                      ) : null}
                    </div>
                    {(p.brand || p.supplier || p.notes) && (
                      <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-fg-subtle">
                        {p.brand ? <span>{p.brand}</span> : null}
                        {p.supplier ? <span>via {p.supplier}</span> : null}
                        {p.notes ? <span>— {p.notes}</span> : null}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}

          {e.photos.length > 0 ? (
            <ul className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-5 md:grid-cols-6">
              {e.photos.map((p) => (
                <li
                  key={p.id}
                  className="bg-border/30 aspect-square overflow-hidden rounded border border-border"
                >
                  <a
                    href={`/api/photos/${p.filename}`}
                    target="_blank"
                    rel="noopener"
                    className="block h-full w-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/photos/${p.filename}`}
                      alt={p.caption ?? ""}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function canUserEditEntry(
  user: { id: string; role: "ADMIN" | "MECHANIC" },
  entry: MaintenanceEntryView
) {
  return user.role === "ADMIN" || entry.createdBy.id === user.id;
}
