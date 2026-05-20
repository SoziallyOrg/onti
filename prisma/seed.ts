import { PrismaClient, Role, PartCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  // 1. Create/Ensure Admin User
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@onti.be";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123456";
  const adminName = process.env.ADMIN_NAME ?? "Onti Banden";

  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await db.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      active: true,
    },
    update: { name: adminName, role: Role.ADMIN, active: true },
  });
  console.log(`Admin user: ${admin.email} (id=${admin.id})`);

  // 2. Create/Ensure Mechanic User
  const mechanicEmail = "mechanic@onti.be";
  const mechanicPassword = "mechanic123456";
  const mechanicName = "Dirk Wrench";
  const mechanicPasswordHash = await bcrypt.hash(mechanicPassword, 12);

  const mechanic = await db.user.upsert({
    where: { email: mechanicEmail },
    create: {
      email: mechanicEmail,
      name: mechanicName,
      passwordHash: mechanicPasswordHash,
      role: Role.MECHANIC,
      active: true,
    },
    update: { name: mechanicName, role: Role.MECHANIC, active: true },
  });
  console.log(`Mechanic user: ${mechanic.email} (id=${mechanic.id})`);

  // 3. Create/Ensure Sample Vehicles
  const sampleVehicles = [
    {
      vin: "VF33AYFJZ25123456",
      plate: "1-ABC-123",
      make: "Volkswagen",
      model: "Golf VII",
      engine: "1.6 TDI",
      modelYear: 2018,
      customerName: "Jan Janssens",
      customerPhone: "0475123456",
      entries: [
        {
          date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
          km: 120500,
          oilType: "5W-30 Longlife",
          oilLiters: 4.5,
          notes: "Kleine beurt en controle remmen.",
          createdById: admin.id,
          parts: [
            {
              category: PartCategory.OIL_FILTER,
              oemNumber: "03L115562",
              brand: "Bosch",
              supplier: "LKQ RHIAG",
            },
            {
              category: PartCategory.CABIN_FILTER,
              oemNumber: "5Q0819653",
              brand: "Mann-Filter",
              supplier: "LKQ RHIAG",
            },
          ],
        },
        {
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          km: 135200,
          oilType: "5W-30 Longlife",
          oilLiters: 4.5,
          notes: "Grote beurt + remblokken vooraan vervangen. Ruitenwisservloeistof bijgevuld.",
          createdById: mechanic.id,
          parts: [
            {
              category: PartCategory.OIL_FILTER,
              oemNumber: "03L115562",
              brand: "Bosch",
              supplier: "LKQ RHIAG",
            },
            {
              category: PartCategory.AIR_FILTER,
              oemNumber: "5Q0129620B",
              brand: "Bosch",
              supplier: "LKQ RHIAG",
            },
            {
              category: PartCategory.BRAKE_PAD,
              oemNumber: "5Q0698151B",
              brand: "Brembo",
              supplier: "Brezan",
              notes: "Remslijtageindicator aangesloten.",
            },
          ],
        },
      ],
    },
    {
      vin: "WAUZZZ8K0FA654321",
      plate: "2-XYZ-987",
      make: "Audi",
      model: "A4 Avant",
      engine: "2.0 TDI",
      modelYear: 2020,
      customerName: "Marie Dubois",
      customerPhone: "0486987654",
      entries: [
        {
          date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
          km: 85000,
          oilType: "0W-30 Premium",
          oilLiters: 5.0,
          notes: "Olie verversen + ruitenwissers vervangen.",
          createdById: mechanic.id,
          parts: [
            {
              category: PartCategory.OIL_FILTER,
              oemNumber: "059115561G",
              brand: "Purflux",
              supplier: "LKQ RHIAG",
            },
            {
              category: PartCategory.CABIN_FILTER,
              oemNumber: "4M0819439",
              brand: "Mann-Filter",
              supplier: "Brezan",
            },
          ],
        },
      ],
    },
    {
      vin: "WBA3B31000K987654",
      plate: "1-ONTI-007",
      make: "BMW",
      model: "320i",
      engine: "2.0i",
      modelYear: 2016,
      customerName: "Pieter Peeters",
      customerPhone: "0495112233",
      entries: [
        {
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
          km: 110400,
          oilType: "5W-30 M-Performance",
          oilLiters: 5.2,
          notes: "Onderhoudsbeurt + brandstoffilter vervangen.",
          createdById: admin.id,
          parts: [
            {
              category: PartCategory.OIL_FILTER,
              oemNumber: "11428570590",
              brand: "Knecht/Mahle",
              supplier: "Brezan",
            },
            {
              category: PartCategory.FUEL_FILTER,
              oemNumber: "13328572522",
              brand: "Mann-Filter",
              supplier: "LKQ RHIAG",
            },
          ],
        },
      ],
    },
  ];

  for (const vData of sampleVehicles) {
    const { entries, ...vInfo } = vData;

    // Check if vehicle already exists by VIN (canonical identity)
    let vehicle = await db.vehicle.findUnique({
      where: { vin: vInfo.vin },
    });

    if (!vehicle) {
      vehicle = await db.vehicle.create({
        data: vInfo,
      });
      console.log(`Voertuig aangemaakt: ${vehicle.make} ${vehicle.model} [${vehicle.plate}]`);

      // Add maintenance entries for newly created vehicles
      for (const entryData of entries) {
        const { parts, ...eInfo } = entryData;
        const entry = await db.maintenanceEntry.create({
          data: {
            ...eInfo,
            vehicleId: vehicle.id,
            parts: {
              create: parts,
            },
          },
        });
        console.log(`  - Onderhoudsbeurt toegevoegd voor ${vehicle.plate} op ${entry.km} KM`);
      }
    } else {
      console.log(`Voertuig bestaat al: ${vehicle.make} ${vehicle.model} [${vehicle.plate}]`);
    }
  }

  console.log("Database succesvol gevuld met testdata!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
