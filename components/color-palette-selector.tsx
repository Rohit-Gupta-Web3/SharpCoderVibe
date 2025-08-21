"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Palette } from "lucide-react"

const colorPalettes = [
  {
    name: "Ocean Blue",
    colors: ["#0ea5e9", "#0284c7", "#0369a1", "#1e40af", "#1e3a8a"],
    code: "#0ea5e9, #0284c7, #0369a1, #1e40af, #1e3a8a",
  },
  {
    name: "Forest Green",
    colors: ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"],
    code: "#10b981, #059669, #047857, #065f46, #064e3b",
  },
  {
    name: "Sunset Orange",
    colors: ["#f97316", "#ea580c", "#dc2626", "#b91c1c", "#991b1b"],
    code: "#f97316, #ea580c, #dc2626, #b91c1c, #991b1b",
  },
  {
    name: "Purple Dream",
    colors: ["#a855f7", "#9333ea", "#7c3aed", "#6d28d9", "#5b21b6"],
    code: "#a855f7, #9333ea, #7c3aed, #6d28d9, #5b21b6",
  },
  {
    name: "Rose Gold",
    colors: ["#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337"],
    code: "#f43f5e, #e11d48, #be123c, #9f1239, #881337",
  },
]

interface ColorPaletteSelectorProps {
  onSelect: (palette: string) => void
}

export function ColorPaletteSelector({ onSelect }: ColorPaletteSelectorProps) {
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null)

  const handleSelect = (palette: (typeof colorPalettes)[0]) => {
    setSelectedPalette(palette.name)
    onSelect(`website follows these color codes: ${palette.code}`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Palette className="w-4 h-4" />
          <span>Select Colors</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Choose Color Palette</h3>
          {colorPalettes.map((palette) => (
            <div
              key={palette.name}
              className="cursor-pointer p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleSelect(palette)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{palette.name}</span>
                {selectedPalette === palette.name && <div className="w-2 h-2 bg-green-500 rounded-full" />}
              </div>
              <div className="flex space-x-1">
                {palette.colors.map((color, index) => (
                  <div key={index} className="w-8 h-8 rounded" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
