"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Layout } from "lucide-react"

const layouts = [
  {
    name: "Single Page",
    description: "One page layout with sections",
    visual: (
      <div className="w-full h-16 border rounded bg-gray-50 dark:bg-gray-800 flex flex-col">
        <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded-t"></div>
        <div className="flex-1 p-1 space-y-1">
          <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        </div>
      </div>
    ),
  },
  {
    name: "Multi Page",
    description: "Multiple pages with navigation",
    visual: (
      <div className="w-full h-16 border rounded bg-gray-50 dark:bg-gray-800 flex">
        <div className="w-4 bg-purple-200 dark:bg-purple-800 rounded-l"></div>
        <div className="flex-1 p-1 space-y-1">
          <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
        </div>
      </div>
    ),
  },
  {
    name: "Dashboard",
    description: "Grid-based dashboard layout",
    visual: (
      <div className="w-full h-16 border rounded bg-gray-50 dark:bg-gray-800 p-1">
        <div className="grid grid-cols-2 gap-1 h-full">
          <div className="bg-green-200 dark:bg-green-800 rounded"></div>
          <div className="bg-yellow-200 dark:bg-yellow-800 rounded"></div>
          <div className="bg-red-200 dark:bg-red-800 rounded"></div>
          <div className="bg-blue-200 dark:bg-blue-800 rounded"></div>
        </div>
      </div>
    ),
  },
  {
    name: "Landing Page",
    description: "Marketing focused layout",
    visual: (
      <div className="w-full h-16 border rounded bg-gray-50 dark:bg-gray-800 flex flex-col">
        <div className="h-2 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-t"></div>
        <div className="flex-1 p-1 space-y-1">
          <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded mx-auto w-1/2"></div>
          <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded mx-auto w-1/3"></div>
        </div>
      </div>
    ),
  },
]

interface LayoutSelectorProps {
  onSelect: (layout: string) => void
}

export function LayoutSelector({ onSelect }: LayoutSelectorProps) {
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null)

  const handleSelect = (layout: (typeof layouts)[0]) => {
    setSelectedLayout(layout.name)
    onSelect(`site will have ${layout.name.toLowerCase()} layout`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Layout className="w-4 h-4" />
          <span>Select Layout</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Choose Layout</h3>
          <div className="grid grid-cols-2 gap-3">
            {layouts.map((layout) => (
              <div
                key={layout.name}
                className="cursor-pointer p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleSelect(layout)}
              >
                <div className="mb-2">{layout.visual}</div>
                <div className="text-sm font-medium">{layout.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{layout.description}</div>
                {selectedLayout === layout.name && <div className="mt-2 w-2 h-2 bg-green-500 rounded-full mx-auto" />}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
