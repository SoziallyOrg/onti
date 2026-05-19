/**
 * Seed script.
 *
 * Idempotent — safe to run repeatedly. On every run it ensures an admin
 * account exists based on env vars. Demo/sample data is added in PR #5
 * (maintenance + parts + photos) so the system can be demo'd before any
 * real customer data is entered.
 *
 * Run:
 *   pnpm db:seed
 *
 * Required env vars (see .env.example):
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 */
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Onti Banden";

  if (!email || !password) {
    console.error(
      "Refusing to seed: ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment."
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await db.user.upsert({
    where: { email },
    create: { email, name, passwordHash, role: Role.ADMIN, active: true },
    // Don't overwrite the password on subsequent runs — once set, the
    // admin manages their own password through the app.
    update: { name, role: Role.ADMIN, active: true },
  });

  console.log(`Admin gebruiker klaar: ${admin.email} (id=${admin.id})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
