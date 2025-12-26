"use client"

import React, { ReactNode } from "react"
import { cn } from "@/core/utils/cn"
import { TitleLarge } from "@/design-system/ui/base"

interface AttendanceStatProps {
  icon: ReactNode
  label: string
  value: string
  percentage: number
  barColor: string
  className?: string
}

export function AttendanceStat({ 
  icon, 
  label, 
  value, 
  percentage, 
  barColor, 
  className 
}: AttendanceStatProps) {
  return (
		<div className={cn(className)}>
			<div className="flex items-center gap-2 mb-1">
				<div
					className={`flex items-center justify-center ${barColor} rounded-md p-1.5`}
				>
					{icon}
				</div>
				<span className="text-gray-400 text-md dark:text-gray-400">
					{label}
				</span>
			</div>

			<div className="flex flex-col">
				<TitleLarge as="span" className="mb-2 text-lg font-bold text-foreground dark:text-foreground">
					{value}
				</TitleLarge>
				<div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
					<div
						className={`h-full ${barColor} rounded-full`}
						style={{ width: `${percentage}%` }}
					></div>
				</div>
			</div>
		</div>
	);
} 