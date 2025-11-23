"use client";

import React, { useState, useEffect } from "react";
// Re-added Next.js navigation hooks
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

// Custom hook to debounce a value (unchanged)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function FilterBar() {
  // Get router and searchParams from Next.js
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state directly from the URL's search params
  const [query, setQuery] = useState(searchParams.get("query") || "");

  // Debounce the query input
  const debouncedQuery = useDebounce(query, 500);

  // This useEffect triggers the navigation when debouncedQuery changes
  useEffect(() => {
    // Get the current query from the URL
    const currentQuery = searchParams.get("query") || "";

    // Only navigate if the debounced query is different from the current URL query
    if (debouncedQuery !== currentQuery) {
      // Create a new URLSearchParams object based on the current params
      const params = new URLSearchParams(searchParams.toString());

      if (debouncedQuery) {
        params.set("query", debouncedQuery);
      } else {
        params.delete("query");
      }

      // Use router.replace to update the URL without a full page reload
      // This will update the URL and re-render the page with new props
      router.replace(`/panel/urunler?${params.toString()}`);
    }
  }, [debouncedQuery, searchParams, router]); // Dependency array

  const handleClear = () => {
    // 1. Reset the local state so the input clears
    setQuery("");
    // 2. Navigate to the page with no search params using router.replace
    router.replace("/panel/urunler");
  };

  // Check if any filter is active (this logic remains the same)
  const isFilterActive = Boolean(query);

  return (
    <div className="flex gap-4 items-center">
      <div className="relative">
        <Input
          type="text"
          name="query"
          placeholder="Ürün ara..."
          value={query} // Controlled component
          onChange={(e) => setQuery(e.target.value)}
          className="placeholder:text-seperator py-1.5 pr-10"
        />
      </div>

      {isFilterActive && (
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md text-koli-red-dark hover:opacity-60 bg-koli-red/10 p-2"
          aria-label="Filtreyi temizle"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}


