"use client"

import React from "react"
import { cn } from "@/core/utils/cn"
import { ArrowRight } from "lucide-react"

interface ProgramTag {
  text: string
  color?: string
}

interface CoachingProgramCardProps {
  title: string
  subtitle?: string
  imageSrc?: string
  description?: string
  tags?: ProgramTag[]
  ctaIcon?: React.ReactNode
  ctaLabel?: string
  onAction?: () => void
  className?: string
  footerContent?: React.ReactNode
  highlighted?: boolean
  showGradientOverlay?: boolean
}

export function CoachingProgramCard({
  title = "Suggested coaching program",
  subtitle,
  imageSrc,
  description,
  tags = [],
  ctaIcon = <ArrowRight className="w-5 h-5" />,
  ctaLabel,
  onAction,
  className,
  footerContent,
  highlighted = false,
  showGradientOverlay = true
}: CoachingProgramCardProps) {
  return (
    <div 
      className={cn(
        "h-full overflow-hidden bg-card dark:bg-card rounded-lg shadow-sm border border-border dark:border-border transition-all duration-200",
        highlighted && "ring-2 ring-yellow-500 dark:ring-yellow-600 ring-offset-2 dark:ring-offset-background",
        className
      )}
    >
      <div className="px-6 pt-6 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-foreground dark:text-foreground">{title}</h3>
            {subtitle && !description && <p className="text-sm text-muted-foreground dark:text-muted-foreground">{subtitle}</p>}
          </div>
          {ctaIcon && (
            <button 
              className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80 transition-colors" 
              onClick={onAction}
              aria-label={ctaLabel || "View program details"}
            >
              {ctaIcon}
            </button>
          )}
        </div>
        
        {description && (
          <p className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground">{description}</p>
        )}
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className={cn(
                  "px-2 py-1 text-xs rounded-full", 
                  tag.color || "bg-muted dark:bg-muted/70 text-muted-foreground dark:text-muted-foreground"
                )}
              >
                {tag.text}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-0 mt-4">
        <div className="relative w-full h-48">
          <div className="w-full h-full bg-muted dark:bg-muted/50">
            {imageSrc && (
              <img 
                src={imageSrc} 
                alt={title} 
                className="object-cover w-full h-full"
              />
            )}
          </div>
          {showGradientOverlay && (
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-xl font-bold text-white">{subtitle || title}</h3>
            </div>
          )}
        </div>
        
        {footerContent && (
          <div className="p-4 border-t border-border dark:border-border">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  )
} 