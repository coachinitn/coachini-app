
"use client"

import { Toaster } from "@/design-system/ui/base/toaster"
import { Toaster as Sonner } from "@/design-system/ui/base/sonner"

interface ToastProviderProps {
  children: React.ReactNode
  useSonner?: boolean
}

export function ToastProvider({ children, useSonner = true }: ToastProviderProps) {
  return (
    <>
      {children}
      {useSonner ? <Sonner /> : <Toaster />}
    </>
  )
}
