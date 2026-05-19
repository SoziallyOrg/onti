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
    <main className="container max-w-3xl py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/vehicles">{t.vehicles.backToList}</Link>
      </Button>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono">{v.plate}</h1>
            {v.archived ? (
              <span className="bg-fg-subtle/20 rounded px-2 py-0.5 text-xs uppercase tracking-wide text-fg-subtle">
                {t.vehicles.archived}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-fg-subtle">
            {v.make} {v.model}
            {v.modelYear ? ` · ${v.modelYear}` : ""}
            {v.engine ? ` · ${v.engine}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/vehicles/${v.id}/edit`}>
              <Pencil className="h-4 w-4" aria-hidden /> {t.vehicles.edit}
            </Link>
          </Button>
          <form action={toggleArchiveVehicle}>
            <input type="hidden" name="id" value={v.id} />
            <input type="hidden" name="archived" value={String(!v.archived)} />
            <Button
              type="submit"
              variant={v.archived ? "primary" : "outline"}
              size="sm"
            >
              {v.archived ? (
                <>
                  <ArchiveRestore className="h-4 w-4" aria-hidden />{" "}
                  {t.vehicles.unarchive}
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4" aria-hidden />{" "}
                  {t.vehicles.archive}
                </>
              )}
            </Button>
          </form>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Identificatie</CardTitle>
          </CardHeader>
          <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-fg-subtle">{t.vehicles.fields.plate}</dt>
            <dd className="font-mono">{v.plate}</dd>
            <dt className="text-fg-subtle">{t.vehicles.fields.vin}</dt>
            <dd className="font-mono">{v.vin}</dd>
            <dt className="text-fg-subtle">{t.vehicles.fields.make}</dt>
            <dd>{v.make}</dd>
            <dt className="text-fg-subtle">{t.vehicles.fields.model}</dt>
            <dd>{v.model}</dd>
            {v.engine ? (
              <>
                <dt className="text-fg-subtle">{t.vehicles.fields.engine}</dt>
                <dd>{v.engine}</dd>
              </>
            ) : null}
            {v.modelYear ? (
              <>
                <dt className="text-fg-subtle">
                  {t.vehicles.fields.modelYear}
                </dt>
                <dd>{v.modelYear}</dd>
              </>
            ) : null}
          </dl>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Klant</CardTitle>
          </CardHeader>
          <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-fg-subtle">{t.vehicles.fields.customerName}</dt>
            <dd>{v.customerName}</dd>
            {v.customerPhone ? (
              <>
                <dt className="text-fg-subtle">
                  {t.vehicles.fields.customerPhone}
                </dt>
                <dd>
                  <a
                    href={`tel:${v.customerPhone}`}
                    className="inline-flex items-center gap-1.5 text-info hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    {v.customerPhone}
                  </a>
                </dd>
              </>
            ) : null}
          </dl>
          <p className="mt-4 text-xs text-fg-subtle">
            Toegevoegd op {formatDate(v.createdAt)}
            {v.updatedAt > v.createdAt
              ? `, laatst bewerkt op ${formatDate(v.updatedAt)}.`
              : "."}
          </p>
        </Card>
      </div>

      <section className="mt-6">
        <header className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" aria-hidden />
            {t.vehicles.detail.timelineTitle}
          </h2>
          <Button asChild size="sm">
            <Link href={`/vehicles/${v.id}/maintenance/new`}>
              <Plus className="h-4 w-4" aria-hidden /> {t.maintenance.new}
            </Link>
          </Button>
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
