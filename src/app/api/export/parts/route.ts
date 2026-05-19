import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { csvResponse, toCsv } from "@/lib/csv";
import { exportParts } from "@/lib/exports";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const rows = await exportParts();
  const body = toCsv(rows, [
    { key: "id", header: "id" },
    { key: "vehiclePlate", header: "nummerplaat" },
    { key: "vehicleVin", header: "vin" },
    { key: "entryDate", header: "beurt_datum" },
    { key: "category", header: "categorie" },
    { key: "oemNumber", header: "oem_nummer" },
    { key: "brand", header: "merk" },
    { key: "supplier", header: "leverancier" },
    { key: "notes", header: "notitie" },
  ]);

  return csvResponse("onderdelen", body);
}
