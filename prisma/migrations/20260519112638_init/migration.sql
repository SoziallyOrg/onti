-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MECHANIC');

-- CreateEnum
CREATE TYPE "PartCategory" AS ENUM ('OIL_FILTER', 'AIR_FILTER', 'CABIN_FILTER', 'FUEL_FILTER', 'BRAKE_PAD', 'BRAKE_DISC', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MECHANIC',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "engine" TEXT,
    "modelYear" INTEGER,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceEntry" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "km" INTEGER NOT NULL,
    "oilType" TEXT,
    "oilLiters" DECIMAL(4,2),
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartUsed" (
    "id" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "category" "PartCategory" NOT NULL,
    "oemNumber" TEXT,
    "brand" TEXT,
    "supplier" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartUsed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_vin_key" ON "Vehicle"("vin");

-- CreateIndex
CREATE INDEX "Vehicle_plate_idx" ON "Vehicle"("plate");

-- CreateIndex
CREATE INDEX "Vehicle_vin_idx" ON "Vehicle"("vin");

-- CreateIndex
CREATE INDEX "Vehicle_archived_idx" ON "Vehicle"("archived");

-- CreateIndex
CREATE INDEX "MaintenanceEntry_vehicleId_date_idx" ON "MaintenanceEntry"("vehicleId", "date" DESC);

-- CreateIndex
CREATE INDEX "PartUsed_maintenanceId_idx" ON "PartUsed"("maintenanceId");

-- CreateIndex
CREATE INDEX "PartUsed_oemNumber_idx" ON "PartUsed"("oemNumber");

-- CreateIndex
CREATE INDEX "PartUsed_brand_idx" ON "PartUsed"("brand");

-- CreateIndex
CREATE INDEX "Photo_maintenanceId_idx" ON "Photo"("maintenanceId");

-- AddForeignKey
ALTER TABLE "MaintenanceEntry" ADD CONSTRAINT "MaintenanceEntry_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceEntry" ADD CONSTRAINT "MaintenanceEntry_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartUsed" ADD CONSTRAINT "PartUsed_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "MaintenanceEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "MaintenanceEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
