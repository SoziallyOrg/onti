import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class strings, deduplicating conflicting utilities.
 * Used by every component to combine variant classes with caller-provided ones.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
