"use client"

import React from "react"
import { cn } from "@/core/utils/cn"

interface ProgressTimelineItemProps {
  title: string
  date: string
  markerColor?: string
  className?: string
}

export function ProgressTimelineItem({ 
  title, 
  date, 
  markerColor = "bg-yellow-500 dark:bg-yellow-600", 
  className 
}: ProgressTimelineItemProps) {
  return (
    <div className={cn("relative  pb-5 mt-1 pl-8", className)}>
      <div className={cn("absolute left-0 top-0 h-6 w-6 rounded-sm", markerColor)}></div>
      <h4 className="font-medium text-foreground dark:text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground dark:text-muted-foreground">{date}</p>
    </div>
  )
} 