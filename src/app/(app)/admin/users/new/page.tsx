import Link from "next/link";
import { requireAdmin } from "@/lib/auth-helpers";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n/nl";
import { NewUserForm } from "./new-user-form";

export const metadata = { title: `${t.users.new} — ${t.app.name}` };

export default async function NewUserPage() {
  await requireAdmin();

  return (
    <main className="container max-w-xl py-8">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/users">← {t.users.title}</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t.users.new}</CardTitle>
          <CardDescription>
            Geef het wachtwoord persoonlijk door aan de gebruiker — hij of zij
            kan het zelf niet resetten zonder beheerder.
          </CardDescription>
        </CardHeader>
        <NewUserForm />
      </Card>
    </main>
  );
}
