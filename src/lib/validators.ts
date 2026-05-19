import { z } from "zod";

/**
 * Zod schemas used by server actions and (in PR #4+) form components.
 *
 * Inferred types are exported alongside so React Hook Form / form
 * actions can reuse them without re-deriving.
 */

export const loginSchema = z.object({
  email: z.string().email("Voer een geldig e-mailadres in."),
  password: z.string().min(1, "Wachtwoord is verplicht."),
});
export type LoginInput = z.infer<typeof loginSchema>;

const passwordRules = z
  .string()
  .min(10, "Minstens 10 tekens.")
  .max(100, "Maximaal 100 tekens.");

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Naam is verplicht.").max(100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Voer een geldig e-mailadres in."),
  password: passwordRules,
  role: z.enum(["ADMIN", "MECHANIC"]),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const resetPasswordSchema = z.object({
  userId: z.string().min(1),
  password: passwordRules,
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const setActiveSchema = z.object({
  userId: z.string().min(1),
  active: z.boolean(),
});
export type SetActiveInput = z.infer<typeof setActiveSchema>;
