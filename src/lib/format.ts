/**
 * Locale-aware formatters for Belgian users.
 *
 * Kept minimal — only what UI screens actually need. Add more as
 * features land rather than upfront.
 */

const DATE_FMT = new Intl.DateTimeFormat("nl-BE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const DATETIME_FMT = new Intl.DateTimeFormat("nl-BE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const NUMBER_FMT = new Intl.NumberFormat("nl-BE");

export const formatDate = (d: Date | string) => DATE_FMT.format(new Date(d));
export const formatDateTime = (d: Date | string) =>
  DATETIME_FMT.format(new Date(d));
export const formatNumber = (n: number) => NUMBER_FMT.format(n);
export const formatKm = (km: number) => `${formatNumber(km)} km`;

/**
 * Normalize a plate or VIN for storage.
 *
 * Strips whitespace, uppercases. We deliberately don't strip dashes —
 * "1-ABC-123" is the canonical Belgian format and mechanics will read
 * it that way. Trigram search matches partials anyway.
 */
export const normalizePlate = (s: string) => s.trim().toUpperCase();
export const normalizeVin = (s: string) => s.trim().toUpperCase();

/**
 * Strip everything except letters and digits, uppercase.
 * Used for search comparison so "1abc123" matches "1-ABC-123".
 */
export const stripPunctuation = (s: string) =>
  s.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
