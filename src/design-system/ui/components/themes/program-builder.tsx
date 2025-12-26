"use client"

import { X } from "lucide-react"
import { Button } from "@/design-system/ui/base/button"
import { cn } from "@/core/utils/cn"

interface ProgramItem {
  id: string
  name: string
}

interface ProgramBuilderProps {
  isVisible: boolean
  items: ProgramItem[]
  onRemoveItem: (id: string) => void
  onBuild: () => void
  className?: string
}

export function ProgramBuilder({ isVisible, items, onRemoveItem, onBuild, className }: ProgramBuilderProps) {
  return (
    <div
      className={cn(
        "bg-white border-l border-gray-200 shadow-sm transition-all duration-300 ease-in-out",
        isVisible ? "w-80" : "w-0 opacity-0",
        className,
      )}
    >
      {isVisible && (
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Build your program</h2>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No themes selected yet.</p>
                <p className="text-sm mt-2">Add themes to build your program.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium">{item.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={items.length === 0} onClick={onBuild}>
              Build Program
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 