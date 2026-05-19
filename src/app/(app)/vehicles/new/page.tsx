import Link from "next/link";
import { requireUser } from "@/lib/auth-helpers";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n/nl";
import { VehicleForm } from "../vehicle-form";

export const metadata = { title: `${t.vehicles.new} — ${t.app.name}` };

export default async function NewVehiclePage() {
  await requireUser();

  return (
    <main className="container max-w-2xl py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/vehicles">{t.vehicles.backToList}</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t.vehicles.new}</CardTitle>
          <CardDescription>
            Het chassisnummer (VIN) is uniek per wagen en wordt gebruikt om de
            geschiedenis op te volgen.
          </CardDescription>
        </CardHeader>
        <VehicleForm mode="create" />
      </Card>
    </main>
  );
}
