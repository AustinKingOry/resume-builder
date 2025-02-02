"use client"

import { useState } from "react"
import type { ResumeData } from "../types"
import { resumeTemplates, colorThemes } from "../data/templates"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import MilanTemplate from "./templates/MilanTemplate"
import StockholmTemplate from "./templates/StockholmTemplate"
import AthensTemplate from "./templates/AthensTemplate"
import BrusselsTemplate from "./templates/BrusselsTemplate"
import SingaporeTemplate from "./templates/SingaporeTemplate"
import OsloTemplate from "./templates/OsloTemplate"
import MadridTemplate from "./templates/MadridTemplate"
import SantiagoTemplate from "./templates/SantiagoTemplate"
import ParisTemplate from "./templates/ParisTemplate"
import TokyoTemplate from "./templates/TokyoTemplate"

type ResumePreviewProps = {
  data: ResumeData
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const [pdfError, setPdfError] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const template = resumeTemplates.find((t) => t.id === data.selectedTemplate) || resumeTemplates[0]
  const colorTheme = colorThemes[0] // Default to first color theme for now

  const renderTemplate = () => {
    switch (data.selectedTemplate) {
      case "milan":
        return <MilanTemplate data={data} />
      case "stockholm":
        return <StockholmTemplate data={data} />
      case "athens":
        return <AthensTemplate data={data} />
      case "brussels":
        return <BrusselsTemplate data={data} />
      case "singapore":
        return <SingaporeTemplate data={data} />
      case "oslo":
        return <OsloTemplate data={data} />
      case "madrid":
        return <MadridTemplate data={data} />
      case "santiago":
        return <SantiagoTemplate data={data} />
      case "paris":
        return <ParisTemplate data={data} />
      case "tokyo":
        return <TokyoTemplate data={data} />
      default:
        return <MilanTemplate data={data} />
    }
  }

  const exportToPDF = async () => {
    const doc = new jsPDF()
    const element = document.getElementById("resume-preview")
    if (element) {
      try {
        await doc.html(element, {
          callback: (doc) => {
            doc.save("resume.pdf")
          },
          x: 10,
          y: 10,
          width: 180,
          windowWidth: 1000,
        })
      } catch (error) {
        console.error("Error generating PDF:", error)
        setPdfError("Failed to generate PDF. Please try again.")
      }
    } else {
      setPdfError("Resume preview not found. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div id="resume-preview" className="bg-white rounded-lg shadow-lg p-8">
        {renderTemplate()}
      </div>

      <Button
        onClick={exportToPDF}
        className="w-full"
        style={{
          background: `linear-gradient(to right, ${colorTheme.primary}, ${colorTheme.secondary})`,
          color: "white",
        }}
      >
        <Download className="mr-2 h-4 w-4" />
        Export to PDF
      </Button>

      {pdfError && <p className="text-red-500 text-center mt-2">{pdfError}</p>}
    </div>
  )
}

