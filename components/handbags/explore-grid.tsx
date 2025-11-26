"use client";

import { ShoppingBag, AlertCircle, Search } from "lucide-react";
import { ProductCard, ProductCardSkeleton, HandbagResult } from "./product-card";
import { useState } from "react";

interface ExploreGridProps {
  results: HandbagResult[];
  isLoading: boolean;
  hasSearched: boolean;
  error?: string | null;
  showCompare?: boolean;
}

export function ExploreGrid({ results, isLoading, hasSearched, error, showCompare = false }: ExploreGridProps) {
  const [comparedItems, setComparedItems] = useState<Set<string>>(new Set());

  const handleCompareChange = (id: string, checked: boolean) => {
    setComparedItems(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-xl font-medium text-stone-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-stone-500 max-w-md">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
          <span className="text-stone-500">Searching luxury retailers...</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-stone-400" />
        </div>
        <h3 className="text-2xl font-serif text-stone-900 mb-3">
          Explore Luxury Handbags
        </h3>
        <p className="text-stone-500 max-w-lg mb-8">
          Search across multiple luxury retailers to discover your perfect handbag. 
          Browse collections from Hermès, Chanel, Louis Vuitton, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {["Birkin", "Classic Flap", "Neverfull", "Dionysus", "Peekaboo"].map((term) => (
            <span
              key={term}
              className="px-4 py-2 bg-stone-100 text-stone-600 rounded-full text-sm border border-stone-200 hover:border-stone-300 hover:text-stone-900 transition-all cursor-default"
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
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-stone-400" />
        </div>
        <h3 className="text-xl font-medium text-stone-900 mb-2">No handbags found</h3>
        <p className="text-stone-500 max-w-md">
          Try a different search term or adjust your filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-stone-500">
          Found <span className="text-stone-900 font-semibold">{results.length}</span> handbags
        </p>
        {comparedItems.size > 0 && (
          <button className="px-4 py-2 bg-amber-100 text-amber-800 text-sm font-medium rounded-lg hover:bg-amber-200 transition-colors">
            Compare ({comparedItems.size})
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            showCompare={showCompare}
            isCompared={comparedItems.has(product.id)}
            onCompareChange={handleCompareChange}
          />
        ))}
      </div>
    </div>
  );
}
