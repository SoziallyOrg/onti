import Link from "next/link";
import type { VehicleListItem } from "@/lib/vehicles";
import { formatDate } from "@/lib/format";

/**
 * Renders the result rows on /vehicles. Server component — no client
 * state needed since selection is just navigation.
 */
export function VehicleList({ vehicles }: { vehicles: VehicleListItem[] }) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-bg">
      {vehicles.map((v) => (
        <li key={v.id}>
          <Link
            href={`/vehicles/${v.id}`}
            className="hover:bg-border/30 focus-visible:bg-border/30 flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors"
          >
            <span className="min-w-[7rem] font-mono font-semibold text-fg">
              {v.plate}
            </span>
            <span className="font-medium text-fg">
              {v.make} {v.model}
              {v.modelYear ? (
                <span className="text-fg-subtle"> · {v.modelYear}</span>
              ) : null}
            </span>
            <span className="text-fg-subtle">{v.customerName}</span>
            <span className="ml-auto font-mono text-xs text-fg-subtle">
              {v.vin}
            </span>
            <span className="text-xs text-fg-subtle">
              {formatDate(v.updatedAt)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
