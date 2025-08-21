"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Palette } from "lucide-react"

export const colorPalettes = [
  {
    name: "Ocean Breeze",
    colors: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
    code: "#264653, #2A9D8F, #E9C46A, #F4A261, #E76F51",
  },
  {
    name: "Sunset Pop",
    colors: ["#FFBE0B", "#FB5607", "#FF006E", "#8338EC", "#3A86FF"],
    code: "#FFBE0B, #FB5607, #FF006E, #8338EC, #3A86FF",
  },
  {
    name: "Pastel Dream",
    colors: ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF"],
    code: "#FFADAD, #FFD6A5, #FDFFB6, #CAFFBF, #9BF6FF",
  },
  {
    name: "Fresh Mint",
    colors: ["#06D6A0", "#1B9AAA", "#EF476F", "#FFC43D", "#393E41"],
    code: "#06D6A0, #1B9AAA, #EF476F, #FFC43D, #393E41",
  },
  {
    name: "Lavender Bliss",
    colors: ["#BDE0FE", "#A2D2FF", "#FFAFCC", "#FFC8DD", "#CDB4DB"],
    code: "#BDE0FE, #A2D2FF, #FFAFCC, #FFC8DD, #CDB4DB",
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
      <PopoverContent className="w-80 max-h-60 overflow-y-auto">
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
