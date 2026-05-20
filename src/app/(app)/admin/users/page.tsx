import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n/nl";
import { UserRow, UserCard } from "./user-row";

export const metadata = { title: `${t.users.title} — ${t.app.name}` };

export default async function UsersAdminPage() {
  const me = await requireAdmin();

  const users = await db.user.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  return (
    <main className="container py-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1>{t.users.title}</h1>
          <p className="mt-1 text-fg-subtle">{t.users.subtitle}</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">{t.users.new}</Link>
        </Button>
      </header>

      {users.length === 0 ? (
        <p className="text-fg-subtle">{t.users.nonePlaceholder}</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-border/30 text-left text-fg-subtle">
                <tr>
                  <th className="px-4 py-2 font-medium">{t.users.name}</th>
                  <th className="px-4 py-2 font-medium">{t.auth.email}</th>
                  <th className="px-4 py-2 font-medium">{t.users.role}</th>
                  <th className="px-4 py-2 font-medium">{t.users.status}</th>
                  <th className="px-4 py-2 text-right font-medium">
                    {t.users.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <UserRow key={u.id} user={u} isSelf={u.id === me.id} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="flex flex-col gap-4 md:hidden">
            {users.map((u) => (
              <UserCard key={u.id} user={u} isSelf={u.id === me.id} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
