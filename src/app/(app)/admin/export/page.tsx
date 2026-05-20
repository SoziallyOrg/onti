import { Download, Car, Wrench, Package } from "lucide-react";
import { requireAdmin } from "@/lib/auth-helpers";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n/nl";

export const metadata = { title: `${t.exports.title} — ${t.app.name}` };

/**
 * Admin-only download hub. Each link points at a route handler that
 * builds the CSV server-side (semicolon delimiter, UTF-8 with BOM —
 * opens cleanly in nl-BE Excel) and streams it back as an attachment.
 */
export default async function ExportPage() {
  await requireAdmin();

  const exports = [
    {
      href: "/api/export/vehicles",
      title: t.exports.vehicles.title,
      description: t.exports.vehicles.description,
      icon: Car,
    },
    {
      href: "/api/export/maintenance",
      title: t.exports.maintenance.title,
      description: t.exports.maintenance.description,
      icon: Wrench,
    },
    {
      href: "/api/export/parts",
      title: t.exports.parts.title,
      description: t.exports.parts.description,
      icon: Package,
    },
  ] as const;

  return (
    <main className="container py-8">
      <header className="mb-6">
        <h1>{t.exports.title}</h1>
        <p className="mt-1 text-fg-subtle">{t.exports.subtitle}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {exports.map((e) => {
          const Icon = e.icon;
          return (
            <Card key={e.href}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                  {e.title}
                </CardTitle>
                <CardDescription>{e.description}</CardDescription>
              </CardHeader>
              {/* Native <a download> so the browser saves the file
                  without our JS bundle being involved. */}
              <Button asChild>
                <a href={e.href} download>
                  <Download className="h-4 w-4" aria-hidden />{" "}
                  {t.exports.download}
                </a>
              </Button>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-fg-subtle">{t.exports.formatNote}</p>
    </main>
  );
}
