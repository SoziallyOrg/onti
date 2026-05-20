import Link from "next/link";
import { Plus, Car } from "lucide-react";
import { requireUser } from "@/lib/auth-helpers";
import { listVehicles, searchVehicles } from "@/lib/vehicles";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n/nl";
import { VehicleList } from "./vehicle-list";
import { db } from "@/lib/db";
import { FilterBar } from "./filter-bar";

export const metadata = { title: `${t.vehicles.title} — ${t.app.name}` };

type SearchParams = { q?: string; archived?: string; make?: string; sort?: string };

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireUser();
  const { q, archived, make, sort } = await searchParams;
  const query = (q ?? "").trim();
  const showArchived = archived === "true";

  const vehicles =
    query.length > 0
      ? await searchVehicles(query, { archived: showArchived, make, sort })
      : await listVehicles({ archived: showArchived, make, sort });

  const isSearch = query.length > 0;

  // Retrieve count for active vs archived vehicles
  const activeCount = await db.vehicle.count({ where: { archived: false } });
  const archivedCount = await db.vehicle.count({ where: { archived: true } });

  // Get distinct makes for the currently selected tab to populate filter
  const makesResult = await db.vehicle.findMany({
    where: { archived: showArchived },
    select: { make: true },
    distinct: ["make"],
    orderBy: { make: "asc" },
  });
  const makes = makesResult.map((m) => m.make).filter(Boolean);

  return (
    <main className="w-full px-4 md:px-8 lg:px-12 py-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1>{isSearch ? t.search.resultsFor(query) : t.vehicles.title}</h1>
          {!isSearch ? (
            <p className="mt-1 text-fg-subtle">
              {vehicles.length === 0
                ? t.vehicles.list.empty
                : vehicles.length === 1
                  ? t.vehicles.list.countOne
                  : t.vehicles.list.countMany(vehicles.length)}
            </p>
          ) : (
            <p className="mt-1 text-fg-subtle">
              {vehicles.length === 0
                ? t.search.noResults
                : vehicles.length === 1
                  ? t.vehicles.list.countOne
                  : t.vehicles.list.countMany(vehicles.length)}
            </p>
          )}

          {/* Segmented Control Filter */}
          <div className="flex rounded-lg border border-border bg-muted/30 p-0.5 mt-3 w-fit">
            <Link
              href={isSearch ? `/vehicles?q=${query}` : "/vehicles"}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                !showArchived
                  ? "bg-bg text-fg shadow-sm"
                  : "text-fg-subtle hover:text-fg"
              }`}
            >
              Actieve wagens ({activeCount})
            </Link>
            <Link
              href={isSearch ? `/vehicles?q=${query}&archived=true` : "/vehicles?archived=true"}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                showArchived
                  ? "bg-bg text-fg shadow-sm"
                  : "text-fg-subtle hover:text-fg"
              }`}
            >
              Gearchiveerd ({archivedCount})
            </Link>
          </div>
        </div>
        <Button asChild>
          <Link href="/vehicles/new">
            <Plus className="h-4 w-4" aria-hidden /> {t.vehicles.new}
          </Link>
        </Button>
      </header>

      <FilterBar makes={makes} />

      <div className="mt-6">
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border-strong bg-bg p-12 text-center">
            <Car className="h-10 w-10 text-fg-subtle" aria-hidden />
            <p className="text-fg-subtle">
              {isSearch ? t.search.noResults : t.vehicles.list.empty}
            </p>
            {!isSearch ? (
              <Button asChild variant="outline">
                <Link href="/vehicles/new">
                  <Plus className="h-4 w-4" aria-hidden /> {t.vehicles.new}
                </Link>
              </Button>
            ) : null}
          </div>
        ) : (
          <VehicleList vehicles={vehicles} />
        )}
      </div>
    </main>
  );
}
