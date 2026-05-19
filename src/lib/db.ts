import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma client.
 *
 * Next.js dev mode hot-reloads modules, which would otherwise create
 * a new connection pool on every change and exhaust Postgres. We stash
 * the client on `globalThis` in non-production so it survives reloads.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
