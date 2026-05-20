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
import { VehicleForm } from "../../vehicle-form";

type Params = Promise<{ id: string }>;

export const metadata = { title: `${t.vehicles.edit} — ${t.app.name}` };

export default async function EditVehiclePage({ params }: { params: Params }) {
  await requireUser();
  const { id } = await params;
  const v = await getVehicleById(id);
  if (!v) notFound();

  return (
    <main className="container max-w-2xl py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3">
        <Link href={`/vehicles/${v.id}`}>{t.vehicles.backToVehicle}</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {v.plate} · {v.make} {v.model}
          </CardTitle>
          <CardDescription>{t.vehicles.edit}</CardDescription>
        </CardHeader>
        <VehicleForm
          mode="edit"
          defaults={{
            id: v.id,
            vin: v.vin,
            plate: v.plate,
            make: v.make,
            model: v.model,
            engine: v.engine,
            modelYear: v.modelYear,
            customerName: v.customerName,
            customerPhone: v.customerPhone,
          }}
        />
      </Card>
    </main>
  );
}
