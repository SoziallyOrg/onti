import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-helpers";
import { getVehicleById } from "@/lib/vehicles";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n/nl";
import { MaintenanceForm } from "../maintenance-form";

type Params = Promise<{ id: string }>;

export const metadata = { title: `${t.maintenance.new} — ${t.app.name}` };

export default async function NewMaintenancePage({
  params,
}: {
  params: Params;
}) {
  await requireUser();
  const { id } = await params;
  const v = await getVehicleById(id);
  if (!v) notFound();

  return (
    <main className="container max-w-3xl py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3">
        <Link href={`/vehicles/${v.id}`}>{t.vehicles.backToVehicle}</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t.maintenance.new}</CardTitle>
          <CardDescription>
            {v.plate} · {v.make} {v.model} · {v.customerName}
          </CardDescription>
        </CardHeader>
        <MaintenanceForm vehicleId={v.id} mode="create" />
      </Card>
    </main>
  );
}
