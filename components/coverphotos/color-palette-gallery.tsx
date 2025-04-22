"use client"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ColorPaletteCP, UserDataCP, TemplateCP } from "@/lib/types"

interface ColorPaletteGalleryProps {
  palettes: ColorPaletteCP[]
  selectedPalette: ColorPaletteCP
  onSelect: (palette: ColorPaletteCP) => void
  defaultData: UserDataCP
  defaultTemplate: TemplateCP
}

export default function ColorPaletteGallery({
  palettes,
  selectedPalette,
  onSelect,
  // defaultData,
  // defaultTemplate,
}: ColorPaletteGalleryProps) {
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="grid grid-cols-1 gap-4">
        {palettes.map((palette) => {
          const isSelected = palette.id === selectedPalette.id

          return (
            <div
              key={palette.id}
              className={cn(
                "relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                isSelected ? "border-primary ring-2 ring-primary/20" : "border-muted hover:border-muted-foreground/50",
              )}
              onClick={() => onSelect(palette)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 z-10">
                  <Check className="h-4 w-4" />
                </div>
              )}

              <div className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-medium">{palette.name}</h3>
                </div>

                <div className="flex w-full h-12 rounded-md overflow-hidden">
                  {palette.colors.map((color, i) => (
                    <div key={i} className="flex-1 h-full" style={{ backgroundColor: color }}>
                      {i === 4 && color === "#ffffff" && <div className="w-full h-full border border-gray-200"></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

