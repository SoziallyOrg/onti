"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  id: string;
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export function CustomSelect({ id, label, value, options, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="flex items-center gap-2 relative" ref={containerRef}>
      <span className="text-xs font-semibold text-fg-subtle shrink-0">
        {label}
      </span>
      <div className="relative">
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-8 w-fit min-w-[140px] items-center justify-between gap-3 rounded-lg border border-border bg-bg pl-3 pr-2.5 text-xs font-medium shadow-sm transition-all hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-ring text-left cursor-pointer"
        >
          <span className="truncate pr-1">{selectedOption.label}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-fg-subtle shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <ul
            role="listbox"
            className="absolute left-0 mt-1.5 max-h-60 w-full min-w-[200px] overflow-auto rounded-lg border border-border bg-bg p-1 shadow-lg z-50 focus:outline-none animate-in fade-in duration-100"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between gap-2 cursor-pointer select-none rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-fg font-semibold"
                      : "text-fg hover:bg-muted"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

type FilterBarProps = {
  makes: string[];
};

export function FilterBar({ makes }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMake = searchParams.get("make") ?? "all";
  const currentSort = searchParams.get("sort") ?? "newest";

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/vehicles?${params.toString()}`);
  }

  const makeOptions: Option[] = [
    { value: "all", label: "Alle merken" },
    ...makes.map((make) => ({ value: make, label: make })),
  ];

  const sortOptions: Option[] = [
    { value: "newest", label: "Laatst bewerkt (nieuwste)" },
    { value: "oldest", label: "Eerst bewerkt (oudste)" },
    { value: "plate", label: "Nummerplaat (A-Z)" },
    { value: "make_model", label: "Merk & Model (A-Z)" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 py-3 border-y border-border bg-muted/10 px-4 rounded-xl mt-4">
      <div className="flex items-center gap-2 text-fg-subtle text-sm font-medium">
        <SlidersHorizontal className="h-4 w-4" />
        <span>Filters:</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {/* Brand/Make Filter */}
        <CustomSelect
          id="filter-make"
          label="Merk"
          value={currentMake}
          options={makeOptions}
          onChange={(value) => handleFilterChange("make", value)}
        />

        {/* Sort Filter */}
        <CustomSelect
          id="filter-sort"
          label="Sorteer op"
          value={currentSort}
          options={sortOptions}
          onChange={(value) => handleFilterChange("sort", value)}
        />
      </div>
    </div>
  );
}
