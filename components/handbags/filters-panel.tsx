"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterState {
  brands: string[];
  countries: string[];
  bagTypes: string[];
  minPrice?: number;
  maxPrice?: number;
  currency: string;
}

interface FiltersPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
  className?: string;
}

const BRANDS = [
  "Hermès", "Chanel", "Louis Vuitton", "Gucci", "Prada",
  "Dior", "Céline", "Bottega Veneta", "Balenciaga", "Saint Laurent",
  "Fendi", "Loewe", "Chloé", "Givenchy", "Valentino", "Burberry", "Goyard"
];

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "DE", name: "Germany" },
  { code: "JP", name: "Japan" },
  { code: "AE", name: "UAE" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "CA", name: "Canada" },
  { code: "ES", name: "Spain" },
];

const BAG_TYPES = [
  "Tote", "Shoulder", "Crossbody", "Clutch", "Top-handle",
  "Satchel", "Hobo", "Backpack", "Bucket", "Flap", "Belt Bag", "Mini Bag"
];

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
];

const PRICE_RANGES = [
  { min: 0, max: 1000, label: "Under $1,000" },
  { min: 1000, max: 3000, label: "$1,000 - $3,000" },
  { min: 3000, max: 5000, label: "$3,000 - $5,000" },
  { min: 5000, max: 10000, label: "$5,000 - $10,000" },
  { min: 10000, max: 25000, label: "$10,000 - $25,000" },
  { min: 25000, max: undefined, label: "Over $25,000" },
];

export function FiltersPanel({ 
  filters, 
  onFilterChange, 
  onApply, 
  onClear,
  className 
}: FiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const toggleCountry = (code: string) => {
    const newCountries = filters.countries.includes(code)
      ? filters.countries.filter(c => c !== code)
      : [...filters.countries, code];
    onFilterChange({ ...filters, countries: newCountries });
  };

  const toggleBagType = (type: string) => {
    const newTypes = filters.bagTypes.includes(type)
      ? filters.bagTypes.filter(t => t !== type)
      : [...filters.bagTypes, type];
    onFilterChange({ ...filters, bagTypes: newTypes });
  };

  const setPriceRange = (min?: number, max?: number) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const setCurrency = (currency: string) => {
    onFilterChange({ ...filters, currency });
  };

  const activeFilterCount = 
    filters.brands.length + 
    filters.countries.length + 
    filters.bagTypes.length + 
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    (filters.currency !== 'USD' ? 1 : 0);

  return (
    <div className={cn("bg-white border border-stone-200 rounded-2xl shadow-sm", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-stone-600" />
          <span className="font-medium text-stone-900">Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-stone-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-stone-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-6 border-t border-stone-100 pt-4">
          <div>
            <h4 className="text-sm font-semibold text-stone-700 mb-3">Brands</h4>
            <div className="flex flex-wrap gap-2">
              {BRANDS.map((brand) => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full border transition-all",
                    filters.brands.includes(brand)
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                  )}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-700 mb-3">Country</h4>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((country) => (
                <button
                  key={country.code}
                  onClick={() => toggleCountry(country.code)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full border transition-all",
                    filters.countries.includes(country.code)
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                  )}
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-stone-700 mb-3">Bag Type</h4>
            <div className="flex flex-wrap gap-2">
              {BAG_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleBagType(type)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full border transition-all",
                    filters.bagTypes.includes(type)
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-stone-700 mb-3">Price Range</h4>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((range, index) => {
                  const isSelected = filters.minPrice === range.min && filters.maxPrice === range.max;
                  return (
                    <button
                      key={index}
                      onClick={() => setPriceRange(range.min, range.max)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-full border transition-all",
                        isSelected
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                      )}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-stone-700 mb-3">Currency</h4>
              <div className="flex flex-wrap gap-2">
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => setCurrency(curr.code)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-full border transition-all",
                      filters.currency === curr.code
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                    )}
                  >
                    {curr.symbol} {curr.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              onClick={onClear}
              className="text-sm text-stone-500 hover:text-stone-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
            <button
              onClick={onApply}
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-xl transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
