import type { ReactNode } from "react";

/**
 * Layout for unauthenticated routes (currently just /login).
 *
 * Intentionally has no nav — we don't want to expose the app shell
 * to a user who isn't logged in.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="bg-border/30 flex min-h-screen items-center justify-center p-4">
      {children}
    </main>
  );
}
