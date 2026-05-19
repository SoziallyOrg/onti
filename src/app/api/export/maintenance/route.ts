import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { csvResponse, toCsv } from "@/lib/csv";
import { exportMaintenance } from "@/lib/exports";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const rows = await exportMaintenance();
  const body = toCsv(rows, [
    { key: "id", header: "id" },
    { key: "vehiclePlate", header: "nummerplaat" },
    { key: "vehicleVin", header: "vin" },
    { key: "date", header: "datum" },
    { key: "km", header: "kilometerstand" },
    { key: "oilType", header: "olietype" },
    { key: "oilLiters", header: "olie_liter" },
    { key: "notes", header: "opmerkingen" },
    { key: "createdBy", header: "geregistreerd_door" },
    { key: "createdAt", header: "geregistreerd_op" },
  ]);

  return csvResponse("onderhoudsbeurten", body);
}
