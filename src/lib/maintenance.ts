import type { PartCategory } from "@prisma/client";
import { db } from "@/lib/db";

/**
 * Server-side data access for maintenance entries.
 *
 * Decimal fields from Prisma come back as a `Decimal.js` instance which
 * can't be serialised to client components. We convert to plain numbers
 * here so callers don't have to think about it.
 */

export type PartUsedView = {
  id: string;
  category: PartCategory;
  oemNumber: string | null;
  brand: string | null;
  supplier: string | null;
  notes: string | null;
};

export type MaintenanceEntryView = {
  id: string;
  vehicleId: string;
  date: Date;
  km: number;
  oilType: string | null;
  oilLiters: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: { id: string; name: string };
  parts: PartUsedView[];
};

const entrySelect = {
  id: true,
  vehicleId: true,
  date: true,
  km: true,
  oilType: true,
  oilLiters: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  createdBy: { select: { id: true, name: true } },
  parts: {
    select: {
      id: true,
      category: true,
      oemNumber: true,
      brand: true,
      supplier: true,
      notes: true,
    },
    orderBy: { createdAt: "asc" as const },
  },
} as const;

type RawEntry = {
  oilLiters: { toNumber(): number } | null;
} & Omit<MaintenanceEntryView, "oilLiters">;

function toView(raw: RawEntry): MaintenanceEntryView {
  return {
    ...raw,
    oilLiters: raw.oilLiters ? raw.oilLiters.toNumber() : null,
  };
}

export async function listEntriesForVehicle(
  vehicleId: string
): Promise<MaintenanceEntryView[]> {
  const entries = await db.maintenanceEntry.findMany({
    where: { vehicleId },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    select: entrySelect,
  });
  return entries.map((e) => toView(e as unknown as RawEntry));
}

export async function getEntry(
  id: string
): Promise<MaintenanceEntryView | null> {
  const e = await db.maintenanceEntry.findUnique({
    where: { id },
    select: entrySelect,
  });
  return e ? toView(e as unknown as RawEntry) : null;
}
