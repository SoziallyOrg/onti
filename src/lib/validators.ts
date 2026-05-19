import { z } from "zod";

/**
 * Zod schemas used by server actions and form components.
 *
 * Inferred types are exported alongside so React Hook Form / form
 * actions can reuse them without re-deriving.
 */

// --- Auth -----------------------------------------------------------

export const loginSchema = z.object({
  email: z.string().email("Voer een geldig e-mailadres in."),
  password: z.string().min(1, "Wachtwoord is verplicht."),
});
export type LoginInput = z.infer<typeof loginSchema>;

// --- Users (admin) --------------------------------------------------

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

// --- Vehicles -------------------------------------------------------

// VIN: ISO 3779 says 17 chars, alphanumeric, never I / O / Q. We accept
// uppercase only (lowercase will be uppercased by the server action
// before parsing). Some older or pre-1981 cars have shorter VINs, so we
// soften the floor to 11 chars and warn rather than reject — it's an
// internal app for mechanics, not a state registry.
const vinRegex = /^[A-HJ-NPR-Z0-9]{11,17}$/;

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined));

const requiredString = (max: number, label: string) =>
  z.string().trim().min(1, `${label} is verplicht.`).max(max);

export const vehicleSchema = z.object({
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .min(11, "Minstens 11 tekens.")
    .max(17, "Maximaal 17 tekens.")
    .regex(vinRegex, "Alleen hoofdletters en cijfers (geen I, O of Q)."),
  plate: z
    .string()
    .trim()
    .toUpperCase()
    .min(2, "Nummerplaat is verplicht.")
    .max(20),
  make: requiredString(60, "Merk"),
  model: requiredString(60, "Model"),
  engine: optionalString(60),
  modelYear: z
    .union([
      z.literal(""),
      z.coerce
        .number()
        .int()
        .min(1900, "Vanaf 1900.")
        .max(new Date().getFullYear() + 1, "Te ver in de toekomst."),
    ])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  customerName: requiredString(120, "Klantnaam"),
  customerPhone: optionalString(40),
});
export type VehicleInput = z.infer<typeof vehicleSchema>;

export const updateVehicleSchema = vehicleSchema.extend({
  id: z.string().min(1),
});
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;

export const searchSchema = z.object({
  q: z.string().trim().max(100),
});
