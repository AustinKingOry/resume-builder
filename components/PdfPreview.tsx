"use client"

import React, { useEffect, useState } from "react";
import PDFViewer from "@/components/pdf-viewer/PDFViewer";
import PDFControls from "@/components/pdf-viewer/PDFControls";
import PDFHeader from "@/components/pdf-viewer/PDFHeader";
import { useToast } from "@/hooks/use-toast";

// Sample PDF - can be replaced with your own
const samplePDF = "https://arxiv.org/pdf/2104.13478.pdf";

type PdfPreviewProps = {
  pdfUrl: string | null
}

const PdfPreview = ({ pdfUrl = null }: PdfPreviewProps) => {
  const [pdfFile, setPdfFile] = useState<string | null>(pdfUrl);
  const [fileName, setFileName] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const { toast } = useToast();

  useEffect(()=>{
    setPdfFile(pdfUrl)
  },[pdfUrl])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        setPdfFile(fileURL);
        setFileName(file.name);
        setCurrentPage(1);
        toast({
          title: "PDF Loaded",
          description: `Successfully loaded: ${file.name}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File",
          description: "Please select a valid PDF file.",
        });
      }
    }
  };

  const loadSamplePDF = () => {
    setPdfFile(samplePDF);
    setFileName("Sample PDF Document");
    setCurrentPage(1);
    toast({
      title: "Sample PDF Loaded",
      description: "Successfully loaded the sample PDF.",
    });
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1.0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            Pretty PDF Viewer
          </h1>
          <p className="text-gray-600 mb-6">
            A beautiful and simple PDF viewing experience
          </p>
          
          <div className="flex justify-center mb-6">
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-flex items-center"
            >
              <span>Choose PDF File</span>
              <input
                type="file"
                id="pdf-upload"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <button
              onClick={loadSamplePDF}
              className="ml-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-6 rounded-lg border border-gray-300 transition-colors duration-200"
            >
              Load Sample PDF
            </button>
          </div>
        </div>

        <div className="pdf-container bg-white rounded-lg shadow-lg overflow-hidden">
          <PDFHeader fileName={fileName} />
          
          <PDFViewer
            file={pdfFile}
            scale={scale}
            currentPage={currentPage}
            setNumPages={setNumPages}
            onPageChange={setCurrentPage}
          />
          
          <PDFControls
            currentPage={currentPage}
            numPages={numPages > 0 ? numPages : 1}
            scale={scale}
            onPageChange={setCurrentPage}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onZoomReset={handleZoomReset}
          />
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>
            Upload a PDF file to view or use the sample PDF provided.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;