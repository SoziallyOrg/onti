import { stringify } from "csv-stringify/sync";

/**
 * CSV helpers tailored for Belgian Excel users.
 *
 * Defaults:
 * - `;` field separator (the default in nl-BE locale Excel)
 * - `\r\n` line endings (Excel friendliest)
 * - UTF-8 BOM prefix so Excel doesn't mangle accented characters
 *
 * The dataset never gets big enough to need streaming (a few thousand
 * vehicles, tens of thousands of entries over years), so we stringify
 * the whole thing in memory and return a single Response body.
 */

const UTF8_BOM = "\uFEFF";

export function toCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns: { key: keyof T & string; header: string }[]
): string {
  return stringify(rows, {
    header: true,
    columns: columns.map((c) => ({ key: c.key, header: c.header })),
    delimiter: ";",
    record_delimiter: "\r\n",
    quoted_string: true,
    cast: {
      // ISO YYYY-MM-DD HH:MM (no fractional seconds, no timezone).
      // Excel parses this as a date in nl-BE without further coaxing.
      date: (v: Date) => {
        const pad = (n: number) => String(n).padStart(2, "0");
        return (
          `${v.getFullYear()}-${pad(v.getMonth() + 1)}-${pad(v.getDate())}` +
          ` ${pad(v.getHours())}:${pad(v.getMinutes())}`
        );
      },
      boolean: (v: boolean) => (v ? "1" : "0"),
    },
  });
}

/**
 * Build a Response that streams a CSV download to the browser. Only
 * one place sets headers so we don't drift on Content-Disposition.
 */
export function csvResponse(filenameSlug: string, body: string): Response {
  // YYYYMMDD timestamp suffix so users can tell exports apart in their
  // Downloads folder. Local time, not UTC — matches what they expect.
  const now = new Date();
  const stamp =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const filename = `${filenameSlug}-${stamp}.csv`;

  return new Response(UTF8_BOM + body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
