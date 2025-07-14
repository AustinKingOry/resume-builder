"use client"

import { useEffect, useState } from "react"
import type { ResumeData, ResumeTemplate } from "@/lib/types"
import { resumeTemplates, colorThemes } from "../data/templates"
// import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { Download, Loader } from "lucide-react"
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
import axios from "axios";
import PdfPreview from "./PdfPreview"
import ClassicTemplate from "./templates/ClassicTemplate"
import MinimalistTemplate from "./templates/MinimalTemplate"
import TechnicalTemplate from "./templates/TechnicalTemplate"
import ExecutiveTemplate from "./templates/ExecutiveTemplate"
import CreativeTemplate from "./templates/CreativeTemplate"
import ElegantTemplate from "./templates/ElegantTemplate"
import FunctionalTemplate from "./templates/FunctionalTemplate"
import SimpleTemplate from "./templates/SimpleTemplate"
import HighlightTemplate from "./templates/HighlightTemplate"
import BusinessTemplate from "./templates/BusinessTemplate"
import ModernTemplate from "./templates/ModernTemplate"
import TemplateSelector from "./TemplateSelector"
import { PlainTemplate } from "./templates/PlainTemplate"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"

type ResumePreviewProps = {
    data: ResumeData
    changeTemplate: (template: ResumeTemplate) => void
}

export default function ResumePreview({ data, changeTemplate }: ResumePreviewProps) {
    const [pdfError, setPdfError] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [livePreview, setLivePreview] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewBlob, setPreviewBlob] = useState<Blob | Uint8Array | null>(null);
    const serverless_url = process.env.PUPPETEER_SERVERLESS_URL || "https://puppeteer-serverless-production-7d82.up.railway.app";
    // const backend_url = process.env.PUPPETEER_SERVERLESS_URL || "http://localhost:5000";
  
    useEffect(() => {
      const fetchPreview = async () => {
        try {
            const element = document.getElementById("resume-preview");
            if(element){

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
                
                const response = await axios.post(
                    `${serverless_url}/api/builder/preview`,
                    { html: html, name:`${data.personalInfo.name}`, type: "resume" },
                    { responseType: "blob" }
                );
        
                const blob = new Blob([response.data], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
                setPreviewBlob(blob);
            }
        } catch (error) {
          console.error("Preview error:", error);
        }
      };
  
      if (livePreview && Object.keys(data).length > 0) {
        const timeout = setTimeout(fetchPreview, 500); // debounce
        return () => clearTimeout(timeout);
      }
    }, [data, livePreview, serverless_url]);

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
            case "classic":
                return <ClassicTemplate data={data} />
            case "modern":
                return <ModernTemplate data={data} />
            case "minimalist":
                return <MinimalistTemplate data={data} />
            case "technical":
                return <TechnicalTemplate data={data} />
            case "executive":
                return <ExecutiveTemplate data={data} />
            case "creative":
                return <CreativeTemplate data={data} />
            case "elegant":
                return <ElegantTemplate data={data} />
            case "functional":
                return <FunctionalTemplate data={data} />
            case "simple":
                return <SimpleTemplate data={data} />
            case "highlight":
                return <HighlightTemplate data={data} />
            case "business":
                return <BusinessTemplate data={data} />
            case "plain":
                return <PlainTemplate data={data} />
            default:
                return <MilanTemplate data={data} />
        }
    }
    const exportToPDF = async (serverless=false) => {
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
                let response;
                if(!serverless){
                    response = await fetch("/api/convert", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ html, name:`${data.personalInfo.name}` }),
                    })
                } else {                    
                    response = await fetch(`${serverless_url}/api/builder`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ html, name:`${data.personalInfo.name}`, type: "resume" }),
                    })
                }

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
    // const exportToPDFProd = async () => {
    //     const doc = new jsPDF()
    //     const element = document.getElementById("resume-preview")
    //     if (element) {
    //         setIsGenerating(true);
    //         try {
    //             await doc.html(element, {
    //             callback: (doc) => {
    //                 doc.save(`${data.personalInfo.name} Resume.pdf`)
    //             },
    //             x: 10,
    //             y: 10,
    //             width: 180,
    //             windowWidth: 1000,
    //             })
    //         } catch (error) {
    //             console.error("Error generating PDF:", error)
    //             setPdfError("Failed to generate PDF. Please try again.")
    //         } finally {
    //             setIsGenerating(false)
    //         }
    //     } else {
    //     setPdfError("Resume preview not found. Please try again.")
    //     }
    // }

    const downloadPDF = async () => {
        const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
        if(isProd){
            await exportToPDF(true);
            console.log("Using jsPDF")
            return;
        }
        await exportToPDF();
    }

  return (
    <div className="space-y-6">
        <div className=" flex flex-row gap-3">
            <TemplateSelector selectedTemplate={data.selectedTemplate} onTemplateSelect={changeTemplate} />
            <Button
            onClick={downloadPDF}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg"
            disabled={isGenerating}
            >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Downloading...</> : "Download PDF"}
            </Button>
            <div className="ml-auto flex flex-row gap-2 h-7">
                <Badge variant={"outline"} className="text-xs">{data.selectedTemplate}</Badge>
                <Separator orientation="vertical" className="h-full" />
                <div className="flex items-center space-x-2">
                    <Switch id="stream-preview"
                        checked={livePreview}
                        onCheckedChange={setLivePreview}
                    />
                    <Label htmlFor="stream-preview">Live PDF Preview</Label>
                </div>
            </div>
        </div>
      <div className={`bg-white text-black rounded-lg shadow-lg scale-95 max-w-4xl mx-auto ${(livePreview && previewUrl) && "hidden"}`}>
        <div id="resume-preview" className="bg-white">
            {renderTemplate()}
        </div>
      </div>
      {(livePreview && previewUrl) && 
      <div className="bg-white text-black rounded-lg shadow-lg overflow-hidden">
      {/* {previewUrl && <iframe src={previewUrl} className="w-full h-full" /> } */}
      <PdfPreview pdfUrl={previewUrl} pdfBlob={previewBlob} />
      </div>}

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

