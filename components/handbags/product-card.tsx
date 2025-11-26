"use client";

import { ExternalLink, ShoppingBag } from "lucide-react";

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
      className="group relative bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-stone-300 transition-all duration-500 hover:shadow-xl cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const brandColors: Record<string, string> = {
              'Hermès': 'F97316',
              'Chanel': '1c1917',
              'Louis Vuitton': '92400e',
              'Gucci': '166534',
              'Prada': '1e1b4b',
              'Dior': '831843',
              'Céline': 'a16207',
              'Bottega Veneta': '365314',
              'Balenciaga': '1f2937',
              'Saint Laurent': '0f172a',
              'Fendi': 'b45309',
              'Loewe': '7c2d12',
            };
            const color = brandColors[product.brand || ''] || '78716c';
            const initials = (product.brand || 'LX').substring(0, 2).toUpperCase();
            target.src = `https://placehold.co/400x500/${color}/FFFFFF?text=${initials}&font=playfair-display`;
          }}
        />
        {product.brand && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-stone-900 text-xs font-medium tracking-wide uppercase rounded-full shadow-sm">
              {product.brand}
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
            <ExternalLink className="w-4 h-4 text-stone-700" />
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-medium text-stone-900 line-clamp-2 group-hover:text-amber-800 transition-colors duration-300 leading-snug">
            {product.title}
          </h3>
          <p className="text-xs text-stone-400 mt-1 uppercase tracking-wide">
            {product.sourceSite}
          </p>
        </div>
        
        <div className="flex items-end justify-between pt-2 border-t border-stone-100">
          <div>
            <p className="text-xl font-semibold text-stone-900">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-md"
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
    <div className="bg-white rounded-xl overflow-hidden border border-stone-200 animate-pulse">
      <div className="aspect-[4/5] bg-stone-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-stone-200 rounded w-full" />
        <div className="h-5 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-20 mt-2" />
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="h-6 bg-stone-200 rounded w-24" />
          <div className="h-10 bg-stone-200 rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}
