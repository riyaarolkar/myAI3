"use client";

import { cn } from "@/lib/utils";

interface BrandPillProps {
  brand: string;
  className?: string;
}

export function BrandPill({ brand, className }: BrandPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
        "bg-white/95 text-stone-800 shadow-sm backdrop-blur-sm",
        "border border-stone-200/50",
        className
      )}
    >
      {brand}
    </span>
  );
}
