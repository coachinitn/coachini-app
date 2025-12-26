"use client"

import { OptimizedAvatar } from "@/design-system/ui/components/optimized-avatar"
import { cn } from "@/core/utils/cn"

interface Member {
  id: string
  avatar: string
}

interface AvatarGroupProps {
  members: Member[]
  maxDisplay?: number
  size?: number
  className?: string
}

export function AvatarGroup({ members, maxDisplay = 5, size = 32, className }: AvatarGroupProps) {
  const displayMembers = members.slice(0, maxDisplay)
  const remaining = members.length - maxDisplay

  return (
    <div className={cn("flex -space-x-2", className)}>
      {displayMembers.map((member) => (
        <OptimizedAvatar
          key={member.id}
          src={member.avatar}
          alt="Team member"
          size={size}
          className="border-2 border-white"
        />
      ))}
      {remaining > 0 && (
        <div className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-gray-400 border-2 border-white rounded-full">
          +{remaining}
        </div>
      )}
    </div>
  )
} 