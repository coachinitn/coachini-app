import { SearchX } from "lucide-react"
import { Button } from "@/design-system/ui/base/button"
import { cn } from "@/core/utils/cn"

interface NoResultsProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
  className?: string
}

export function NoResults({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: NoResultsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg",
        className
      )}
    >
      <div className="bg-white p-3 rounded-full mb-4">
        {icon || <SearchX className="h-8 w-8 text-gray-400" />}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="rounded-full">
          {actionLabel}
        </Button>
      )}
    </div>
  )
} 