import { db } from "@/lib/db";
import { stripPunctuation } from "@/lib/format";

/**
 * Server-side data access for vehicles.
 *
 * Lives in `lib/` rather than directly in pages so the queries can be
 * unit-tested later and so multiple routes can share the same shape.
 */

const SEARCH_LIMIT = 50;
const RECENT_LIMIT = 8;

export type VehicleListItem = {
  id: string;
  vin: string;
  plate: string;
  make: string;
  model: string;
  modelYear: number | null;
  engine: string | null;
  customerName: string;
  customerPhone: string | null;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const listSelect = {
  id: true,
  vin: true,
  plate: true,
  make: true,
  model: true,
  modelYear: true,
  engine: true,
  customerName: true,
  customerPhone: true,
  archived: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Trigram + ILIKE search on plate / VIN.
 *
 * Strategy:
 * - ILIKE %q% on the stored value (mechanics often type the last
 *   chunk of a VIN scratched on a sticker)
 * - similarity() against a punctuation-stripped version of plate/vin
 *   so "1ABV123" still finds "1-ABC-123" with a typo
 * - Threshold of 0.3 — high enough to avoid noise, low enough to
 *   tolerate a single character swap
 *
 * The `gin_trgm_ops` indexes on plate / vin still get used for the
 * ILIKE branch; the regexp_replace branch does a sequential scan, but
 * with a few hundred vehicles per garage that's nothing.
 */
export async function searchVehicles(
  rawQuery: string
): Promise<VehicleListItem[]> {
  const q = rawQuery.trim();
  if (q.length === 0) return [];

  const stripped = stripPunctuation(q);
  const probe = stripped.length >= 2 ? stripped : q;
  const ilike = `%${q}%`;

  return db.$queryRaw<VehicleListItem[]>`
    SELECT id, vin, plate, make, model, "modelYear", engine,
           "customerName", "customerPhone", archived,
           "createdAt", "updatedAt"
    FROM "Vehicle"
    WHERE archived = false
      AND (
        plate ILIKE ${ilike}
        OR vin   ILIKE ${ilike}
        OR similarity(regexp_replace(plate, '[^A-Za-z0-9]', '', 'g'), ${probe}) > 0.3
        OR similarity(regexp_replace(vin,   '[^A-Za-z0-9]', '', 'g'), ${probe}) > 0.3
      )
    ORDER BY GREATEST(
        similarity(regexp_replace(plate, '[^A-Za-z0-9]', '', 'g'), ${probe}),
        similarity(regexp_replace(vin,   '[^A-Za-z0-9]', '', 'g'), ${probe})
      ) DESC,
      "updatedAt" DESC
    LIMIT ${SEARCH_LIMIT}
  `;
}

export async function listVehicles({
  includeArchived = false,
}: { includeArchived?: boolean } = {}) {
  return db.vehicle.findMany({
    where: includeArchived ? {} : { archived: false },
    orderBy: { updatedAt: "desc" },
    select: listSelect,
    take: 200,
  });
}

export async function recentVehicles() {
  return db.vehicle.findMany({
    where: { archived: false },
    orderBy: { updatedAt: "desc" },
    select: listSelect,
    take: RECENT_LIMIT,
  });
}

export async function getVehicleById(id: string) {
  return db.vehicle.findUnique({
    where: { id },
    select: listSelect,
  });
}
