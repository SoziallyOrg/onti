import { Card } from "@/components/ui/card";

export default function AppLoading() {
  return (
    <main className="container py-8">
      {/* Header title skeleton */}
      <div className="mb-6 space-y-2">
        <div className="h-9 w-40 animate-pulse rounded bg-border/60" />
        <div className="h-4 w-52 animate-pulse rounded bg-border/40" />
      </div>

      {/* Grid items skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="mb-4 h-6 w-24 animate-pulse rounded bg-border/60" />
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-border/40" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-border/40" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-border/40" />
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
