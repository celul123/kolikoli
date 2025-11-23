"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { X } from "lucide-react"; 
import { DateRangePicker } from "./date-range-picker";
import { Input } from "@/components/ui/input";


// Helper to parse dates from URL params
function getInitialDateRange(
  startParam: string | null,
  endParam: string | null,
): DateRange | undefined {
  const from = startParam ? new Date(startParam) : undefined;
  const to = endParam ? new Date(endParam) : undefined;

  // Ensure dates are valid before returning
  if (from && !isNaN(from.getTime())) {
    return { from, to: to && !isNaN(to.getTime()) ? to : undefined };
  }
  return undefined;
}

// Custom hook to debounce a value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timeout to update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (e.g., user keeps typing)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run if value or delay changes

  return debouncedValue;
}

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL search params
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    getInitialDateRange(searchParams.get("start"), searchParams.get("end")),
  );

  // Debounce the query input
  const debouncedQuery = useDebounce(query, 500);

  // Ref to prevent firing useEffect on initial render
  const isInitialMount = useRef(true);

  // This useEffect triggers the navigation when debouncedQuery or dateRange changes
  useEffect(() => {
    // Skip the first render to avoid redundant navigation
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();

    if (debouncedQuery) {
      params.set("query", debouncedQuery);
    }
    if (dateRange?.from) {
      // Format to YYYY-MM-DD for a clean URL
      params.set("start", format(dateRange.from, "yyyy-MM-dd"));
    }
    if (dateRange?.to) {
      params.set("end", format(dateRange.to, "yyyy-MM-dd"));
    }

    // Update URL, which triggers the Server Component to refetch
    // We use 'replace' to avoid polluting browser history with every keystroke
    router.replace(`/panel/satislar?${params.toString()}`);
  }, [debouncedQuery, dateRange, router]); // Dependency array

  const handleClear = () => {
    // 1. Reset the local state so the inputs clear
    setQuery("");
    setDateRange(undefined);

    // 2. Navigate to the page with no search params
    // 'push' is fine here as it's a deliberate user action
    router.push("/panel/satislar");
  };

  // Check if any filter is active
  const isFilterActive = Boolean(query || dateRange?.from || dateRange?.to);

  return (
    <div className="flex gap-4 items-center">
      <div className="relative">
        <Input
          type="text"
          name="query"
          placeholder="Ürün veya müşteri ara..."
          value={query} // Controlled component
          onChange={(e) => setQuery(e.target.value)}
          className="placeholder:text-seperator py-1.5 pr-10" // Add padding-right for the 'X'
        />
      </div>

      <DateRangePicker value={dateRange} onSelect={setDateRange} />

      {/* Conditionally render the main 'Clear All' button */}
      {isFilterActive && (
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md text-koli-red-dark hover:opacity-60 bg-koli-red/10 p-2" // Replaced custom Button with standard <button> and basic styling
          aria-label="Filtreleri temizle"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
