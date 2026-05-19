import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { csvResponse, toCsv } from "@/lib/csv";
import { exportVehicles } from "@/lib/exports";

/**
 * Admin-only download of every vehicle row, archived included. The
 * customer name + phone are PII so this is gated harder than the read
 * pages.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const rows = await exportVehicles();
  const body = toCsv(rows, [
    { key: "id", header: "id" },
    { key: "plate", header: "nummerplaat" },
    { key: "vin", header: "vin" },
    { key: "make", header: "merk" },
    { key: "model", header: "model" },
    { key: "engine", header: "motor" },
    { key: "modelYear", header: "bouwjaar" },
    { key: "customerName", header: "klantnaam" },
    { key: "customerPhone", header: "gsm" },
    { key: "archived", header: "gearchiveerd" },
    { key: "createdAt", header: "toegevoegd_op" },
    { key: "updatedAt", header: "bewerkt_op" },
  ]);

  return csvResponse("voertuigen", body);
}
