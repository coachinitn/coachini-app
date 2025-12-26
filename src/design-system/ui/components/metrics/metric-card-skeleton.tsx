import React from "react";
import { cn } from "@/core/utils/cn";

/**
 * MetricCardSkeleton component provides a loading placeholder with shimmer effect
 * for MetricCard components while data is being fetched
 */
export function MetricCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-card dark:bg-card rounded-lg overflow-hidden shadow-sm border border-border dark:border-border relative",
      "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
      className
    )}>
      <div className="p-4 flex items-center">
        {/* Icon skeleton */}
        <div className="w-12 h-12 rounded-full bg-muted dark:bg-muted mr-4"></div>
        
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="h-4 w-24 bg-muted dark:bg-muted rounded mb-2"></div>
          
          {/* Value skeleton */}
          <div className="h-7 w-16 bg-muted dark:bg-muted rounded mb-2"></div>
          
          {/* Secondary value skeleton */}
          <div className="h-4 w-32 bg-muted dark:bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );
}
