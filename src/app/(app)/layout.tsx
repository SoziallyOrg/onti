import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth-helpers";
import { TopNav } from "@/components/top-nav";
import { MobileNav } from "@/components/mobile-nav";

/**
 * Shell for every authenticated page.
 *
 * Calls `requireUser()` server-side as a defence-in-depth check on top of
 * the edge middleware. Also gives child pages access to the user via
 * their own `auth()` calls without re-querying.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav user={user} />
      {/* pb-20 on mobile ensures content doesn't hide behind the fixed bottom nav */}
      <div className="flex-1 pb-20 md:pb-0">{children}</div>
      <MobileNav isAdmin={user.role === "ADMIN"} />
    </div>
  );
}
