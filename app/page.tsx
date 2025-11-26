"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Search, Sparkles, ShoppingBag } from "lucide-react";
import { ExploreFilters, FilterValues } from "@/components/handbags/explore-filters";
import { ExploreGrid } from "@/components/handbags/explore-grid";
import { HandbagResult } from "@/components/handbags/product-card";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HandbagResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    country: "all",
    currency: "all",
    priceRange: "all",
    brand: "all",
    bagType: "all",
  });

  const performSearch = async (searchQuery: string = "", currentFilters: FilterValues = filters) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      let priceMin: number | undefined;
      let priceMax: number | undefined;

      if (currentFilters.priceRange && currentFilters.priceRange !== "all") {
        const [min, max] = currentFilters.priceRange.split("-");
        const parsedMin = parseInt(min);
        const parsedMax = parseInt(max);
        priceMin = !isNaN(parsedMin) ? parsedMin : undefined;
        priceMax = !isNaN(parsedMax) ? parsedMax : undefined;
      }

      const response = await fetch("/api/search-handbags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery || "luxury designer",
          brand: currentFilters.brand !== "all" ? currentFilters.brand : undefined,
          bagType: currentFilters.bagType !== "all" ? currentFilters.bagType : undefined,
          country: currentFilters.country !== "all" ? currentFilters.country : undefined,
          currency: currentFilters.currency !== "all" ? currentFilters.currency : undefined,
          priceMin,
          priceMax,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to search");
      }

      const data = await response.json();
      setResults(data.results);

      if (data.results.length === 0) {
        toast.info("No handbags found. Try a different search term.");
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

  useEffect(() => {
    performSearch("luxury handbag");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleApplyFilters = () => {
    performSearch(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950">
      <Toaster 
        position="top-center" 
        richColors 
        toastOptions={{
          style: {
            background: 'rgba(17, 24, 39, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
          },
        }}
      />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
      </div>
      
      <header className="relative z-10 border-b border-white/5 backdrop-blur-xl bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Luxury Handbag Explorer</h1>
                <p className="text-sm text-gray-400">Search popular handbags across multiple stores</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl" />
            <div className="relative flex gap-3 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for 'black tote', 'crossbody', 'Gucci style', etc..."
                  className="w-full h-14 pl-12 pr-4 bg-gray-800/50 border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

        <ExploreGrid
          results={results}
          isLoading={isLoading}
          hasSearched={hasSearched}
          error={error}
        />
      </main>

      <footer className="relative z-10 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-400">
                Luxury Handbag Explorer - Discover designer bags across the web
              </span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
