import Link from "next/link";
import { Search, Plus, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth-helpers";
import { recentVehicles } from "@/lib/vehicles";
import { VehicleList } from "./vehicles/vehicle-list";
import { t } from "@/i18n/nl";

/**
 * Home dashboard.
 *
 * Search-first by intent: the bar in the top nav already has the user's
 * focus-cursor (auto-focus is annoying on iPad keyboards in the workshop,
 * so we skip auto-focus and rely on the `/` shortcut). Below the prompt:
 * recent vehicles for tap-to-resume, plus a CTA to add a new car.
 */
export default async function HomePage() {
  const user = await requireUser();
  const recent = await recentVehicles();

  return (
    <main className="container py-8">
      <header className="mb-8">
        <h1>Welkom{user.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
        <p className="mt-1 text-fg-subtle">
          Zoek hierboven op nummerplaat of VIN, of voeg een nieuwe wagen toe.
        </p>
      </header>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Search className="h-5 w-5 text-primary" aria-hidden />
              {t.search.label}
            </CardTitle>
            <CardDescription>
              Tik op de zoekbalk bovenaan, of druk op{" "}
              <kbd className="bg-border/40 rounded border border-border-strong px-1.5 py-0.5 font-mono text-xs">
                /
              </kbd>{" "}
              om te zoeken.
            </CardDescription>
          </CardHeader>
          <Button asChild variant="outline">
            <Link href="/vehicles">{t.nav.vehicles}</Link>
          </Button>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Plus className="h-5 w-5 text-primary" aria-hidden />
              {t.vehicles.new}
            </CardTitle>
            <CardDescription>
              Nieuwe wagen registreren met klantgegevens.
            </CardDescription>
          </CardHeader>
          <Button asChild>
            <Link href="/vehicles/new">
              <Plus className="h-4 w-4" aria-hidden /> {t.vehicles.new}
            </Link>
          </Button>
        </Card>
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg">{t.vehicles.list.recent}</h2>
        </div>
        {recent.length === 0 ? (
          <p className="rounded border border-dashed border-border-strong bg-bg p-6 text-center text-fg-subtle">
            {t.vehicles.list.empty}
          </p>
        ) : (
          <VehicleList vehicles={recent} />
        )}
      </section>

      {user.role === "ADMIN" ? (
        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Wrench className="h-5 w-5 text-primary" aria-hidden />
                Beheer
              </CardTitle>
              <CardDescription>Gebruikers en instellingen.</CardDescription>
            </CardHeader>
            <Button asChild variant="outline">
              <Link href="/admin/users">Gebruikers beheren</Link>
            </Button>
          </Card>
        </section>
      ) : null}
    </main>
  );
}
