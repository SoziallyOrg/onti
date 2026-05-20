"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Crown } from "lucide-react";
import { signOut } from "next-auth/react";
import { t } from "@/i18n/nl";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { cn } from "@/lib/utils";
import type { Role } from "@prisma/client";

function getHeaderMaxWidth(pathname: string): string {
  if (pathname === "/admin/users/new") {
    return "max-w-xl";
  }
  if (pathname === "/vehicles/new") {
    return "max-w-2xl";
  }
  
  if (/\/vehicles\/[^/]+\/edit$/.test(pathname)) {
    return "max-w-2xl";
  }
  
  if (/\/vehicles\/[^/]+\/maintenance\/new$/.test(pathname)) {
    return "max-w-3xl";
  }

  if (/\/vehicles\/[^/]+\/maintenance\/[^/]+\/edit$/.test(pathname)) {
    return "max-w-3xl";
  }

  return "max-w-none";
}

/**
 * Top navigation bar shown on every authenticated page.
 *
 * On mobile: logo + full-width search + sign-out. No nav links —
 * those are handled by the bottom MobileNav.
 * On desktop: logo + nav links + search (capped width) + user + sign-out.
 */
export function TopNav({
  user,
}: {
  user: { name?: string | null; role: Role };
}) {
  const pathname = usePathname();
  const maxWidthClass = getHeaderMaxWidth(pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg">
      <div className={cn("container flex h-14 items-center gap-2 md:gap-4 transition-all duration-200", maxWidthClass)}>
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

        {/* Desktop nav links — hidden on mobile (bottom nav takes over) */}
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Link href="/" className="text-fg-subtle hover:text-fg">
            {t.nav.home}
          </Link>
          <Link href="/vehicles" className="text-fg-subtle hover:text-fg">
            {t.nav.vehicles}
          </Link>
          {user.role === "ADMIN" ? (
            <>
              <Link
                href="/admin/users"
                className="text-fg-subtle hover:text-fg"
              >
                {t.nav.users}
              </Link>
              <Link
                href="/admin/export"
                className="text-fg-subtle hover:text-fg"
              >
                {t.nav.exports}
              </Link>
            </>
          ) : null}
          <Link
            href="/premium"
            className={cn(
              "inline-flex items-center gap-1.5 font-semibold text-warning hover:opacity-85 transition-opacity",
              pathname === "/premium" && "underline underline-offset-4"
            )}
          >
            <Crown className="h-3.5 w-3.5" aria-hidden />
            <span>Premium</span>
          </Link>
        </nav>

        <div className="ml-auto flex flex-1 justify-end items-center gap-2 md:gap-3">
          <div className="w-full md:max-w-md">
            <SearchBar />
          </div>

          {user.name ? (
            <span className="hidden text-sm text-fg-subtle lg:inline">
              {user.name}
            </span>
          ) : null}
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            {t.nav.signOut}
          </Button>
        </div>
      </div>
    </header>
  );
}
