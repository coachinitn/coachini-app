import React from 'react'
import * as LucideIcons from 'lucide-react'

/**
 * Props for the DynamicIcon component
 */
interface DynamicIconProps {
  name: string
  className?: string
  [key: string]: any // Additional props passed to the icon
}

/**
 * Renders a Lucide icon dynamically by name
 *
 * @example
 * <DynamicIcon name="Users" className="w-6 h-6 text-blue-500" />
 */
export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<any>

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in Lucide icons`)
    return null
  }

  return <LucideIcon {...props} />
}

/**
 * Creates a custom rating star icon display for metric cards
 *
 * @param rating - The rating value (e.g. 4.2)
 * @param max - The maximum rating (default: 5)
 * @returns React component with star rating display
 */
export function RatingStars({ rating, max = 5 }: { rating: number, max?: number }) {
  // Calculate full and partial stars
  const fullStars = Math.floor(rating)
  const partialStar = rating % 1 > 0
  const emptyStars = max - fullStars - (partialStar ? 1 : 0)

  return (
    <div className="flex">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <LucideIcons.Star
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-500 fill-yellow-500"
        />
      ))}

      {/* Partial star if needed */}
      {partialStar && (
        <LucideIcons.Star
          key="partial"
          className="w-4 h-4 text-yellow-500 fill-yellow-500"
        />
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <LucideIcons.Star
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300"
        />
      ))}
    </div>
  )
}
