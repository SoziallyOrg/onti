"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2, Archive, User, Car } from "lucide-react";
import { Input } from "@/components/ui/input";
import { t } from "@/i18n/nl";

/**
 * Search bar in the top nav with a dynamic dropdown.
 *
 * Behaviour:
 * - Types query with 150ms debounce
 * - Fetches matches from `/api/vehicles/search` (includes archived check)
 * - Shows loader spinner during active fetch
 * - Keydown controls: ArrowDown/Up to navigate list, Escape to close, Enter to go
 * - Submits form to `/vehicles?q=...` if no auto-suggest item is highlighted
 * - Outside click or blur auto-closes the dropdown menu
 */
export function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Sync with current `?q=` URL param asynchronously to avoid react-hooks/set-state-in-effect
  useEffect(() => {
    const urlQuery = params.get("q") ?? "";
    Promise.resolve().then(() => {
      setQuery(urlQuery);
    });
    if (inputRef.current) {
      inputRef.current.value = urlQuery;
    }
  }, [params]);

  // `/` keyboard shortcut to focus input
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

  // Fetch results based on debounced query changes
  useEffect(() => {
    if (query.trim().length === 0) {
      Promise.resolve().then(() => {
        setResults([]);
        setIsLoading(false);
      });
      return;
    }

    let active = true;

    Promise.resolve().then(() => {
      if (active) setIsLoading(true);
    });

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/vehicles/search?q=${encodeURIComponent(query)}`);
        if (res.ok && active) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Autocomplete search failed:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    }, 150);

    return () => {
      active = false;
      clearTimeout(delayDebounce);
    };
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter") {
      if (isOpen && activeIndex >= 0 && activeIndex < results.length) {
        e.preventDefault();
        const selected = results[activeIndex];
        handleSelect(selected);
      }
    }
  };

  const handleSelect = (vehicle: any) => {
    router.push(`/vehicles/${vehicle.id}`);
    setIsOpen(false);
    setQuery(vehicle.plate);
    if (inputRef.current) {
      inputRef.current.value = vehicle.plate;
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsOpen(false);
    const q = inputRef.current?.value.trim() ?? "";
    if (q.length === 0) {
      router.push("/vehicles");
      return;
    }
    router.push(`/vehicles?q=${encodeURIComponent(q)}`);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleFormSubmit} className="flex w-full items-center" role="search">
        <label htmlFor="nav-search" className="sr-only">
          {t.search.label}
        </label>
        <div className="relative w-full">
          {isLoading ? (
            <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
          ) : (
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" aria-hidden />
          )}
          <Input
            id="nav-search"
            ref={inputRef}
            name="q"
            type="search"
            inputMode="search"
            autoComplete="off"
            defaultValue={initialQuery}
            placeholder={t.search.placeholder}
            className="h-10 pl-9 pr-8"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim().length > 0) setIsOpen(true);
            }}
          />
        </div>
      </form>

      {/* Suggestion Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-[360px] overflow-y-auto rounded-lg border border-border bg-bg shadow-xl animate-in fade-in duration-100 slide-in-from-top-1">
          {results.length > 0 ? (
            <ul role="listbox">
              {results.map((vehicle, index) => {
                const isActive = index === activeIndex;
                return (
                  <li
                    key={vehicle.id}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(vehicle)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer select-none border-b border-border/30 last:border-0 transition-colors ${
                      isActive ? "bg-primary/10 text-fg" : "hover:bg-fg/5"
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold tracking-tight text-fg">
                          {vehicle.plate}
                        </span>
                        {vehicle.isArchived && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-fg-subtle/10 px-1.5 py-0.5 text-[10px] font-medium text-fg-subtle uppercase tracking-wider">
                            <Archive className="h-2.5 w-2.5" />
                            Gearchiveerd
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-fg-subtle">
                        <Car className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {vehicle.make} {vehicle.model}
                        </span>
                        {vehicle.vin && (
                          <>
                            <span className="text-fg-subtle/30 select-none">•</span>
                            <span className="font-mono text-[10px] uppercase text-fg-subtle/80 tracking-wider">
                              {vehicle.vin}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-fg-subtle">
                      <User className="h-3.5 w-3.5 text-fg-subtle/70" />
                      <span className="font-medium max-w-[120px] truncate">
                        {vehicle.customerName}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            !isLoading && (
              <div className="px-4 py-3 text-sm text-fg-subtle text-center">
                Geen voertuigen gevonden voor &ldquo;{query}&rdquo;
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
