"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const isInitialMount = useRef(true);

  // Initialize from current search params
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams]);

  // Update URL client-side when debounced query changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (debouncedQuery) params.set("query", debouncedQuery);

    const url = params.toString()
      ? `/panel/musteriler?${params.toString()}`
      : "/panel/musteriler";

    // client-side navigation without full page reload
    router.replace(url);
  }, [debouncedQuery, router]);

  const handleClear = () => {
    setQuery("");
    router.replace("/panel/musteriler");
  };

  const isFilterActive = Boolean(query);

  return (
    <div className="flex gap-4 items-center">
      <div className="relative">
        <Input
          type="text"
          name="query"
          placeholder="Müşteri veya adres ara..."
          value={query}
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
