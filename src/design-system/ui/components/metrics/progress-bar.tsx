import React from "react"
import { cn } from "@/core/utils/cn"

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  showPercentage?: boolean
  size?: "sm" | "md" | "lg"
  label?: string
}

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  showPercentage = false,
  size = "md",
  label,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const getBarHeight = (size: string) => {
    switch (size) {
      case "sm":
        return "h-1.5"
      case "lg":
        return "h-4"
      default:
        return "h-2.5"
    }
  }

  const barHeight = getBarHeight(size)

  return (
    <div className={cn("w-full relative", className)}>
      {showPercentage && (
        <div className="absolute left-0 text-sm font-medium -top-5 text-foreground dark:text-foreground">
          {label || `${percentage}%`}
        </div>
      )}
      <div className={cn("relative w-full bg-muted dark:bg-muted rounded-full overflow-hidden", barHeight)}>
        <div
          className={cn(
            "absolute left-0 top-0 h-full rounded-full transition-all duration-300",
            barClassName || "bg-primary dark:bg-primary",
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
} 