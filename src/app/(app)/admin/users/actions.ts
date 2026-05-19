"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import {
  createUserSchema,
  resetPasswordSchema,
  setActiveSchema,
} from "@/lib/validators";
import { t } from "@/i18n/nl";

const BCRYPT_COST = 12;

type FieldErrors = Partial<Record<string, string>>;

export type FormState =
  | { ok: true; message?: string }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

function flattenZodErrors<T extends z.ZodSchema>(
  err: z.ZodError<z.infer<T>>
): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * Create a new user. Admin-only.
 *
 * Email collisions are surfaced as a single field error rather than a
 * 500. We never expose Prisma's raw error messages to the UI.
 */
export async function createUser(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: t.errors.unknown,
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, BCRYPT_COST);

  try {
    await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: parsed.data.role,
        active: true,
      },
    });
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return {
        ok: false,
        error: "Dit e-mailadres is al in gebruik.",
        fieldErrors: { email: "Dit e-mailadres is al in gebruik." },
      };
    }
    throw err;
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

/**
 * Reset a user's password. Admin-only.
 *
 * The new password is shown once on the form's response — written to a
 * password manager by the admin. We don't email it (no SMTP in v1).
 */
export async function resetPassword(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const parsed = resetPasswordSchema.safeParse({
    userId: formData.get("userId"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: t.errors.unknown,
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, BCRYPT_COST);

  await db.user.update({
    where: { id: parsed.data.userId },
    data: { passwordHash },
  });

  revalidatePath("/admin/users");
  return { ok: true, message: "Wachtwoord aangepast." };
}

/**
 * Activate / deactivate a user. Admin-only.
 *
 * Refuses to deactivate the calling admin (you can't lock yourself out
 * by accident). Also refuses to leave the system with zero active admins.
 */
export async function setActive(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const me = await requireAdmin();

  const parsed = setActiveSchema.safeParse({
    userId: formData.get("userId"),
    active: formData.get("active") === "true",
  });

  if (!parsed.success) {
    return { ok: false, error: t.errors.unknown };
  }

  if (parsed.data.userId === me.id && !parsed.data.active) {
    return { ok: false, error: t.users.cannotDeactivateSelf };
  }

  if (!parsed.data.active) {
    const target = await db.user.findUnique({
      where: { id: parsed.data.userId },
      select: { role: true, active: true },
    });
    if (target?.role === "ADMIN" && target.active) {
      const otherActiveAdmins = await db.user.count({
        where: {
          role: "ADMIN",
          active: true,
          id: { not: parsed.data.userId },
        },
      });
      if (otherActiveAdmins === 0) {
        return {
          ok: false,
          error:
            "Dit is de laatste actieve beheerder en kan niet gedeactiveerd worden.",
        };
      }
    }
  }

  await db.user.update({
    where: { id: parsed.data.userId },
    data: { active: parsed.data.active },
  });

  revalidatePath("/admin/users");
  return { ok: true };
}
