"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { t } from "@/i18n/nl";

/**
 * Search bar in the top nav.
 *
 * Behaviour:
 * - Submits to `/vehicles?q=...` (server-rendered results)
 * - Reflects the current `?q=` so the input stays in sync after submit
 * - `/` keyboard shortcut focuses the input from anywhere except text
 *   fields, matching the muscle memory mechanics already have from
 *   tools like Carya
 */
export function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the input synced with `?q=` from the URL — useful when the
  // user clicks back from a vehicle detail page.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = params.get("q") ?? initialQuery;
    }
  }, [params, initialQuery]);

  // `/` to focus, unless already in a text field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName ?? "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? "";
    if (q.length === 0) {
      router.push("/vehicles");
      return;
    }
    router.push(`/vehicles?q=${encodeURIComponent(q)}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-md items-center"
      role="search"
    >
      <label htmlFor="nav-search" className="sr-only">
        {t.search.label}
      </label>
      <div className="relative w-full">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle"
          aria-hidden
        />
        <Input
          id="nav-search"
          ref={inputRef}
          name="q"
          type="search"
          inputMode="search"
          autoComplete="off"
          defaultValue={initialQuery}
          placeholder={t.search.placeholder}
          className="h-10 pl-9"
        />
      </div>
    </form>
  );
}
