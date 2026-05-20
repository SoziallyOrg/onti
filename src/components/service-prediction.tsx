import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock, Crown } from "lucide-react";
import { formatNumber } from "@/lib/format";
import Link from "next/link";

type SimpleEntry = {
  date: Date;
  km: number;
};

export function ServicePredictionCard({ entries }: { entries: SimpleEntry[] }) {
  if (entries.length < 2) {
    return (
      <Card className="h-full border border-border bg-bg/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold tracking-wide text-fg-subtle uppercase flex items-center gap-2">
            <Clock className="h-4 w-4 text-fg-subtle" />
            Volgend Onderhoud
          </CardTitle>
        </CardHeader>
        <div className="text-sm text-fg-subtle mt-1">
          <p>
            Voeg minimaal twee onderhoudsbeurten toe om een gepersonaliseerde schatting te maken op basis van het jaarlijkse aantal kilometers.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded bg-muted/40 p-2 text-xs border border-border">
            <span className="font-medium text-fg">Standaardinterval:</span>
            <span>Elke 15.000 km of 12 maanden.</span>
          </div>
        </div>
      </Card>
    );
  }

  // Sort chronologically to compute delta
  const sorted = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const timeDiffMs = last.date.getTime() - first.date.getTime();
  const kmDiff = last.km - first.km;

  // If time elapsed is too small (e.g. same day entries or less than 7 days) or km difference is <= 0
  const daysDiff = timeDiffMs / (1000 * 60 * 60 * 24);
  if (daysDiff < 7 || kmDiff <= 0) {
    return (
      <Card className="h-full border border-border bg-bg/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold tracking-wide text-fg-subtle uppercase flex items-center gap-2">
            <Clock className="h-4 w-4 text-fg-subtle" />
            Volgend Onderhoud
          </CardTitle>
        </CardHeader>
        <div className="text-sm text-fg-subtle mt-1">
          <p>
            Onvoldoende kilometerverschil tussen de onderhoudsbeurten om het rijgedrag te analyseren.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded bg-muted/40 p-2 text-xs border border-border">
            <span className="font-medium text-fg">Standaardinterval:</span>
            <span>Elke 15.000 km of 12 maanden.</span>
          </div>
        </div>
      </Card>
    );
  }

  // Calculate average kilometers per year
  const yearsDiff = daysDiff / 365.25;
  const kmPerYear = Math.round(kmDiff / yearsDiff);

  // Maintenance interval: 15,000 km or 12 months
  const kmInterval = 15000;
  const targetKm = last.km + kmInterval;

  // Estimated days to drive kmInterval
  const daysToNextService = (kmInterval / kmPerYear) * 365.25;
  
  // Predict date
  const predictedDate = new Date(last.date);
  predictedDate.setDate(predictedDate.getDate() + Math.round(daysToNextService));

  // Determine status
  const now = new Date();
  const isOverdue = now.getTime() > predictedDate.getTime();
  
  // Calculate warning window (30 days before predicted date)
  const isDueSoon = !isOverdue && (predictedDate.getTime() - now.getTime()) < (30 * 24 * 60 * 60 * 1000);

  const formattedPredictedDate = predictedDate.toLocaleDateString("nl-BE", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="h-full border border-border bg-bg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-wide text-fg-subtle uppercase flex items-center gap-2 justify-between">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Onderhoudsschatting
          </span>
          {isOverdue ? (
            <span className="inline-flex items-center gap-1 text-xs text-danger font-semibold bg-danger/10 border border-danger/20 rounded px-1.5 py-0.5">
              <AlertTriangle className="h-3 w-3" />
              Service Vereist
            </span>
          ) : isDueSoon ? (
            <span className="inline-flex items-center gap-1 text-xs text-warning font-semibold bg-warning/10 border border-warning/20 rounded px-1.5 py-0.5">
              <AlertTriangle className="h-3 w-3" />
              Binnenkort
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-success font-semibold bg-success/10 border border-success/20 rounded px-1.5 py-0.5">
              <CheckCircle className="h-3 w-3" />
              In orde
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <div className="text-sm space-y-3 mt-1">
        <div>
          <p className="text-xs text-fg-subtle">Geschatte datum volgend onderhoud</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-fg capitalize">{formattedPredictedDate}</span>
            <span className="text-xs text-fg-subtle">
              (bij ca. {formatNumber(targetKm)} km)
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-fg-subtle flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Gemiddelde
            </span>
            <span className="font-semibold text-fg mt-0.5 block">
              {formatNumber(kmPerYear)} km/jaar
            </span>
          </div>
          <div>
            <span className="text-fg-subtle flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Laatste beurt
            </span>
            <span className="font-semibold text-fg mt-0.5 block">
              {formatNumber(last.km)} km
            </span>
          </div>
        </div>

        <div className="pt-2.5 mt-1 border-t border-dashed border-border/60 flex items-center justify-between gap-2 text-[11px]">
          <span className="text-fg-subtle flex items-center gap-1">
            <Crown className="h-3.5 w-3.5 text-warning" />
            Klant SMS sturen
          </span>
          <Link
            href="/premium"
            className="text-warning font-semibold hover:underline flex items-center gap-0.5"
          >
            Activeren Pro 👑
          </Link>
        </div>
      </div>
    </Card>
  );
}
