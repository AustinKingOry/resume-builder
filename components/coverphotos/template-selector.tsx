"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { TemplateCP } from "@/lib/types"

interface TemplateSelectorProps {
  templates: TemplateCP[]
  selectedTemplate: TemplateCP
  onSelect: (template: TemplateCP) => void
}

export default function TemplateSelector({ templates, selectedTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <RadioGroup
      value={selectedTemplate.id}
      onValueChange={(value) => {
        const template = templates.find((t) => t.id === value)
        if (template) onSelect(template)
      }}
      className="grid grid-cols-2 gap-2"
    >
      {templates.map((template) => (
        <div key={template.id} className="relative">
          <RadioGroupItem value={template.id} id={`template-${template.id}`} className="peer sr-only" />
          <Label
            htmlFor={`template-${template.id}`}
            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <div className="w-full h-12 rounded overflow-hidden border border-muted">
              <div
                className="w-full h-full"
                style={{
                  background: template.previewBg || "#0f172a",
                }}
              ></div>
            </div>
            <span className="mt-1 text-xs font-medium">{template.name}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

