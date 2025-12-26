"use client"

import type React from "react"
import Image from "next/image"
import { cn } from "@/core/utils/cn"

interface OptimizedAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
  alt: string
  fallback?: string
  size?: number
}

export function OptimizedAvatar({ src, alt, fallback = "U", size = 40, className, ...props }: OptimizedAvatarProps) {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props}>
      {src ? (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={size}
          height={size}
          className="w-full h-full aspect-square"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-muted">{fallback}</div>
      )}
    </div>
  )
} 