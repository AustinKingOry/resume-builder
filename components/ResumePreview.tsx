"use client"

import { useState } from "react"
import type { ResumeData } from "@/lib/types"
import { resumeTemplates, colorThemes } from "../data/templates"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import MilanTemplate from "./templates/MilanTemplate"
import NairobiTemplate from "./templates/NairobiTemplate"
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
    const [isGenerating, setIsGenerating] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const template = resumeTemplates.find((t) => t.id === data.selectedTemplate) || resumeTemplates[0]
    const colorTheme = colorThemes[1] // Default to first color theme for now

    const renderTemplate = () => {
        switch (data.selectedTemplate) {
            case "nairobi":
                return <NairobiTemplate data={data}  />
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
        const element = document.getElementById("resume-preview")

        if (element) {
            setIsGenerating(true)
            setPdfError(null)

            // Get the styles
            const styles = Array.from(document.styleSheets)
                .map((sheet) => {
                try {
                    return Array.from(sheet.cssRules)
                    .map((rule) => rule.cssText)
                    .join("")
                } catch (e) {
                    console.log("Error accessing stylesheet rules",e)
                    return ""
                }
                })
                .join("\n")

            // Combine styles with HTML
            const html = `
                <style>${styles}</style>
                ${element.outerHTML}
            `

            try {
                const response = await fetch("/api/convert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ html, name:`${data.personalInfo.name}` }),
                })

                if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)

                const a = document.createElement("a")
                a.href = url
                a.download = `${data.personalInfo.name} Resume.pdf`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                } else {
                const errorData = await response.json()
                console.error("Failed to generate PDF:", errorData)
                setPdfError(`Failed to generate PDF: ${errorData.error}`)
                }
            } catch (error) {
                console.error("Error:", error)
                setPdfError("Failed to generate PDF. Please try again.")
            } finally {
                setIsGenerating(false)
            }
        } else {
            console.error("Resume preview not found.")
            setPdfError("Resume preview not found. Please try again.")
        }
    }

    // jspdf alternative
    const exportToPDFProd = async () => {
        const doc = new jsPDF()
        const element = document.getElementById("resume-preview")
        if (element) {
            setIsGenerating(true);
            try {
                await doc.html(element, {
                callback: (doc) => {
                    doc.save(`${data.personalInfo.name} Resume.pdf`)
                },
                x: 10,
                y: 10,
                width: 180,
                windowWidth: 1000,
                })
            } catch (error) {
                console.error("Error generating PDF:", error)
                setPdfError("Failed to generate PDF. Please try again.")
            } finally {
                setIsGenerating(false)
            }
        } else {
        setPdfError("Resume preview not found. Please try again.")
        }
    }

    const downloadPDF = async () => {
        const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
        if(isProd){
            await exportToPDFProd();
            console.log("Using jsPDF")
            return;
        }
        await exportToPDF();
    }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div id="resume-preview" className="bg-white">        
            {renderTemplate()}
        </div>
      </div>

      <Button
        onClick={downloadPDF}
        className="w-full"
        style={{
          background: `linear-gradient(to right, ${colorTheme.primary}, ${colorTheme.secondary})`,
          color: "white",
        }}
        disabled={isGenerating}
      >
        <Download className="mr-2 h-4 w-4" />
        {isGenerating ? "Generating PDF..." : "Export to PDF"}
      </Button>

      {pdfError && <p className="text-red-500 text-center mt-2">{pdfError}</p>}
    </div>
  )
}

