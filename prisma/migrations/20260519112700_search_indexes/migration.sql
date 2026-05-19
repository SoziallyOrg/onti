-- Trigram GIN indexes for fuzzy search on plate / VIN.
--
-- Prisma can't express GIN-with-opclass indexes natively, so this
-- migration is hand-written. The indexes back the typo-tolerant search
-- bar built in PR #4 (vehicles + search) using:
--
--   WHERE similarity(plate, $1) > 0.3 OR similarity(vin, $1) > 0.3
--
-- pg_trgm extension is enabled by the previous migration via Prisma's
-- postgresqlExtensions preview feature.

CREATE INDEX IF NOT EXISTS "Vehicle_plate_trgm_idx"
  ON "Vehicle" USING gin (plate gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Vehicle_vin_trgm_idx"
  ON "Vehicle" USING gin (vin gin_trgm_ops);
