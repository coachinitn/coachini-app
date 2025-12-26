import { cn } from "@/core/utils/cn"

interface StatusBadgeProps {
  status: "online" | "offline" | "away" | "busy"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    online: {
      color: "bg-green-500",
      label: "Online",
    },
    offline: {
      color: "bg-gray-400",
      label: "Offline",
    },
    away: {
      color: "bg-yellow-500",
      label: "Away",
    },
    busy: {
      color: "bg-red-500",
      label: "Busy",
    },
  }

  const config = statusConfig[status]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("h-2 w-2 rounded-full", config.color)} />
      <span className="text-sm">{config.label}</span>
    </div>
  )
} 