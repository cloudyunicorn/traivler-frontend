"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { HiOutlineMapPin, HiOutlineGlobeAlt } from "react-icons/hi2";
import { cn } from "@/lib/utils";

interface Airport {
  name: string;
  code: string;
  type: "airport" | "city" | "country";
  city_name: string;
  country_name: string;
  city_code: string;
  country_code: string;
}

interface AirportAutocompleteProps {
  label: string;
  placeholder: string;
  value: string; // This will store the IATA code
  onChange: (iata: string, name: string) => void;
  className?: string;
  id: string;
}

export function AirportAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  className,
  id,
}: AirportAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedSearch = useDebounce(inputValue, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const justSelected = useRef(false);

  useEffect(() => {
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }

    if (!debouncedSearch || debouncedSearch.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const fetchAirports = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://traivler-backend.cloudyunicorn.com";
        const response = await fetch(
          `${API_BASE}/airports/search?q=${encodeURIComponent(debouncedSearch)}`,
          { signal: controller.signal }
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setIsOpen(true);
        }
      } catch (error: unknown) {
        // Silently ignore aborted requests (component unmount / fast re-typing)
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Failed to fetch airports", error);
      }
    };

    fetchAirports();

    return () => controller.abort();
  }, [debouncedSearch]);

  // Close dropdown on click/touch outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    // pointerdown works on both mouse and touch devices
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  const handleSelect = (airport: Airport) => {
    justSelected.current = true;
    if (airport.type === "country") {
      // For countries, show country name and store country code
      setInputValue(`${airport.name}`);
      onChange(airport.code, airport.name);
    } else {
      // Show City, Country in the input
      const displayName = airport.city_name
        ? `${airport.city_name}, ${airport.country_name}`
        : airport.name;
      setInputValue(`${displayName} (${airport.code})`);
      onChange(airport.code, airport.name);
    }
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown") setIsOpen(true);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case "ArrowUp":
        setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className={cn("relative w-full space-y-2", className)} ref={containerRef}>
      <label htmlFor={id} className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (e.target.value === "") {
              onChange("", "");
            }
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="bg-card border-card-border text-foreground placeholder:text-muted-foreground focus-visible:ring-accent focus-visible:border-accent h-12 rounded-xl px-4 w-full"
        />
        {/* Floating IATA display if value is set */}
        {value && !isOpen && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-accent text-xs font-bold pointer-events-none">
            {value}
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 overflow-hidden rounded-xl border border-card-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <ul className="max-h-[300px] overflow-y-auto py-2 touch-manipulation">
            {suggestions.map((airport, index) => (
              <li
                key={`${airport.code}-${index}`}
                onPointerDown={(e) => {
                  e.preventDefault(); // Prevent focus loss from input
                  handleSelect(airport);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "px-4 py-3 cursor-pointer flex items-center justify-between transition-colors select-none",
                  highlightedIndex === index ? "bg-accent/10 text-accent" : "text-foreground hover:bg-accent/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    airport.type === "country" ? "bg-emerald-500/10" : "bg-accent/5"
                  )}>
                    {airport.type === "country" ? (
                      <HiOutlineGlobeAlt className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <HiOutlineMapPin className="w-4 h-4 text-accent" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    {airport.type === "country" ? (
                      <>
                        <span className="text-sm font-semibold">{airport.name}</span>
                        <span className="text-xs text-emerald-400/80">Country · Route agent will pick best airport</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-semibold">
                          {airport.city_name ? `${airport.city_name}, ${airport.country_name}` : airport.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {airport.name} {airport.city_name ? `(${airport.code})` : ""}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {airport.type === "country" ? (
                  <span className="text-[10px] font-medium tracking-wider text-emerald-400/60 uppercase">Country</span>
                ) : !airport.city_name ? (
                  <span className="text-xs font-bold tracking-wider text-accent opacity-80">{airport.code}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
