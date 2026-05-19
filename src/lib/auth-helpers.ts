import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Role } from "@prisma/client";

/**
 * Server-side guards used by protected pages and server actions.
 *
 * Middleware already redirects anonymous users at the edge, but each
 * protected page calls `requireUser()` too — a missed matcher pattern
 * shouldn't leak data, and this also gives us a typed `session.user.id`
 * to use in queries.
 */

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== ("ADMIN" satisfies Role)) {
    // Don't tell the user they hit an admin-only page — just send them
    // home. The nav doesn't expose admin links to non-admins anyway.
    redirect("/");
  }
  return user;
}
