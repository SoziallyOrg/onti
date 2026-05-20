import { Card } from "@/components/ui/card";

export default function VehicleDetailLoading() {
  return (
    <main className="container py-6">
      {/* Back button skeleton */}
      <div className="mb-4 h-5 w-24 animate-pulse rounded bg-border/40" />

      {/* Title Header Section skeleton */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            {/* Plate Title skeleton */}
            <div className="h-9 w-44 animate-pulse rounded bg-border/60" />
            {/* Action buttons skeletons */}
            <div className="flex gap-2">
              <div className="h-7 w-8 animate-pulse rounded bg-border/40" />
              <div className="h-7 w-8 animate-pulse rounded bg-border/40" />
            </div>
          </div>
          {/* Make / Model subtitle skeleton */}
          <div className="h-5 w-56 animate-pulse rounded bg-border/40" />
        </div>
      </div>

      {/* Dynamic layout containers skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column: Identificatie & Customer */}
        <div className="space-y-6 md:col-span-1">
          {/* Identificatie Card skeleton */}
          <Card className="p-4">
            <div className="mb-4 h-5 w-28 animate-pulse rounded bg-border/60" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between border-b border-border/20 pb-2 sm:contents">
                  <div className="h-4 w-20 animate-pulse rounded bg-border/40" />
                  <div className="h-4 w-32 animate-pulse rounded bg-border/50" />
                </div>
              ))}
            </div>
          </Card>

          {/* Klant Card skeleton */}
          <Card className="p-4">
            <div className="mb-4 h-5 w-16 animate-pulse rounded bg-border/60" />
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex justify-between border-b border-border/20 pb-2 sm:contents">
                  <div className="h-4 w-20 animate-pulse rounded bg-border/40" />
                  <div className="h-4 w-32 animate-pulse rounded bg-border/50" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column: Maintenance Timeline skeleton */}
        <div className="space-y-6 md:col-span-2">
          <Card className="p-6">
            {/* Maintenance timeline header skeleton */}
            <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
              <div className="h-6 w-36 animate-pulse rounded bg-border/60" />
              <div className="h-8 w-32 animate-pulse rounded bg-border/50" />
            </div>

            {/* Timeline item skeletons */}
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  {/* Circle indicator */}
                  <div className="h-3 w-3 animate-pulse rounded-full bg-border/60 shrink-0 mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      {/* Date & Author skeleton */}
                      <div className="h-4 w-32 animate-pulse rounded bg-border/50" />
                      {/* Action icons skeleton */}
                      <div className="h-4 w-12 animate-pulse rounded bg-border/40" />
                    </div>
                    {/* Description skeleton */}
                    <div className="h-4 w-full animate-pulse rounded bg-border/40" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-border/40" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
