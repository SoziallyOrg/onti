import Link from "next/link";
import type { VehicleListItem } from "@/lib/vehicles";
import { formatDate } from "@/lib/format";
import { ChevronRight } from "lucide-react";

/**
 * Renders the result rows on /vehicles. Server component — no client
 * state needed since selection is just navigation.
 *
 * Mobile: stacked layout with plate prominent, car + customer below.
 * Desktop: single-line with all info visible.
 */
export function VehicleList({ vehicles }: { vehicles: VehicleListItem[] }) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-bg">
      {vehicles.map((v) => (
        <li key={v.id}>
          <Link
            href={`/vehicles/${v.id}`}
            className="hover:bg-border/30 focus-visible:bg-border/30 active:bg-border/50 flex items-center gap-3 px-4 py-3 transition-colors"
          >
            {/* Main content: stacks on mobile, inline on desktop */}
            <div className="min-w-0 flex-1">
              {/* Row 1: plate + make/model */}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <span className="font-mono text-base font-semibold text-fg">
                  {v.plate}
                </span>
                <span className="text-sm font-medium text-fg">
                  {v.make} {v.model}
                  {v.modelYear ? (
                    <span className="text-fg-subtle"> · {v.modelYear}</span>
                  ) : null}
                </span>
              </div>
              {/* Row 2: customer + meta */}
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-fg-subtle">
                <span>{v.customerName}</span>
                <span className="hidden font-mono sm:inline">{v.vin}</span>
                <span>{formatDate(v.updatedAt)}</span>
              </div>
            </div>
            {/* Chevron: affordance that the row is tappable */}
            <ChevronRight
              className="h-4 w-4 shrink-0 text-fg-subtle"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
