import { Wrench } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { t } from "@/i18n/nl";
import { LoginForm } from "./login-form";

export const metadata = { title: `${t.auth.loginTitle} — ${t.app.name}` };

type SearchParams = { from?: string };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { from } = await searchParams;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-primary">
            <Wrench className="h-5 w-5 text-primary-fg" aria-hidden />
          </div>
          <div>
            <p className="font-display text-base font-semibold leading-none">
              {t.app.name}
            </p>
            <p className="text-xs text-fg-subtle">{t.app.tagline}</p>
          </div>
        </div>
        <CardTitle>{t.auth.loginTitle}</CardTitle>
        <CardDescription>{t.auth.loginSubtitle}</CardDescription>
      </CardHeader>
      <LoginForm from={from} />
    </Card>
  );
}
