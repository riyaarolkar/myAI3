"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Search, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { ExploreFilters, FilterValues } from "@/components/handbags/explore-filters";
import { ExploreGrid } from "@/components/handbags/explore-grid";
import { HandbagResult } from "@/components/handbags/product-card";
import { parseConversationalQuery } from "@/lib/parse-query";
import Link from "next/link";

interface ExploreCategory {
  id: string;
  title: string;
  description: string;
  image_url: string;
  filter_url: string;
}

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HandbagResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ExploreCategory[]>([]);
  const [filters, setFilters] = useState<FilterValues>({
    country: "all",
    currency: "all",
    priceRange: "all",
    brand: "all",
    bagType: "all",
  });

  useEffect(() => {
    fetchCategories();
    performSearch("luxury designer handbag");
  }, []);

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

  const performSearch = async (searchQuery: string = "", currentFilters: FilterValues = filters) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (currentFilters.brand !== "all") params.set("brands", currentFilters.brand);
      if (currentFilters.bagType !== "all") params.set("bag_type", currentFilters.bagType);
      if (currentFilters.country !== "all") params.set("country", currentFilters.country);
      if (currentFilters.currency !== "all") params.set("currency", currentFilters.currency);
      
      if (currentFilters.priceRange && currentFilters.priceRange !== "all") {
        const [min, max] = currentFilters.priceRange.split("-");
        if (min) params.set("min_price", min);
        if (max) params.set("max_price", max);
      }

      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to search");
      }

      const data = await response.json();
      setResults(data.results);

      if (data.results.length === 0) {
        toast.info("No handbags found. Try widening your filters.");
      }
    } catch (err) {
      console.error("Search error:", err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred while searching";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      performSearch("luxury designer handbag");
      return;
    }

    const parsed = parseConversationalQuery(query);
    
    const updatedFilters: FilterValues = { ...filters };
    
    if (parsed.brand) {
      updatedFilters.brand = parsed.brand;
    }
    if (parsed.bagType) {
      updatedFilters.bagType = parsed.bagType;
    }
    if (parsed.maxPrice) {
      if (parsed.maxPrice <= 1000) {
        updatedFilters.priceRange = "0-1000";
      } else if (parsed.maxPrice <= 2500) {
        updatedFilters.priceRange = "1000-2500";
      } else if (parsed.maxPrice <= 5000) {
        updatedFilters.priceRange = "2500-5000";
      } else if (parsed.maxPrice <= 10000) {
        updatedFilters.priceRange = "5000-10000";
      } else {
        updatedFilters.priceRange = "10000-";
      }
    }
    
    setFilters(updatedFilters);
    
    let enhancedQuery = parsed.searchText;
    if (parsed.color) {
      enhancedQuery = `${parsed.color} ${enhancedQuery}`;
    }
    
    performSearch(enhancedQuery, updatedFilters);
  };

  const handleApplyFilters = () => {
    performSearch(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100">
      <Toaster 
        position="top-center" 
        richColors 
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e7e5e4',
            color: '#1c1917',
          },
        }}
      />
      
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
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-stone-900 hover:text-amber-700 transition-colors">
                Search
              </Link>
              <Link href="/explore" className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors">
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
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-serif font-light text-stone-900 mb-4">
            Find Your Perfect Bag
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg">
            Discover designer handbags across premium retailers worldwide. Compare prices, find rare pieces, and shop with confidence.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-3xl mx-auto">
            <div className="flex gap-3 bg-white border border-stone-200 rounded-2xl p-2 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask me anything… e.g. 'I want a bag for a cocktail dinner under $5000'"
                  className="w-full h-14 pl-12 pr-4 bg-stone-50 border border-stone-100 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="h-14 px-8 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span className="hidden sm:inline">Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mb-8">
          <ExploreFilters
            filters={filters}
            onFilterChange={setFilters}
            onApplyFilters={handleApplyFilters}
          />
        </div>

        {categories.length > 0 && !hasSearched && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif text-stone-900">Explore Categories</h3>
              <Link 
                href="/explore" 
                className="text-sm font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={category.filter_url}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100"
                >
                  <img
                    src={category.image_url}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-white font-semibold text-lg">{category.title}</h4>
                    <p className="text-white/80 text-sm">{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <ExploreGrid
          results={results}
          isLoading={isLoading}
          hasSearched={hasSearched}
          error={error}
          showCompare={true}
        />
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
    </div>
  );
}
