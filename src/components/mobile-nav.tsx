"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Start", icon: Home },
  { href: "/vehicles", label: "Zoeken", icon: Search },
  { href: "/vehicles/new", label: "Nieuw", icon: PlusCircle },
  { href: "/admin/users", label: "Team", icon: Users, adminOnly: true },
];

/**
 * Fixed bottom navigation bar — visible only on mobile (< md).
 *
 * Provides the core navigation that desktop gets from the top nav links.
 * Uses large 56px tap targets so mechanics with gloves or dirty fingers
 * can navigate reliably.
 */
export function MobileNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <nav
      aria-label="Mobiele navigatie"
      className="bg-bg/95 fixed inset-x-0 bottom-0 z-50 border-t border-border backdrop-blur md:hidden"
    >
      <ul className="flex items-stretch justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] transition-colors",
                  "min-h-[56px]",
                  isActive
                    ? "font-medium text-primary"
                    : "text-fg-subtle hover:text-fg"
                )}
              >
                <Icon
                  className={cn("h-5 w-5", isActive && "text-primary")}
                  aria-hidden
                />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
        {/* Sign-out: always last, uses a form for server action */}
        <li className="flex-1">
          <form action="/api/auth/signout" method="POST" className="h-full">
            <button
              type="submit"
              className="flex h-full min-h-[56px] w-full flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] text-fg-subtle transition-colors hover:text-fg"
            >
              <LogOut className="h-5 w-5" aria-hidden />
              <span>Uit</span>
            </button>
          </form>
        </li>
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
