"use client";

import { Plus, Trash2 } from "lucide-react";
import type { PartCategory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t } from "@/i18n/nl";

export type PartDraft = {
  category: PartCategory;
  oemNumber: string;
  brand: string;
  supplier: string;
  notes: string;
};

export const emptyPart = (): PartDraft => ({
  category: "OIL_FILTER",
  oemNumber: "",
  brand: "",
  supplier: "",
  notes: "",
});

const CATEGORY_OPTIONS: PartCategory[] = [
  "OIL_FILTER",
  "AIR_FILTER",
  "CABIN_FILTER",
  "FUEL_FILTER",
  "BRAKE_PAD",
  "BRAKE_DISC",
  "OTHER",
];

const selectClass =
  "flex h-11 w-full rounded border border-border-strong bg-bg px-3 text-base text-fg focus-visible:border-primary";

/**
 * Dynamic editor for the parts attached to a maintenance entry.
 *
 * Owns its own array state. The parent serialises to JSON in a hidden
 * field on submit; the server validates with zod regardless of what
 * we wire up here.
 */
export function PartsEditor({
  parts,
  onChange,
}: {
  parts: PartDraft[];
  onChange: (next: PartDraft[]) => void;
}) {
  const update = (index: number, patch: Partial<PartDraft>) => {
    onChange(parts.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const remove = (index: number) => {
    onChange(parts.filter((_, i) => i !== index));
  };

  const add = () => onChange([...parts, emptyPart()]);

  return (
    <div className="space-y-4">
      {parts.length === 0 ? (
        <p className="text-sm text-fg-subtle">{t.maintenance.parts.empty}</p>
      ) : (
        <ul className="space-y-3">
          {parts.map((p, i) => (
            <li
              key={i}
              className="bg-border/20 rounded border border-border p-3"
            >
              <div className="grid gap-3 md:grid-cols-12">
                <div className="space-y-1.5 md:col-span-3">
                  <Label htmlFor={`p-cat-${i}`}>
                    {t.maintenance.parts.category}
                  </Label>
                  <select
                    id={`p-cat-${i}`}
                    value={p.category}
                    onChange={(e) =>
                      update(i, { category: e.target.value as PartCategory })
                    }
                    className={selectClass}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {t.maintenance.categories[c]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-3">
                  <Label htmlFor={`p-oem-${i}`}>
                    {t.maintenance.parts.oemNumber}
                  </Label>
                  <Input
                    id={`p-oem-${i}`}
                    value={p.oemNumber}
                    autoComplete="off"
                    onChange={(e) => update(i, { oemNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor={`p-brand-${i}`}>
                    {t.maintenance.parts.brand}
                  </Label>
                  <Input
                    id={`p-brand-${i}`}
                    value={p.brand}
                    autoComplete="off"
                    onChange={(e) => update(i, { brand: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor={`p-sup-${i}`}>
                    {t.maintenance.parts.supplier}
                  </Label>
                  <Input
                    id={`p-sup-${i}`}
                    value={p.supplier}
                    autoComplete="off"
                    onChange={(e) => update(i, { supplier: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor={`p-note-${i}`}>
                    {t.maintenance.parts.partNote}
                  </Label>
                  <Input
                    id={`p-note-${i}`}
                    value={p.notes}
                    autoComplete="off"
                    onChange={(e) => update(i, { notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-2 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(i)}
                  aria-label={t.maintenance.parts.remove}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />{" "}
                  {t.maintenance.parts.remove}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-4 w-4" aria-hidden /> {t.maintenance.parts.add}
      </Button>
    </div>
  );
}
