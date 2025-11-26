"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";
import { ShoppingBag, Sparkles } from "lucide-react";
import { SearchFilters } from "@/components/handbags/search-filters";
import { ResultsGrid } from "@/components/handbags/results-grid";
import { HandbagResult } from "@/components/handbags/handbag-card";
import Link from "next/link";

export default function Home() {
  const [results, setResults] = useState<HandbagResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: {
    query: string;
    brand: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy: string;
  }) => {
    if (!params.query && !params.brand) {
      toast.error("Please enter a search term or select a brand");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch("/api/search-handbags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: params.query,
          brand: params.brand,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to search");
      }

      const data = await response.json();
      let sortedResults = [...data.results];

      if (params.sortBy === "price-desc") {
        sortedResults.sort((a, b) => {
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return b.price - a.price;
        });
      } else if (params.sortBy === "price-asc") {
        sortedResults.sort((a, b) => {
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return a.price - b.price;
        });
      }

      setResults(sortedResults);

      if (sortedResults.length === 0) {
        toast.info("No results found. Try different search terms.");
      } else {
        toast.success(`Found ${sortedResults.length} results`);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors />
      
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">LuxeBag Finder</h1>
                <p className="text-xs text-gray-500">Compare luxury handbag prices</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Find the Best Deals on Luxury Handbags
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Compare prices across multiple retailers for designer handbags from 
              Hermès, Chanel, Louis Vuitton, Gucci, and more. Find new and pre-owned options.
            </p>
          </div>

          <SearchFilters onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <ResultsGrid
          results={results}
          isLoading={isLoading}
          hasSearched={hasSearched}
          error={error}
        />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-600">
                LuxeBag Finder - Your luxury handbag price comparison tool
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/terms" className="hover:text-gray-900 transition-colors">
                Terms of Use
              </Link>
              <span>© {new Date().getFullYear()} All rights reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
