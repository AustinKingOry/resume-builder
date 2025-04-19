"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import type { ResumeTemplate } from "../../lib/types"
import { resumeTemplates } from "../data/templates";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

type TemplateSelectorProps = {
  selectedTemplate: string
  onTemplateSelect: (template: ResumeTemplate) => void
}

export default function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button>Choose Template</Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-7xl grid grid-rows-10">
            <SheetHeader className="row-span-1">
                <SheetTitle>Select A Template <span className="bg-background text-xs font-mono font-medium border px-2 py-0.5 rounded-xl">Experimental</span></SheetTitle>
                <SheetDescription>
                    Choose A Template To Use For Your Resume.
                </SheetDescription>
            </SheetHeader>
            <div className="row-span-9">
                <ScrollArea className="w-full h-full min-h-96 pr-3">
                    <TemplatesList selectedTemplate={selectedTemplate} onTemplateSelect={onTemplateSelect} />
                </ScrollArea>
            </div>
        </SheetContent>
    </Sheet>
  )
}

export const TemplatesList = ({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
      {resumeTemplates.map((template) => (
        <Card
          key={template.id}
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedTemplate === template.id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onTemplateSelect(template)}
        >
          <CardContent className="p-4">
            <div className="aspect-[3/4] mb-4 relative bg-muted rounded-lg overflow-hidden">
              <Image src={template.thumbnail || "/placeholder.svg"} alt={template.name} fill className="object-cover" />
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
            <h3 className="font-semibold mb-1">{template.name}</h3>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
    )
}