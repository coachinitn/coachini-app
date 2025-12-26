"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/core/utils/cn"

interface ExpandableRowProps {
  children: React.ReactNode
  expandedContent: React.ReactNode
  isInitiallyExpanded?: boolean
  onToggle?: (isExpanded: boolean) => void
  className?: string
}

export function ExpandableRow({
  children,
  expandedContent,
  isInitiallyExpanded = false,
  onToggle,
  className,
}: ExpandableRowProps) {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded)

  const toggleExpand = () => {
    const newExpandedState = !isExpanded
    setIsExpanded(newExpandedState)
    if (onToggle) {
      onToggle(newExpandedState)
    }
  }

  return (
    <>
      <tr
        className={cn("cursor-pointer transition-colors hover:bg-gray-50/50", isExpanded && "bg-gray-50/80", className)}
        onClick={toggleExpand}
      >
        <td className="w-8 p-0">
          <div className="flex items-center justify-center h-full p-4">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </td>
        {children}
      </tr>
      {isExpanded && (
        <tr className="border-b border-gray-100">
          <td colSpan={100} className="p-0 bg-gray-50/50">
            <div className="p-4 duration-200 animate-in slide-in-from-top-2">{expandedContent}</div>
          </td>
        </tr>
      )}
    </>
  )
} 