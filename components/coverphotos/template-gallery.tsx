"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { TemplateCP, UserDataCP, ColorPaletteCP } from "@/lib/types"
import Template1 from "@/components/coverphotos/templates/template-1"
import Template2 from "@/components/coverphotos/templates/template-2"
import Template3 from "@/components/coverphotos/templates/template-3"
import Template4 from "@/components/coverphotos/templates/template-4"
import Template5 from "@/components/coverphotos/templates/template-5"
import Template6 from "@/components/coverphotos/templates/template-6"
import Template7 from "@/components/coverphotos/templates/template-7"
import Template8 from "@/components/coverphotos/templates/template-8"
import Template9 from "@/components/coverphotos/templates/template-9"
import Template10 from "@/components/coverphotos/templates/template-10"

interface TemplateGalleryProps {
  templates: TemplateCP[]
  selectedTemplate: TemplateCP
  onSelect: (template: TemplateCP) => void
  defaultData: UserDataCP
  defaultPalette: ColorPaletteCP
}

export default function TemplateGallery({
  templates,
  selectedTemplate,
  onSelect,
  defaultData,
  defaultPalette,
}: TemplateGalleryProps) {
  // Map template ID to component
  const templateComponents = {
    "template-1": Template1,
    "template-2": Template2,
    "template-3": Template3,
    "template-4": Template4,
    "template-5": Template5,
    "template-6": Template6,
    "template-7": Template7,
    "template-8": Template8,
    "template-9": Template9,
    "template-10": Template10,
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => {
          const TemplateComponent = templateComponents[template.id as keyof typeof templateComponents]
          const isSelected = template.id === selectedTemplate.id

          return (
            <div
              key={template.id}
              className={cn(
                "relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                isSelected ? "border-primary ring-2 ring-primary/20" : "border-muted hover:border-muted-foreground/50",
              )}
              onClick={() => onSelect(template)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 z-10">
                  <Check className="h-4 w-4" />
                </div>
              )}

              <div className="w-full" style={{ height: "100px" }}>
                <div className="transform scale-[0.25] origin-top-left" style={{ width: "400%", height: "400%" }}>
                  <TemplateComponent userData={defaultData} palette={defaultPalette} />
                </div>
              </div>

              <div className="p-2 bg-card border-t">
                <h3 className="text-sm font-medium">{template.name}</h3>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

