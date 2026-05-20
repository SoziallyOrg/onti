import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Pencil,
  Archive,
  ArchiveRestore,
  Phone,
  Wrench,
  Plus,
} from "lucide-react";
import { requireUser } from "@/lib/auth-helpers";
import { getVehicleById } from "@/lib/vehicles";
import { listEntriesForVehicle } from "@/lib/maintenance";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MaintenanceTimeline,
  canUserEditEntry,
} from "@/components/maintenance-timeline";
import { formatDate } from "@/lib/format";
import { t } from "@/i18n/nl";
import { toggleArchiveVehicle } from "../actions";
import { PrintButton } from "@/components/print-button";
import { ServicePredictionCard } from "@/components/service-prediction";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const v = await getVehicleById(id);
  if (!v) return { title: t.app.name };
  return { title: `${v.plate} · ${v.make} ${v.model} — ${t.app.name}` };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Params;
}) {
  const user = await requireUser();
  const { id } = await params;
  const v = await getVehicleById(id);
  if (!v) notFound();

  const entries = await listEntriesForVehicle(v.id);

  return (
    <main className="container py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3 no-print">
        <Link href="/vehicles">{t.vehicles.backToList}</Link>
      </Button>

      <header className="mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono">{v.plate}</h1>
            {v.archived ? (
              <span className="bg-fg-subtle/20 rounded px-2 py-0.5 text-xs uppercase tracking-wide text-fg-subtle">
                {t.vehicles.archived}
              </span>
            ) : null}
            <div className="flex items-center gap-1.5 ml-1 no-print">
              <Button asChild variant="outline" size="sm" className="h-7 px-2.5 text-xs">
                <Link href={`/vehicles/${v.id}/edit`}>
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                  <span className="sr-only sm:not-sr-only sm:ml-1.5">{t.vehicles.edit}</span>
                </Link>
              </Button>
              <form action={toggleArchiveVehicle}>
                <input type="hidden" name="id" value={v.id} />
                <input type="hidden" name="archived" value={String(!v.archived)} />
                <Button
                  type="submit"
                  variant={v.archived ? "primary" : "outline"}
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                >
                  {v.archived ? (
                    <>
                      <ArchiveRestore className="h-3.5 w-3.5" aria-hidden />
                      <span className="sr-only sm:not-sr-only sm:ml-1.5">{t.vehicles.unarchive}</span>
                    </>
                  ) : (
                    <>
                      <Archive className="h-3.5 w-3.5" aria-hidden />
                      <span className="sr-only sm:not-sr-only sm:ml-1.5">{t.vehicles.archive}</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
          <p className="mt-1 text-fg-subtle">
            {v.make} {v.model}
            {v.modelYear ? ` · ${v.modelYear}` : ""}
            {v.engine ? ` · ${v.engine}` : ""}
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Identificatie</CardTitle>
          </CardHeader>
          <dl className="grid grid-cols-1 text-sm sm:grid-cols-[auto,1fr] sm:gap-x-4 sm:gap-y-2">
            <div className="flex justify-between items-start py-2.5 border-b border-border/40 gap-4 sm:contents sm:py-0 sm:border-0">
              <dt className="text-fg-subtle shrink-0">{t.vehicles.fields.plate}</dt>
              <dd className="font-mono font-semibold text-fg text-right sm:text-left">{v.plate}</dd>
            </div>
            <div className="flex justify-between items-start py-2.5 border-b border-border/40 gap-4 sm:contents sm:py-0 sm:border-0">
              <dt className="text-fg-subtle shrink-0">{t.vehicles.fields.vin}</dt>
              <dd className="font-mono font-medium text-fg text-right break-all sm:text-left">{v.vin}</dd>
            </div>
            <div className="flex justify-between items-start py-2.5 border-b border-border/40 gap-4 sm:contents sm:py-0 sm:border-0">
              <dt className="text-fg-subtle shrink-0">{t.vehicles.fields.make}</dt>
              <dd className="font-medium text-fg text-right sm:text-left">{v.make}</dd>
            </div>
            <div className="flex justify-between items-start py-2.5 border-b border-border/40 gap-4 sm:contents sm:py-0 sm:border-0">
              <dt className="text-fg-subtle shrink-0">{t.vehicles.fields.model}</dt>
              <dd className="font-medium text-fg text-right sm:text-left">{v.model}</dd>
            </div>
            {v.engine ? (
              <div className="flex justify-between items-start py-2.5 border-b border-border/40 gap-4 sm:contents sm:py-0 sm:border-0">
                <dt className="text-fg-subtle shrink-0">{t.vehicles.fields.engine}</dt>
                <dd className="font-medium text-fg text-right sm:text-left">{v.engine}</dd>
              </div>
            ) : null}
            {v.modelYear ? (
              <div className="flex justify-between items-start py-2.5 border-b border-border/40 last:border-0 gap-4 sm:contents sm:py-0 sm:border-0">
                <dt className="text-fg-subtle shrink-0">{t.vehicles.fields.modelYear}</dt>
                <dd className="font-medium text-fg text-right sm:text-left">{v.modelYear}</dd>
              </div>
            ) : null}
          </dl>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Klant</CardTitle>
          </CardHeader>
          <dl className="grid grid-cols-1 text-sm sm:grid-cols-[auto,1fr] sm:gap-x-4 sm:gap-y-2">
            <div className="flex justify-between items-start py-2.5 border-b border-border/40 gap-4 sm:contents sm:py-0 sm:border-0">
              <dt className="text-fg-subtle shrink-0">{t.vehicles.fields.customerName}</dt>
              <dd className="font-medium text-fg text-right sm:text-left">{v.customerName}</dd>
            </div>
            {v.customerPhone ? (
              <div className="flex justify-between items-start py-2.5 border-b border-border/40 last:border-0 gap-4 sm:contents sm:py-0 sm:border-0">
                <dt className="text-fg-subtle shrink-0">{t.vehicles.fields.customerPhone}</dt>
                <dd className="text-right sm:text-left">
                  <a
                    href={`tel:${v.customerPhone}`}
                    className="inline-flex items-center gap-1.5 text-info hover:underline font-semibold"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    {v.customerPhone}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
          <p className="mt-4 text-xs text-fg-subtle">
            Toegevoegd op {formatDate(v.createdAt)}
            {v.updatedAt > v.createdAt
              ? `, laatst bewerkt op ${formatDate(v.updatedAt)}.`
              : "."}
          </p>
        </Card>

        <ServicePredictionCard entries={entries} />
      </div>

      <section className="mt-6">
        <header className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" aria-hidden />
            {t.vehicles.detail.timelineTitle}
          </h2>
          <div className="flex items-center gap-2 no-print">
            <PrintButton />
            <Button asChild size="sm">
              <Link href={`/vehicles/${v.id}/maintenance/new`}>
                <Plus className="h-4 w-4" aria-hidden /> {t.maintenance.new}
              </Link>
            </Button>
          </div>
        </header>

        <MaintenanceTimeline
          vehicleId={v.id}
          entries={entries}
          canEdit={(entry) =>
            canUserEditEntry({ id: user.id, role: user.role }, entry)
          }
        />
      </section>
    </main>
  );
}
