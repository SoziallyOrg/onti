import Link from "next/link";
import { Search, Car, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth-helpers";

/**
 * Home dashboard — placeholder until PR #4 (vehicles + search).
 *
 * The real version becomes a search-first page: a single search bar
 * front-and-centre, with recent vehicles below.
 */
export default async function HomePage() {
  const user = await requireUser();

  return (
    <main className="container py-8">
      <header className="mb-8">
        <h1>Welkom{user.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
        <p className="mt-1 text-fg-subtle">
          Het systeem is in opbouw. Binnenkort beschikbaar: zoeken op
          nummerplaat of VIN, onderhoudshistoriek per wagen, en onderdelen met
          OEM-nummers.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Search className="h-5 w-5 text-primary" aria-hidden />
              Voertuigen zoeken
            </CardTitle>
            <CardDescription>
              Zoek op nummerplaat of chassisnummer. Beschikbaar in de volgende
              update.
            </CardDescription>
          </CardHeader>
          <Button variant="outline" disabled>
            <Search className="h-4 w-4" aria-hidden /> Binnenkort
          </Button>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Car className="h-5 w-5 text-primary" aria-hidden />
              Voertuig toevoegen
            </CardTitle>
            <CardDescription>
              Een nieuwe wagen registreren met klantgegevens.
            </CardDescription>
          </CardHeader>
          <Button variant="outline" disabled>
            <Car className="h-4 w-4" aria-hidden /> Binnenkort
          </Button>
        </Card>
      </div>

      {user.role === "ADMIN" ? (
        <Card className="mt-4">
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
      ) : null}
    </main>
  );
}
