"use client";

import { ExternalLink, Tag, Store, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface HandbagResult {
  id: string;
  title: string;
  url: string;
  retailer: string;
  price: number | null;
  priceText: string;
  currency: string;
  imageUrl: string | null;
  description: string;
  condition: string;
}

interface HandbagCardProps {
  handbag: HandbagResult;
}

export function HandbagCard({ handbag }: HandbagCardProps) {
  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'new':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'like new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pre-owned':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'vintage':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'good':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPrice = (price: number | null, currency: string) => {
    if (price === null) return 'Price on request';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(price);
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Store className="w-4 h-4" />
            <span className="font-medium">{handbag.retailer}</span>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs font-medium ${getConditionColor(handbag.condition)}`}
          >
            {handbag.condition}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {handbag.title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {handbag.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-xl font-bold text-gray-900">
              {handbag.price !== null 
                ? formatPrice(handbag.price, handbag.currency)
                : handbag.priceText}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2 hover:bg-gray-900 hover:text-white transition-colors"
            onClick={() => window.open(handbag.url, '_blank')}
          >
            View
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function HandbagCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="h-7 bg-gray-200 rounded w-24"></div>
          <div className="h-9 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}
