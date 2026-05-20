import { Card } from "@/components/ui/card";

export default function VehiclesLoading() {
  return (
    <main className="container py-8">
      {/* Header section skeleton */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          {/* Title skeleton */}
          <div className="h-9 w-48 animate-pulse rounded bg-border/60" />
          {/* Count skeleton */}
          <div className="h-4 w-28 animate-pulse rounded bg-border/40" />
        </div>
        {/* Add vehicle button skeleton */}
        <div className="h-9 w-32 animate-pulse rounded bg-border/60" />
      </div>

      {/* Segmented control switcher skeleton */}
      <div className="mb-6 flex h-10 w-full max-w-[320px] animate-pulse rounded-lg bg-border/40 p-1">
        <div className="flex-1 rounded-md bg-border/30" />
        <div className="flex-1" />
      </div>

      {/* Filter bar skeleton */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="h-10 w-full animate-pulse rounded bg-border/40 sm:max-w-[200px]" />
        <div className="h-10 w-full animate-pulse rounded bg-border/40 sm:max-w-[200px]" />
      </div>

      {/* Vehicles list skeleton */}
      <div className="grid gap-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {/* Plate skeleton */}
                <div className="h-6 w-28 animate-pulse rounded bg-border/60" />
              </div>
              {/* Make & Model skeleton */}
              <div className="h-4 w-36 animate-pulse rounded bg-border/40" />
            </div>
            {/* Customer name skeleton */}
            <div className="h-5 w-24 animate-pulse rounded bg-border/50" />
          </Card>
        ))}
      </div>
    </main>
  );
}
