
"use client"

import { TooltipProvider as RadixTooltipProvider } from "@/design-system/ui/base/tooltip"

interface TooltipProviderProps {
  children: React.ReactNode
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
}

export function TooltipProvider({ 
  children, 
  delayDuration = 700,
  skipDelayDuration = 300,
  disableHoverableContent = false
}: TooltipProviderProps) {
  return (
    <RadixTooltipProvider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      {children}
    </RadixTooltipProvider>
  )
}
