import Link from "next/link";
import { Plus, Car, Users, Download, Crown } from "lucide-react";
import { requireUser } from "@/lib/auth-helpers";
import { recentVehicles } from "@/lib/vehicles";
import { VehicleList } from "./vehicles/vehicle-list";
import { t } from "@/i18n/nl";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const user = await requireUser();
  const recent = await recentVehicles();
  const isAdmin = user.role === "ADMIN";

  return (
    <main className="w-full px-4 md:px-8 lg:px-12 py-6 max-w-none">
      {/* Welcome Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Welkom{user.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1.5 text-sm md:text-base text-fg-subtle">
          Onti Garage — Intern onderhoudssysteem
        </p>
      </header>

      {/* Quick Actions Grid */}
      <section className="mb-8">
        <h2 className="sr-only">Snelkoppelingen</h2>
        <div className={`grid gap-4 ${isAdmin ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
          {/* Action 1: Search / View All */}
          <Link
            href="/vehicles"
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-bg p-6 text-center transition-all hover:bg-border/30 active:scale-[0.98] min-h-[120px]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Car className="h-6 w-6" aria-hidden />
            </div>
            <span className="font-semibold text-base text-fg">Alle wagens</span>
          </Link>

          {/* Action 2: New Vehicle */}
          <Link
            href="/vehicles/new"
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-bg p-6 text-center transition-all hover:bg-border/30 active:scale-[0.98] min-h-[120px]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Plus className="h-6 w-6" aria-hidden />
            </div>
            <span className="font-semibold text-base text-fg">{t.vehicles.new}</span>
          </Link>

          {/* Action 3: Team (Admin Only) */}
          {isAdmin && (
            <Link
              href="/admin/users"
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-bg p-6 text-center transition-all hover:bg-border/30 active:scale-[0.98] min-h-[120px]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Users className="h-6 w-6" aria-hidden />
              </div>
              <span className="font-semibold text-base text-fg">Gebruikers</span>
            </Link>
          )}

          {/* Action 4: Export (Admin Only) */}
          {isAdmin && (
            <Link
              href="/admin/export"
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-bg p-6 text-center transition-all hover:bg-border/30 active:scale-[0.98] min-h-[120px]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Download className="h-6 w-6" aria-hidden />
              </div>
              <span className="font-semibold text-base text-fg">Exporteren</span>
            </Link>
          )}
        </div>
      </section>

      {/* Premium Teaser Card */}
      <section className="mb-8">
        <div className="rounded-xl border border-warning/20 bg-warning/5 p-6 relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="absolute top-0 right-0 bg-warning text-warning-fg text-[10px] font-bold px-3 py-1 rounded-bl uppercase tracking-wider flex items-center gap-1">
            <Crown className="h-3 w-3" /> Pro
          </div>
          <div>
            <h3 className="text-base font-bold text-fg flex items-center gap-1.5">
              <Crown className="h-5 w-5 text-warning" />
              Ontdek Pro Uitbreidingen
            </h3>
            <p className="text-sm text-fg-subtle mt-1 max-w-2xl">
              Geavanceerde modules zoals afsprakenplanning, SMS-herinneringen, voorraadbeheer, klantenportaal en facturatie.
            </p>
          </div>
          <Button asChild size="md" variant="outline" className="h-9 text-sm border-warning/30 text-warning hover:bg-warning/10 shrink-0 sm:self-center">
            <Link href="/premium">Bekijk modules</Link>
          </Button>
        </div>
      </section>

      {/* Recent Vehicles */}
      <section>
        <h2 className="mb-4 text-xl font-semibold tracking-tight">
          {t.vehicles.list.recent}
        </h2>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border-strong bg-bg p-8 text-center text-sm text-fg-subtle">
            {t.vehicles.list.empty}
          </p>
        ) : (
          <VehicleList vehicles={recent} />
        )}
      </section>
    </main>
  );
}
