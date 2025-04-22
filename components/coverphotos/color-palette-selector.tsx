"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { ColorPaletteCP } from "@/lib/types"

interface ColorPaletteSelectorProps {
  palettes: ColorPaletteCP[]
  selectedPalette: ColorPaletteCP
  onSelect: (palette: ColorPaletteCP) => void
}

export default function ColorPaletteSelector({ palettes, selectedPalette, onSelect }: ColorPaletteSelectorProps) {
  return (
    <RadioGroup
      value={selectedPalette.id}
      onValueChange={(value) => {
        const palette = palettes.find((p) => p.id === value)
        if (palette) onSelect(palette)
      }}
      className="grid grid-cols-3 gap-2"
    >
      {palettes.map((palette) => (
        <div key={palette.id} className="relative">
          <RadioGroupItem value={palette.id} id={`palette-${palette.id}`} className="peer sr-only" />
          <Label
            htmlFor={`palette-${palette.id}`}
            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="flex w-full h-6 rounded overflow-hidden">
              {palette.colors.map((color, i) => (
                <div key={i} className="flex-1 h-full" style={{ backgroundColor: color }}></div>
              ))}
            </div>
            <span className="mt-1 text-xs font-medium">{palette.name}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

