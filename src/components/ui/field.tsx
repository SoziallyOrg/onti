import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Label + input + error combo. Keeps form pages from drowning in
 * boilerplate. For controls that aren't `<input>` (textarea, select)
 * compose the primitives by hand.
 */
export function Field({
  id,
  label,
  hint,
  error,
  className,
  ...inputProps
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
} & Omit<InputProps, "id">) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} aria-invalid={!!error} {...inputProps} />
      {hint && !error ? <p className="text-xs text-fg-subtle">{hint}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
