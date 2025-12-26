import { Star } from "lucide-react"
import { cn } from "@/core/utils/cn"

interface StarRatingProps {
  rating: number
  maxRating?: number
  className?: string
  size?: "sm" | "md" | "lg"
}

export function StarRating({ rating, maxRating = 5, className, size = "md" }: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1)

  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <div className={cn("flex items-center", className)}>
      {stars.map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass[size],
            star <= Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300",
            "mr-0.5"
          )}
        />
      ))}
    </div>
  )
} 