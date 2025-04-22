"use client"

import { forwardRef } from "react"
import type { UserDataCP, TemplateCP, ColorPaletteCP, PlatformCP } from "@/lib/types"
import Template2 from "@/components/coverphotos/templates/template-2"
import Template3 from "@/components/coverphotos/templates/template-3"
import Template1 from "@/components/coverphotos/templates/template-1"
import Template4 from "@/components/coverphotos/templates/template-4"
import Template5 from "@/components/coverphotos/templates/template-5"
import Template6 from "@/components/coverphotos/templates/template-6"
import Template7 from "@/components/coverphotos/templates/template-7"
import Template8 from "@/components/coverphotos/templates/template-8"
import Template9 from "@/components/coverphotos/templates/template-9"
import Template10 from "@/components/coverphotos/templates/template-10"

interface CoverPreviewProps {
  userData: UserDataCP
  template: TemplateCP
  palette: ColorPaletteCP
  platform: PlatformCP
}

const CoverPreview = forwardRef<HTMLDivElement, CoverPreviewProps>(({ userData, template, palette, platform }, ref) => {
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

  const TemplateComponent = templateComponents[template.id as keyof typeof templateComponents]
  const aspectRatio = `${platform.width}/${platform.height}`

  return (
    <div className="w-full" style={{ aspectRatio: aspectRatio }}>
      <div id="cover-preview" ref={ref} className="w-full h-full">
        <TemplateComponent userData={userData} palette={palette} />
      </div>
    </div>
  )
})

CoverPreview.displayName = "CoverPreview"

export default CoverPreview

