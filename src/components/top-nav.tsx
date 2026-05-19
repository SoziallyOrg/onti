import Link from "next/link";
import { Wrench } from "lucide-react";
import { signOut } from "@/auth";
import { t } from "@/i18n/nl";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import type { Role } from "@prisma/client";

/**
 * Top navigation bar shown on every authenticated page.
 *
 * The Vehicles link is a placeholder until PR #4 lands the route.
 * The Admin link is hidden for non-admins so mechanics never see it.
 */
export function TopNav({
  user,
}: {
  user: { name?: string | null; role: Role };
}) {
  return (
    <header className="bg-bg/95 sticky top-0 z-10 border-b border-border backdrop-blur">
      <div className="container flex h-14 items-center gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-fg hover:opacity-80"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded bg-primary">
            <Wrench className="h-4 w-4 text-primary-fg" aria-hidden />
          </span>
          <span className="hidden font-display text-base font-semibold sm:inline">
            {t.app.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Link href="/" className="text-fg-subtle hover:text-fg">
            {t.nav.home}
          </Link>
          <Link href="/vehicles" className="text-fg-subtle hover:text-fg">
            {t.nav.vehicles}
          </Link>
          {user.role === "ADMIN" ? (
            <Link href="/admin/users" className="text-fg-subtle hover:text-fg">
              {t.nav.admin}
            </Link>
          ) : null}
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-3">
          <div className="flex-1 md:max-w-md">
            <SearchBar />
          </div>

          {user.name ? (
            <span className="hidden text-sm text-fg-subtle lg:inline">
              {user.name}
            </span>
          ) : null}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button type="submit" variant="ghost" size="sm">
              {t.nav.signOut}
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
