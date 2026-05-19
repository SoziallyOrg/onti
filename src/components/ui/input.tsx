import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded border border-border-strong bg-bg px-3 text-base text-fg",
        "placeholder:text-fg-subtle",
        "transition-colors focus-visible:border-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // h-11 (44 px) is a comfortable touch target on workshop tablets.
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
