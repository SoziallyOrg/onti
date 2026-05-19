import { Button } from "@/components/ui/button";
import { Search, Wrench, Car } from "lucide-react";

/**
 * Placeholder landing page.
 *
 * Replaced in PR #3 (auth) with the real login redirect, and in PR #4
 * (vehicles + search) with the search-first dashboard. Kept here so the
 * scaffolding PR has something to look at.
 */
export default function Home() {
  return (
    <main className="container py-16">
      <header className="mb-12 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded bg-primary">
          <Wrench className="h-5 w-5 text-primary-fg" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl">Onti Garage</h1>
          <p className="text-sm text-fg-subtle">Intern onderhoudssysteem</p>
        </div>
      </header>

      <section className="mb-12 rounded-lg border border-border bg-bg p-6">
        <h2 className="mb-2">Welkom</h2>
        <p className="mb-6 text-fg-subtle">
          Het systeem is in opbouw. Eerste functies komen binnenkort online —
          beginnend met inloggen, voertuigen zoeken op nummerplaat of VIN, en
          onderhoudshistoriek.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>
            <Search className="h-4 w-4" aria-hidden /> Zoek voertuig
          </Button>
          <Button variant="outline">
            <Car className="h-4 w-4" aria-hidden /> Nieuwe wagen
          </Button>
          <Button variant="ghost">Aanmelden</Button>
        </div>
      </section>

      {/* Brand check — visible during scaffolding so the developer can spot
          contrast / sizing issues before real screens are built. Removed
          in PR #3. */}
      <section
        aria-label="Brand voorbeeld"
        className="rounded-lg border border-border bg-surface p-6 text-fg-inverse"
      >
        <h2 className="text-fg-5 mb-2">Brand controle</h2>
        <p className="mb-4 text-surface-2">
          Geel op zwart, Barlow als huisfont, kleuren overgenomen van de
          Onti-website.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Primaire knop</Button>
          <Button variant="outline" className="border-fg-5 text-fg-5">
            Outline op donker
          </Button>
        </div>
      </section>
    </main>
  );
}
