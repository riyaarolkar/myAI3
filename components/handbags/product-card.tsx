"use client";

import { ExternalLink, ShoppingBag } from "lucide-react";
import Image from "next/image";

export interface HandbagResult {
  id: string;
  title: string;
  description: string;
  price: number | null;
  priceText: string;
  currency: string;
  imageUrl: string;
  productUrl: string;
  sourceSite: string;
  brand: string | null;
}

interface ProductCardProps {
  product: HandbagResult;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number | null, currency: string) => {
    if (price === null) return 'Price on request';
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
    };
    const symbol = symbols[currency] || '$';
    return `${symbol}${price.toLocaleString()}`;
  };

  const handleClick = () => {
    window.open(product.productUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="group relative bg-gradient-to-b from-gray-800/80 to-gray-900/90 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.brand && (
          <div className="absolute top-3 left-3 z-20">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20">
              {product.brand}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-2 bg-white/10 backdrop-blur-md rounded-full">
            <ExternalLink className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-400 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-xl font-bold text-white">
              {formatPrice(product.price, product.currency)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {product.sourceSite}
            </p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
          >
            <ShoppingBag className="w-4 h-4" />
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/90 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 animate-pulse">
      <div className="aspect-square bg-gray-700/50" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-700/50 rounded w-full" />
        <div className="h-5 bg-gray-700/50 rounded w-3/4" />
        <div className="h-4 bg-gray-700/50 rounded w-full" />
        <div className="h-4 bg-gray-700/50 rounded w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="h-6 bg-gray-700/50 rounded w-20" />
            <div className="h-3 bg-gray-700/50 rounded w-16 mt-2" />
          </div>
          <div className="h-10 bg-gray-700/50 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}
