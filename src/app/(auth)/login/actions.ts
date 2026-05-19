"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validators";
import { t } from "@/i18n/nl";

export type LoginState = { error: string | null };

/**
 * Server action backing the login form.
 *
 * On success, `signIn` redirects (which surfaces as a NEXT_REDIRECT error
 * we must re-throw). On any other failure we return a generic Dutch
 * message — never reveal whether the email exists.
 */
export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: t.auth.invalidCredentials };
  }

  const from = formData.get("from");
  const redirectTo =
    typeof from === "string" && from.startsWith("/") ? from : "/";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo,
    });
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: t.auth.invalidCredentials };
    }
    // NEXT_REDIRECT and similar control-flow errors must propagate.
    throw error;
  }
}
