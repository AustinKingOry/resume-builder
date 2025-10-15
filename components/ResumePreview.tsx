"use client"

import { useEffect, useState } from "react"
import type { Margins, ResumeData, ResumeTemplate } from "@/lib/types"
import { resumeTemplates } from "../data/templates"
// import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { Download, Loader, Loader2, Printer } from "lucide-react"
import MilanTemplate from "./templates/MilanTemplate"
// import NairobiTemplate from "./templates/NairobiTemplate"
import NairobiTemplateNew from "./templates/NairobiTemplateNew"
import StockholmTemplate from "./templates/StockholmTemplate"
// import AthensTemplate from "./templates/AthensTemplate"
import AthensTemplateNew from "./templates/AthensTemplateNew"
// import BrusselsTemplate from "./templates/BrusselsTemplate"
import BrusselsTemplateNew from "./templates/BrusselsTemplateNew"
// import SingaporeTemplate from "./templates/SingaporeTemplate"
import SingaporeTemplateNew from "./templates/SingaporeTemplateNew"
// import OsloTemplate from "./templates/OsloTemplate"
import OsloTemplateNew from "./templates/OsloTemplateNew"
// import MadridTemplate from "./templates/MadridTemplate"
import { MadridTemplateNew } from "./templates/MadridTemplateNew"
// import SantiagoTemplate from "./templates/SantiagoTemplate"
import SantiagoTemplateNew from "./templates/SantiagoTemplateNew"
import ParisTemplate from "./templates/ParisTemplate"
import TokyoTemplate from "./templates/TokyoTemplate"
import axios from "axios";
import PdfPreview from "./PdfPreview"
// import ClassicTemplate from "./templates/ClassicTemplate";
import ClassicTemplateNew from "./templates/ClassicTemplateNew";
// import MinimalistTemplate from "./templates/MinimalTemplate"
import MinimalistTemplateNew from "./templates/MinimalTemplateNew"
// import TechnicalTemplate from "./templates/TechnicalTemplate"
import TechnicalTemplateNew from "./templates/TechnicalTemplateNew"
// import ExecutiveTemplate from "./templates/ExecutiveTemplate"
import ExecutiveTemplateNew from "./templates/ExecutiveTemplateNew"
import CreativeTemplate from "./templates/CreativeTemplate"
// import CreativeTemplateNew from "./templates/CreativeTemplateNew"
import ElegantTemplate from "./templates/ElegantTemplate"
// import ElegantTemplateNew from "./templates/ElegantTemplateNew"
// import FunctionalTemplate from "./templates/FunctionalTemplate"
import FunctionalTemplateNew from "./templates/FunctionalTemplateNew"
// import SimpleTemplate from "./templates/SimpleTemplate"
import SimpleTemplateNew from "./templates/SimpleTemplateNew"
// import HighlightTemplate from "./templates/HighlightTemplate"
import HighlightTemplateNew from "./templates/HighlightTemplateNew"
// import BusinessTemplate from "./templates/BusinessTemplate"
import BusinessTemplateNew from "./templates/BusinessTemplateNew"
// import ModernTemplate from "./templates/ModernTemplate"
import ModernTemplate2 from "./templates/ModernTemplate2"
import TemplateSelector from "./TemplateSelector"
// import { PlainTemplate } from "./templates/PlainTemplate"
import PlainTemplateNew from "./templates/PlainTemplateNew"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { ControlPanel } from "./BuilderControlPanel"

type ResumePreviewProps = {
    data: ResumeData
    changeTemplate: (template: ResumeTemplate) => void
}

export default function ResumePreview({ data, changeTemplate }: ResumePreviewProps) {
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [livePreview, setLivePreview] = useState(false);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewBlob, setPreviewBlob] = useState<Blob | Uint8Array | null>(null);
    const serverless_url = process.env.PUPPETEER_SERVERLESS_URL || "https://puppeteer-builder.vercel.app";
    // const backend_url = process.env.PUPPETEER_SERVERLESS_URL || "http://localhost:5000";
    const [margins, setMargins] = useState({ top: 32, right: 32, bottom: 32, left: 32 });
    const [showFooter, setShowFooter] = useState(false);
  
    useEffect(() => {
      const fetchPreview = async () => {
        setLoadingPreview(true);
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
                    `${serverless_url}/api/builder`,
                    { html: html, name:`${data.personalInfo.name}`, type: "resume", preview: true },
                    { responseType: "blob" }
                );
        
                const blob = new Blob([response.data], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
                setPreviewBlob(blob);
            }
        } catch (error) {
          console.error("Preview error:", error);
        } finally {
            setLoadingPreview(false);
        }
      };
  
      if (livePreview && Object.keys(data).length > 0) {
        const timeout = setTimeout(fetchPreview, 500); // debounce
        return () => clearTimeout(timeout);
      }
    }, [data, livePreview, serverless_url]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const template = resumeTemplates.find((t) => t.id === data.selectedTemplate) || resumeTemplates[0]

    const renderTemplate = () => {
        switch (data.selectedTemplate) {
            case "nairobi":
                // return <NairobiTemplate data={data}  />
                return <NairobiTemplateNew data={data} margins={margins} showFooter={showFooter}  />
            case "milan":
                return <MilanTemplate data={data} />
            case "stockholm":
                return <StockholmTemplate data={data} />
            case "athens":
                // return <AthensTemplate data={data} />
                return <AthensTemplateNew data={data} margins={margins} showFooter={showFooter} />
            case "brussels":
                // return <BrusselsTemplate data={data} />
                return <BrusselsTemplateNew data={data} margins={margins} showFooter={showFooter} />
            case "singapore":
                // return <SingaporeTemplate data={data} />
                return <SingaporeTemplateNew data={data} />
            case "oslo":
                // return <OsloTemplate data={data} />
                return <OsloTemplateNew data={data} />
            case "madrid":
                // return <MadridTemplate data={data} />
                return <MadridTemplateNew data={data} margins={margins} showFooter={showFooter} />
            case "santiago":
                // return <SantiagoTemplateNew data={data} />
                return <SantiagoTemplateNew data={data} margins={margins} showFooter={showFooter} />
            case "paris":
                return <ParisTemplate data={data} />
            case "tokyo":
                return <TokyoTemplate data={data} />
            case "classic":
                // return <ClassicTemplate data={data} />
                return <ClassicTemplateNew data={data} margins={margins} showFooter={showFooter} />
            case "modern":
                return <ModernTemplate2 data={data} margins={margins} showFooter={showFooter} />
                // return <ModernTemplate data={data} margins={margins} />
            case "minimalist":
                // return <MinimalistTemplate data={data} />
                return <MinimalistTemplateNew data={data} margins={margins} showFooter={showFooter} />
            case "technical":
                // return <TechnicalTemplate data={data} />
                return <TechnicalTemplateNew data={data} margins={margins} showFooter={showFooter}  />
            case "executive":
                // return <ExecutiveTemplate data={data} />
                return <ExecutiveTemplateNew data={data} margins={margins} showFooter={showFooter} />
            case "creative":
                return <CreativeTemplate data={data} />
                // return <CreativeTemplateNew data={data} margins={margins} showFooter={showFooter} />
            case "elegant":
                return <ElegantTemplate data={data} />
                // return <ElegantTemplateNew data={data} />
            case "functional":
                // return <FunctionalTemplate data={data} />
                return <FunctionalTemplateNew data={data} margins={margins} showFooter={showFooter} />
            case "simple":
                // return <SimpleTemplate data={data} />
                return <SimpleTemplateNew data={data} margins={margins} showFooter={showFooter} />
            case "highlight":
                // return <HighlightTemplate data={data} />
                return <HighlightTemplateNew data={data} margins={margins} showFooter={showFooter} />
            case "business":
                // return <BusinessTemplate data={data} />
                return <BusinessTemplateNew data={data} margins={margins} showFooter={showFooter} />
            case "plain":
                // return <PlainTemplate data={data} />
                return <PlainTemplateNew data={data} margins={margins} showFooter={showFooter} />
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
                    body: JSON.stringify({ html, name:`${data.personalInfo.name}`, type: "resume" }),
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
        await exportToPDF(true);
    }

    const printPDF = async () => {
        try {
            const doc = document.getElementById("resume-preview");
            if(!doc){
                throw new Error(`Element with ID resume-preview not found`);
            }

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

            // Open a new popup window
            const printWindow = window.open("", "_blank", "width=800,height=600");
            printWindow!.document.write(`
                <html>
                  <head>
                    <title>Print Section</title>
                    <style>
                    ${styles}
                    </style>
                  </head>
                  <body>
                    ${doc.innerHTML}
                  </body>
                </html>
              `);

              printWindow!.document.close(); // Finish writing
              printWindow!.focus();          // Focus on the new window
              printWindow!.print();          // Trigger the print dialog
              printWindow!.close();          // Close after printing

        } catch (err) {
            console.error("Error printing section:", err);
        }
    }

    const changeMargins = ({ top, right, bottom, left }: Partial<Margins>) => {
        setMargins({ top: top || margins.top, right: right || margins.right, bottom: bottom || margins.bottom, left: left || margins.left })
    }

    const resetConfigs = () => {
        setMargins({ top: 32, right: 32, bottom: 32, left: 32 });
        setShowFooter(false);
    }

    const toggleFooter = () => {
        setShowFooter(!showFooter)
    }

  return (
    <div className="space-y-6">
        <div className=" flex flex-row gap-3 max-[425px]:flex-wrap">
            <TemplateSelector selectedTemplate={data.selectedTemplate} onTemplateSelect={changeTemplate} />
            <Button
            onClick={downloadPDF}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg"
            disabled={isGenerating}
            >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Downloading...</> : "Download PDF"}
            </Button>
            <Button
            onClick={printPDF}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg"
            disabled={isGenerating}
            >
            <Printer className="w-4 h-4 mr-2" />
            Print
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
        <div className="w-full grid grid-cols-4 gap-2">
            <ControlPanel 
                Margins={margins}
                showFooter={showFooter}
                onToggleFooter={toggleFooter}
                onReset={resetConfigs}
                onDownloadPDF={downloadPDF}
                onMarginsChange={changeMargins}
                isDownloading={isGenerating} 
            />
            <div className="col-span-3 border">                
                <div className={`bg-green-50 text-black rounded-lg shadow-lg max-w-6xl mx-auto ${(livePreview && previewUrl) && "hidden"} dark:bg-gray-800 relative p-2`}>
                    {loadingPreview && <div className="absolute top-0 bottom-0 left-0 right-0 bg-gray-800/50 flex justify-between items-center z-10">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </div>}
                    <div id="resume-preview" className="w-fit mx-auto">
                        {renderTemplate()}
                    </div>
                </div>
                {(livePreview && previewUrl) && 
                <div className="bg-white text-black rounded-lg shadow-lg overflow-hidden dark:bg-gray-800">
                {/* {previewUrl && <iframe src={previewUrl} className="w-full h-full" /> } */}
                <PdfPreview pdfUrl={previewUrl} pdfBlob={previewBlob} />
                </div>}
            </div>
        </div>

        {pdfError && <p className="text-red-500 text-center mt-2">{pdfError}</p>}
    </div>
  )
}

