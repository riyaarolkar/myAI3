"use client";

import { ExternalLink, ShoppingBag, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface HandbagResult {
  id: string;
  title: string;
  brand: string;
  bag_type?: string;
  retailer?: string;
  retailer_country?: string;
  price: { amount: number | null; currency: string };
  price_display: string;
  image_url: string;
  product_url: string;
  scraped_at?: string;
  attributes?: { color?: string; size?: string; material?: string };
  description?: string;
  priceText?: string;
  currency?: string;
  imageUrl?: string;
  productUrl?: string;
  sourceSite?: string;
}

interface ProductCardProps {
  product: HandbagResult;
  showCompare?: boolean;
  onCompareChange?: (id: string, checked: boolean) => void;
  isCompared?: boolean;
}

export function ProductCard({ 
  product, 
  showCompare = false,
  onCompareChange,
  isCompared = false 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = product.image_url || product.imageUrl || '';
  const productUrl = product.product_url || product.productUrl || '';
  const retailer = product.retailer || product.sourceSite || 'Online Store';
  const priceDisplay = product.price_display || product.priceText || formatPriceLocal(product.price?.amount, product.price?.currency || product.currency || 'USD');

  function formatPriceLocal(price: number | null | undefined, currency: string) {
    if (price === null || price === undefined) return 'Price on request';
    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CHF: 'CHF ', INR: '₹' };
    const symbol = symbols[currency] || '$';
    return `${symbol}${price.toLocaleString()}`;
  }

  const handleClick = () => {
    window.open(productUrl, '_blank', 'noopener,noreferrer');
  };

  const altText = `${product.brand} ${product.title} — ${product.attributes?.color || 'luxury handbag'}`;

  return (
    <article 
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden border border-stone-200",
        "hover:border-stone-300 transition-all duration-500 hover:shadow-xl cursor-pointer",
        "transform hover:scale-[1.02] hover:-translate-y-1"
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          src={imageUrl}
          alt={altText}
          loading="lazy"
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            isHovered && "scale-105"
          )}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop`;
          }}
        />
        
        {product.brand && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-stone-900 text-xs font-semibold tracking-wider uppercase rounded-full shadow-sm border border-stone-200/50">
              {product.brand}
            </span>
          </div>
        )}

        {showCompare && (
          <div className="absolute top-4 right-4 z-20">
            <label 
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={isCompared}
                onChange={(e) => onCompareChange?.(product.id, e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-medium text-stone-600 bg-white/90 px-2 py-1 rounded-full">
                Compare
              </span>
            </label>
          </div>
        )}

        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-shadow">
            <ExternalLink className="w-4 h-4 text-stone-700" />
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={cn(
            "absolute bottom-4 right-4 z-20 p-2.5 rounded-full bg-white/90 shadow-sm",
            "opacity-0 group-hover:opacity-100 transition-all duration-200",
            "hover:bg-white hover:shadow-md hover:scale-110"
          )}
          aria-label="Add to favorites"
        >
          <Heart className="w-4 h-4 text-stone-600 hover:text-red-500 transition-colors" />
        </button>
      </div>
      
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-medium text-stone-900 line-clamp-2 group-hover:text-amber-800 transition-colors duration-300 leading-snug">
            {product.title}
          </h3>
          <p className="text-xs text-stone-400 mt-1 uppercase tracking-wide flex items-center gap-1">
            {retailer}
            {product.retailer_country && (
              <>
                <span className="text-stone-300">•</span>
                <span>{product.retailer_country}</span>
              </>
            )}
          </p>
        </div>
        
        <div className="flex items-end justify-between pt-2 border-t border-stone-100">
          <div>
            <p className="text-xl font-semibold text-stone-900">
              {priceDisplay}
            </p>
            {product.attributes?.size && (
              <p className="text-xs text-stone-400 mt-0.5">{product.attributes.size}</p>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-xl transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
          >
            <ShoppingBag className="w-4 h-4" />
            View
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 animate-pulse">
      <div className="aspect-square bg-stone-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-stone-200 rounded w-full" />
        <div className="h-5 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-20 mt-2" />
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="h-6 bg-stone-200 rounded w-24" />
          <div className="h-10 bg-stone-200 rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
}
