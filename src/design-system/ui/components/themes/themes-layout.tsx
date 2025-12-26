"use client"

import { useState } from "react"
import type { Tab } from "@/design-system/ui/components/tabs-deprecated/deprecated-tab-navigation"
import { ProgramBuilder } from "@/design-system/ui/components/themes/program-builder"
import { cn } from "@/core/utils/cn"

interface ThemesLayoutProps {
  tabs: Tab[]
  defaultTab?: string
  activeTab: string
  programItems: { id: string; name: string }[]
  isProgramBuilderVisible: boolean
  onRemoveItem: (id: string) => void
  onBuild: () => void
  onTabChange: (tabId: string) => void
  className?: string
}

export function ThemesLayout({
  tabs,
  defaultTab,
  activeTab,
  programItems,
  isProgramBuilderVisible,
  onRemoveItem,
  onBuild,
  onTabChange,
  className,
}: ThemesLayoutProps) {

  // Only show program builder in Available and Saved tabs
  const shouldShowProgramBuilder = activeTab !== "registered" && isProgramBuilderVisible

  return (
    <div className={cn("bg-white rounded-lg overflow-hidden", className)}>
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-8 py-4 text-base font-medium relative",
                activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        <div className={cn("py-6 px-6 transition-all duration-300", shouldShowProgramBuilder ? "w-3/4" : "w-full")}>
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </div>

        {shouldShowProgramBuilder && (
          <div className="h-[calc(100vh-16rem)] sticky top-0">
            <ProgramBuilder
              isVisible={true}
              items={programItems}
              onRemoveItem={onRemoveItem}
              onBuild={onBuild}
              className="h-full"
            />
          </div>
        )}
      </div>
    </div>
  )
} 