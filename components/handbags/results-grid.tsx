"use client";

import { ShoppingBag, TrendingUp, AlertCircle } from "lucide-react";
import { HandbagCard, HandbagCardSkeleton, HandbagResult } from "./handbag-card";

interface ResultsGridProps {
  results: HandbagResult[];
  isLoading: boolean;
  hasSearched: boolean;
  error?: string | null;
}

export function ResultsGrid({ results, isLoading, hasSearched, error }: ResultsGridProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Error</h3>
        <p className="text-gray-500 max-w-md">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <HandbagCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Find Your Perfect Luxury Handbag
        </h3>
        <p className="text-gray-500 max-w-md mb-6">
          Search across multiple retailers to compare prices on designer handbags from 
          Hermès, Chanel, Louis Vuitton, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Hermès Birkin", "Chanel Classic Flap", "Louis Vuitton Neverfull", "Gucci Dionysus"].map((suggestion) => (
            <span
              key={suggestion}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm"
            >
              {suggestion}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
        <p className="text-gray-500 max-w-md">
          Try adjusting your search terms or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  const pricesWithValues = results.filter((r) => r.price !== null);
  const lowestPrice = pricesWithValues.length > 0 
    ? Math.min(...pricesWithValues.map((r) => r.price!))
    : null;
  const highestPrice = pricesWithValues.length > 0
    ? Math.max(...pricesWithValues.map((r) => r.price!))
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            <span className="font-semibold text-gray-900">{results.length}</span> results found
          </span>
          {lowestPrice !== null && highestPrice !== null && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>
                ${lowestPrice.toLocaleString()} - ${highestPrice.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((handbag) => (
          <HandbagCard key={handbag.id} handbag={handbag} />
        ))}
      </div>
    </div>
  );
}
