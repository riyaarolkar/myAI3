"use client";

import { ShoppingBag, AlertCircle, Search } from "lucide-react";
import { ProductCard, ProductCardSkeleton, HandbagResult } from "./product-card";

interface ExploreGridProps {
  results: HandbagResult[];
  isLoading: boolean;
  hasSearched: boolean;
  error?: string | null;
}

export function ExploreGrid({ results, isLoading, hasSearched, error }: ExploreGridProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-400 max-w-md">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400">Searching for luxury handbags...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          Explore Luxury Handbags
        </h3>
        <p className="text-gray-400 max-w-lg mb-8">
          Search across multiple luxury retailers to discover your perfect handbag. 
          Browse collections from Hermès, Chanel, Louis Vuitton, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {["Birkin", "Classic Flap", "Neverfull", "Dionysus", "Peekaboo"].map((term) => (
            <span
              key={term}
              className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-full text-sm border border-white/10 hover:border-purple-500/50 hover:text-purple-300 transition-all cursor-default"
            >
              {term}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No handbags found</h3>
        <p className="text-gray-400 max-w-md">
          Try a different search term or adjust your filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400">
          Found <span className="text-white font-semibold">{results.length}</span> handbags
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
