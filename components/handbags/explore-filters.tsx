"use client";

import { useState } from "react";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const COUNTRIES = [
  { value: "all", label: "All Countries" },
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "fr", label: "France" },
  { value: "it", label: "Italy" },
  { value: "jp", label: "Japan" },
  { value: "ae", label: "UAE" },
  { value: "sg", label: "Singapore" },
  { value: "hk", label: "Hong Kong" },
];

const CURRENCIES = [
  { value: "all", label: "All Currencies" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "JPY", label: "JPY (¥)" },
];

const PRICE_RANGES = [
  { value: "all", label: "Any Price" },
  { value: "0-500", label: "Under $500" },
  { value: "500-1000", label: "$500 - $1,000" },
  { value: "1000-2500", label: "$1,000 - $2,500" },
  { value: "2500-5000", label: "$2,500 - $5,000" },
  { value: "5000-10000", label: "$5,000 - $10,000" },
  { value: "10000-25000", label: "$10,000 - $25,000" },
  { value: "25000-", label: "Over $25,000" },
];

const BRANDS = [
  { value: "all", label: "All Brands" },
  { value: "Hermès", label: "Hermès" },
  { value: "Chanel", label: "Chanel" },
  { value: "Louis Vuitton", label: "Louis Vuitton" },
  { value: "Gucci", label: "Gucci" },
  { value: "Prada", label: "Prada" },
  { value: "Dior", label: "Dior" },
  { value: "Celine", label: "Céline" },
  { value: "Bottega Veneta", label: "Bottega Veneta" },
  { value: "Balenciaga", label: "Balenciaga" },
  { value: "Saint Laurent", label: "Saint Laurent" },
  { value: "Fendi", label: "Fendi" },
  { value: "Loewe", label: "Loewe" },
  { value: "Chloé", label: "Chloé" },
  { value: "Givenchy", label: "Givenchy" },
  { value: "Valentino", label: "Valentino" },
  { value: "Burberry", label: "Burberry" },
  { value: "Goyard", label: "Goyard" },
];

const BAG_TYPES = [
  { value: "all", label: "All Types" },
  { value: "tote", label: "Tote Bag" },
  { value: "crossbody", label: "Crossbody" },
  { value: "shoulder", label: "Shoulder Bag" },
  { value: "clutch", label: "Clutch" },
  { value: "satchel", label: "Satchel" },
  { value: "hobo", label: "Hobo Bag" },
  { value: "bucket", label: "Bucket Bag" },
  { value: "mini", label: "Mini Bag" },
  { value: "backpack", label: "Backpack" },
  { value: "belt bag", label: "Belt Bag" },
];

export interface FilterValues {
  country: string;
  currency: string;
  priceRange: string;
  brand: string;
  bagType: string;
}

interface ExploreFiltersProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  onApplyFilters: () => void;
}

export function ExploreFilters({ filters, onFilterChange, onApplyFilters }: ExploreFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof FilterValues, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      country: "all",
      currency: "all",
      priceRange: "all",
      brand: "all",
      bagType: "all",
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== "all");

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm max-w-3xl mx-auto">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-stone-900"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-stone-500" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-stone-100 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-stone-500 font-medium">Country</label>
              <Select value={filters.country} onValueChange={(v) => handleChange("country", v)}>
                <SelectTrigger className="bg-stone-50 border-stone-200 text-stone-900 hover:bg-stone-100 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-stone-200">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="text-stone-900 hover:bg-stone-50 focus:bg-stone-50">
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-stone-500 font-medium">Currency</label>
              <Select value={filters.currency} onValueChange={(v) => handleChange("currency", v)}>
                <SelectTrigger className="bg-stone-50 border-stone-200 text-stone-900 hover:bg-stone-100 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-stone-200">
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="text-stone-900 hover:bg-stone-50 focus:bg-stone-50">
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-stone-500 font-medium">Price Range</label>
              <Select value={filters.priceRange} onValueChange={(v) => handleChange("priceRange", v)}>
                <SelectTrigger className="bg-stone-50 border-stone-200 text-stone-900 hover:bg-stone-100 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-stone-200">
                  {PRICE_RANGES.map((p) => (
                    <SelectItem key={p.value} value={p.value} className="text-stone-900 hover:bg-stone-50 focus:bg-stone-50">
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-stone-500 font-medium">Brand</label>
              <Select value={filters.brand} onValueChange={(v) => handleChange("brand", v)}>
                <SelectTrigger className="bg-stone-50 border-stone-200 text-stone-900 hover:bg-stone-100 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-stone-200">
                  {BRANDS.map((b) => (
                    <SelectItem key={b.value} value={b.value} className="text-stone-900 hover:bg-stone-50 focus:bg-stone-50">
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-stone-500 font-medium">Bag Type</label>
              <Select value={filters.bagType} onValueChange={(v) => handleChange("bagType", v)}>
                <SelectTrigger className="bg-stone-50 border-stone-200 text-stone-900 hover:bg-stone-100 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-stone-200">
                  {BAG_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="text-stone-900 hover:bg-stone-50 focus:bg-stone-50">
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-stone-500 hover:text-stone-900 hover:bg-stone-100 gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            )}
            <Button
              onClick={onApplyFilters}
              size="sm"
              className="bg-stone-900 hover:bg-stone-800 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
