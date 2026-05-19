import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Label + input + error combo. Required fields show a red asterisk.
 */
export function Field({
  id,
  label,
  hint,
  error,
  required,
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
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="ml-0.5 text-danger" aria-hidden>
            *
          </span>
        ) : null}
      </Label>
      <Input
        id={id}
        name={id}
        required={required}
        aria-invalid={!!error}
        {...inputProps}
      />
      {hint && !error ? (
        <p className="text-xs text-fg-subtle">{hint}</p>
      ) : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
