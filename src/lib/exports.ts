import { db } from "@/lib/db";

/**
 * Query helpers for the three CSV exports.
 *
 * Each helper returns plain serialisable rows (Decimals → numbers, no
 * relations beyond what the CSV needs). Values are denormalised — the
 * mechanic opening the file in Excel shouldn't have to do VLOOKUPs to
 * find a plate by id.
 */

export type VehicleExportRow = {
  id: string;
  vin: string;
  plate: string;
  make: string;
  model: string;
  engine: string;
  modelYear: number | "";
  customerName: string;
  customerPhone: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MaintenanceExportRow = {
  id: string;
  vehiclePlate: string;
  vehicleVin: string;
  date: Date;
  km: number;
  oilType: string;
  oilLiters: number | "";
  notes: string;
  createdBy: string;
  createdAt: Date;
};

export type PartExportRow = {
  id: string;
  vehiclePlate: string;
  vehicleVin: string;
  entryDate: Date;
  category: string;
  oemNumber: string;
  brand: string;
  supplier: string;
  notes: string;
};

export async function exportVehicles(): Promise<VehicleExportRow[]> {
  const rows = await db.vehicle.findMany({
    orderBy: { plate: "asc" },
  });
  return rows.map((v) => ({
    id: v.id,
    vin: v.vin,
    plate: v.plate,
    make: v.make,
    model: v.model,
    engine: v.engine ?? "",
    modelYear: v.modelYear ?? "",
    customerName: v.customerName,
    customerPhone: v.customerPhone ?? "",
    archived: v.archived,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  }));
}

export async function exportMaintenance(): Promise<MaintenanceExportRow[]> {
  const rows = await db.maintenanceEntry.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    include: {
      vehicle: { select: { plate: true, vin: true } },
      createdBy: { select: { name: true } },
    },
  });
  return rows.map((e) => ({
    id: e.id,
    vehiclePlate: e.vehicle.plate,
    vehicleVin: e.vehicle.vin,
    date: e.date,
    km: e.km,
    oilType: e.oilType ?? "",
    oilLiters: e.oilLiters ? Number(e.oilLiters) : "",
    notes: e.notes ?? "",
    createdBy: e.createdBy.name,
    createdAt: e.createdAt,
  }));
}

export async function exportParts(): Promise<PartExportRow[]> {
  const rows = await db.partUsed.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      maintenance: {
        select: {
          date: true,
          vehicle: { select: { plate: true, vin: true } },
        },
      },
    },
  });
  return rows.map((p) => ({
    id: p.id,
    vehiclePlate: p.maintenance.vehicle.plate,
    vehicleVin: p.maintenance.vehicle.vin,
    entryDate: p.maintenance.date,
    category: p.category,
    oemNumber: p.oemNumber ?? "",
    brand: p.brand ?? "",
    supplier: p.supplier ?? "",
    notes: p.notes ?? "",
  }));
}
