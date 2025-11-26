"use client";

import { useState } from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const LUXURY_BRANDS = [
  { value: "", label: "All Brands" },
  { value: "Hermès", label: "Hermès" },
  { value: "Chanel", label: "Chanel" },
  { value: "Louis Vuitton", label: "Louis Vuitton" },
  { value: "Gucci", label: "Gucci" },
  { value: "Prada", label: "Prada" },
  { value: "Dior", label: "Dior" },
  { value: "Celine", label: "Celine" },
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

const PRICE_RANGES = [
  { value: "", label: "Any Price" },
  { value: "0-500", label: "Under $500" },
  { value: "500-1000", label: "$500 - $1,000" },
  { value: "1000-2500", label: "$1,000 - $2,500" },
  { value: "2500-5000", label: "$2,500 - $5,000" },
  { value: "5000-10000", label: "$5,000 - $10,000" },
  { value: "10000-", label: "Over $10,000" },
];

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "relevance", label: "Most Relevant" },
];

interface SearchFiltersProps {
  onSearch: (params: {
    query: string;
    brand: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy: string;
  }) => void;
  isLoading: boolean;
}

export function SearchFilters({ onSearch, isLoading }: SearchFiltersProps) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("price-asc");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    if (priceRange && priceRange !== "any") {
      const [min, max] = priceRange.split("-");
      const parsedMin = parseInt(min);
      const parsedMax = parseInt(max);
      minPrice = !isNaN(parsedMin) ? parsedMin : undefined;
      maxPrice = !isNaN(parsedMax) ? parsedMax : undefined;
    }

    const effectiveBrand = brand === "all" ? "" : brand;

    onSearch({
      query,
      brand: effectiveBrand,
      minPrice,
      maxPrice,
      sortBy,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setQuery("");
    setBrand("");
    setPriceRange("");
    setSortBy("price-asc");
  };

  const hasActiveFilters = brand || priceRange;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for handbags... (e.g., Birkin 25, Classic Flap, Neverfull)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="h-12 px-8 bg-gray-900 hover:bg-gray-800"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </div>

        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                    {[brand, priceRange].filter(Boolean).length}
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-1 text-gray-500 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
                Clear filters
              </Button>
            )}
          </div>

          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    {LUXURY_BRANDS.map((b) => (
                      <SelectItem key={b.value} value={b.value || "all"}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_RANGES.map((p) => (
                      <SelectItem key={p.value} value={p.value || "any"}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
