import Link from "next/link";
import { Plus, Car } from "lucide-react";
import { requireUser } from "@/lib/auth-helpers";
import { listVehicles, searchVehicles } from "@/lib/vehicles";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n/nl";
import { VehicleList } from "./vehicle-list";

export const metadata = { title: `${t.vehicles.title} — ${t.app.name}` };

type SearchParams = { q?: string };

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireUser();
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const vehicles =
    query.length > 0 ? await searchVehicles(query) : await listVehicles();

  const isSearch = query.length > 0;

  return (
    <main className="container py-8">
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
        </div>
        <Button asChild>
          <Link href="/vehicles/new">
            <Plus className="h-4 w-4" aria-hidden /> {t.vehicles.new}
          </Link>
        </Button>
      </header>

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
    </main>
  );
}
