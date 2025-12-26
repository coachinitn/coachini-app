"use client"

import React from "react"
import { cn } from "@/core/utils/cn"

interface PageHeaderProps {
  title: string
  breadcrumb?: string[] | string
  className?: string
}

export function PageHeader({ title, breadcrumb, className }: PageHeaderProps) {
  const formattedBreadcrumb = Array.isArray(breadcrumb) 
    ? breadcrumb.join(" / ") 
    : breadcrumb

  return (
    <div className={cn("mb-6", className)}>
      {formattedBreadcrumb && (
        <p className="text-sm font-medium text-primary dark:text-primary mb-1">{formattedBreadcrumb}</p>
      )}
      <h1 className="text-2xl font-semibold text-foreground dark:text-foreground">{title}</h1>
    </div>
  )
} 