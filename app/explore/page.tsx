"use client";

import { Suspense, useState, useEffect } from "react";
import { ShoppingBag, Sparkles, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ExploreGrid } from "@/components/handbags/explore-grid";
import { FiltersPanel, FilterState } from "@/components/handbags/filters-panel";
import { HandbagResult } from "@/components/handbags/product-card";

interface ExploreCategory {
  id: string;
  title: string;
  description: string;
  image_url: string;
  filter_url: string;
}

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState<ExploreCategory[]>([]);
  const [results, setResults] = useState<HandbagResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    countries: [],
    bagTypes: [],
    minPrice: undefined,
    maxPrice: undefined,
    currency: "USD",
  });

  useEffect(() => {
    fetchCategories();
    
    const brandsParam = searchParams.get("brands");
    const bagTypeParam = searchParams.get("bag_type");
    const minPriceParam = searchParams.get("min_price");
    const maxPriceParam = searchParams.get("max_price");
    const countryParam = searchParams.get("country");
    
    if (brandsParam || bagTypeParam || minPriceParam || maxPriceParam || countryParam) {
      const initialFilters: FilterState = {
        brands: brandsParam ? brandsParam.split(",") : [],
        countries: countryParam ? countryParam.split(",") : [],
        bagTypes: bagTypeParam ? bagTypeParam.split(",") : [],
        minPrice: minPriceParam ? parseFloat(minPriceParam) : undefined,
        maxPrice: maxPriceParam ? parseFloat(maxPriceParam) : undefined,
        currency: "USD",
      };
      setFilters(initialFilters);
      setHasSearched(true);
      performSearchWithFilters(initialFilters);
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/explore");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const performSearchWithFilters = async (searchFilters: FilterState) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (searchFilters.brands.length > 0) params.set("brands", searchFilters.brands.join(","));
      if (searchFilters.bagTypes.length > 0) params.set("bag_type", searchFilters.bagTypes.join(","));
      if (searchFilters.countries.length > 0) params.set("country", searchFilters.countries.join(","));
      if (searchFilters.currency !== "USD") params.set("currency", searchFilters.currency);
      if (searchFilters.minPrice !== undefined) params.set("min_price", String(searchFilters.minPrice));
      if (searchFilters.maxPrice !== undefined) params.set("max_price", String(searchFilters.maxPrice));

      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to search");
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to load results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async () => {
    performSearchWithFilters(filters);
  };

  const handleCategoryClick = (category: ExploreCategory) => {
    const url = new URL(category.filter_url, window.location.origin);
    const brandsParam = url.searchParams.get("brands");
    const bagTypeParam = url.searchParams.get("bag_type");
    const minPriceParam = url.searchParams.get("min_price");
    const maxPriceParam = url.searchParams.get("max_price");

    setFilters({
      brands: brandsParam ? [brandsParam] : [],
      countries: [],
      bagTypes: bagTypeParam ? [bagTypeParam] : [],
      minPrice: minPriceParam ? parseFloat(minPriceParam) : undefined,
      maxPrice: maxPriceParam ? parseFloat(maxPriceParam) : undefined,
      currency: "USD",
    });
    setHasSearched(true);
    setTimeout(() => performSearch(), 100);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const handleClearFilters = () => {
    setFilters({
      brands: [],
      countries: [],
      bagTypes: [],
      minPrice: undefined,
      maxPrice: undefined,
      currency: "USD",
    });
  };

  return (
    <>
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-stone-900 to-stone-700 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-serif font-semibold text-stone-900 tracking-tight">Luxury Handbag Explorer</h1>
                  <p className="text-sm text-stone-500">Discover designer bags across premium retailers</p>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors">
                Search
              </Link>
              <Link href="/explore" className="text-sm font-medium text-stone-900 hover:text-amber-700 transition-colors">
                Explore
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-2 text-sm text-stone-500">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="font-medium">Powered by AI</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!hasSearched ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-4">
                Explore Collections
              </h2>
              <p className="text-stone-500 max-w-2xl mx-auto">
                Browse curated collections of luxury handbags from the world's most prestigious fashion houses.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 text-left"
                >
                  <img
                    src={category.image_url}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h4 className="text-white font-semibold text-xl mb-1">{category.title}</h4>
                    <p className="text-white/80 text-sm">{category.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => {
                  setHasSearched(false);
                  setResults([]);
                  handleClearFilters();
                }}
                className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Collections</span>
              </button>
            </div>

            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative max-w-xl">
                <div className="flex gap-3 bg-white border border-stone-200 rounded-xl p-2 shadow-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Refine your search..."
                      className="w-full h-10 pl-10 pr-4 bg-stone-50 border border-stone-100 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-10 px-4 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg transition-all text-sm"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>

            <div className="mb-8">
              <FiltersPanel
                filters={filters}
                onFilterChange={setFilters}
                onApply={performSearch}
                onClear={handleClearFilters}
              />
            </div>

            <ExploreGrid
              results={results}
              isLoading={isLoading}
              hasSearched={hasSearched}
              error={error}
              showCompare={true}
            />
          </>
        )}
      </main>

      <footer className="border-t border-stone-200 mt-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-900 to-stone-700 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif font-medium text-stone-900">Luxury Handbag Explorer</span>
                <p className="text-xs text-stone-500">Your gateway to premium fashion</p>
              </div>
            </div>
            <p className="text-sm text-stone-400">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-900 to-stone-700 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-semibold text-stone-900 tracking-tight">Luxury Handbag Explorer</h1>
                <p className="text-sm text-stone-500">Discover designer bags across premium retailers</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-4">
            Explore Collections
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto">
            Loading collections...
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/5] rounded-2xl bg-stone-200 animate-pulse" />
          ))}
        </div>
      </main>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100">
      <Suspense fallback={<LoadingFallback />}>
        <ExploreContent />
      </Suspense>
    </div>
  );
}
