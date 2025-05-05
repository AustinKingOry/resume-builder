"use client"

import React, { useEffect, useState } from "react";
// import PDFViewer from "@/components/pdf-viewer/PDFViewer";
import PDFControls from "@/components/pdf-viewer/PDFControls";
import PDFHeader from "@/components/pdf-viewer/PDFHeader";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("@/components/pdf-viewer/PDFViewer"), {
  ssr: false,
});

type PdfPreviewProps = {
	pdfUrl: string | null
	pdfBlob: Blob | Uint8Array | null
}

const PdfPreview = ({ pdfUrl = null, pdfBlob = null }: PdfPreviewProps) => {
	const [pdfFile, setPdfFile] = useState<string | null>(pdfUrl);
	const [fileName, setFileName] = useState<string>("");
	const [numPages, setNumPages] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [scale, setScale] = useState<number>(1.0);
	const { toast } = useToast();

	useEffect(()=>{
		let fileURL: string | null = null;
		const handleFileChange = () => {
			if (pdfBlob) {
				if (pdfBlob instanceof Blob && pdfBlob.type === "application/pdf") {
					fileURL = URL.createObjectURL(pdfBlob);
					const fileName = pdfBlob instanceof File ? pdfBlob.name : "Preview.pdf";
					setPdfFile(fileURL);
					setFileName(fileName);
					setCurrentPage(1);
					toast({
						title: "PDF Loaded",
						description: `Successfully loaded: ${fileName}`,
					});
				}
				else if (pdfBlob instanceof Uint8Array) {
					// Convert Uint8Array to Blob to preview
					const blob = new Blob([pdfBlob], { type: "application/pdf" });
					fileURL = URL.createObjectURL(blob);
					setPdfFile(fileURL);
					setFileName("Preview.pdf");
					setCurrentPage(1);
					toast({
					  title: "PDF Loaded",
					  description: `Successfully loaded from buffer.`,
					});
				  }
			} else if (pdfBlob) {
				toast({
					variant: "destructive",
					title: "Invalid File",
					description: "Failed to load PDF file.",
				});
			}
		};
		handleFileChange();
		return () => {
			if (fileURL) {
				URL.revokeObjectURL(fileURL);
			}
		};
	},[pdfBlob, pdfUrl, toast])

	

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
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-0">

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
			</div>
		</div>
	);
};

export default PdfPreview;