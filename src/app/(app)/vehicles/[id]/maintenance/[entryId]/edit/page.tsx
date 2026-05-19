import Link from "next/link";
import { Camera } from "lucide-react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-helpers";
import { getVehicleById } from "@/lib/vehicles";
import { getEntry } from "@/lib/maintenance";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhotoGrid } from "@/components/photo-grid";
import { PhotoUploader } from "@/components/photo-uploader";
import { formatDate } from "@/lib/format";
import { MAX_PHOTOS_PER_ENTRY } from "@/lib/photos";
import { t } from "@/i18n/nl";
import { MaintenanceForm } from "../../maintenance-form";

type Params = Promise<{ id: string; entryId: string }>;

export const metadata = { title: `${t.maintenance.edit} — ${t.app.name}` };

export default async function EditMaintenancePage({
  params,
}: {
  params: Params;
}) {
  const me = await requireUser();
  const { id, entryId } = await params;

  const [vehicle, entry] = await Promise.all([
    getVehicleById(id),
    getEntry(entryId),
  ]);
  if (!vehicle || !entry || entry.vehicleId !== vehicle.id) notFound();

  // Defence-in-depth: the server action also enforces this, but we
  // shouldn't render a form the user can't successfully submit.
  const canEdit = entry.createdBy.id === me.id || me.role === "ADMIN";
  if (!canEdit) notFound();

  const remainingSlots = MAX_PHOTOS_PER_ENTRY - entry.photos.length;

  return (
    <main className="container max-w-3xl py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href={`/vehicles/${vehicle.id}`}>{t.vehicles.backToVehicle}</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t.maintenance.edit}</CardTitle>
          <CardDescription>
            {vehicle.plate} · {formatDate(entry.date)} · {t.maintenance.by}{" "}
            {entry.createdBy.name}
          </CardDescription>
        </CardHeader>
        <MaintenanceForm
          vehicleId={vehicle.id}
          mode="edit"
          defaults={{
            id: entry.id,
            date: entry.date,
            km: entry.km,
            oilType: entry.oilType,
            oilLiters: entry.oilLiters,
            notes: entry.notes,
            parts: entry.parts.map((p) => ({
              category: p.category,
              oemNumber: p.oemNumber ?? "",
              brand: p.brand ?? "",
              supplier: p.supplier ?? "",
              notes: p.notes ?? "",
            })),
          }}
        />
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Camera className="h-5 w-5 text-primary" aria-hidden />
            {t.maintenance.photos.title}
          </CardTitle>
          <CardDescription>
            Hover een foto om hem te verwijderen.
          </CardDescription>
        </CardHeader>

        <div className="space-y-4">
          <PhotoGrid photos={entry.photos} canEdit />
          <PhotoUploader entryId={entry.id} remainingSlots={remainingSlots} />
        </div>
      </Card>
    </main>
  );
}
