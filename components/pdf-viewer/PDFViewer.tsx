import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Important: Set the pdf.js worker source
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface PDFViewerProps {
  file: string | null;
  scale: number;
  currentPage: number;
  setNumPages: (pages: number) => void;
  onPageChange: (page: number) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  scale,
  currentPage,
  setNumPages,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPageChange,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
  };

  if (!file) {
    return (
      <div className="pdf-viewer flex items-center justify-center min-h-[70vh] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-lg text-gray-500">No PDF document loaded</p>
          <p className="text-sm text-gray-400 mt-2">
            Please load a PDF document to view
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-viewer overflow-auto bg-white">
      {isLoading && (
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-purple-600">Loading PDF...</span>
        </div>
      )}
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        className="flex flex-col items-center"
        loading={
          <div className="flex items-center justify-center h-[70vh]">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        }
      >
        <Page
          pageNumber={currentPage}
          scale={scale}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          loading={
            <div className="flex items-center justify-center h-[50vh] w-full">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          }
          className="pdf-page"
          onLoadSuccess={() => {
            window.scrollTo(0, 0);
          }}
        />
      </Document>
    </div>
  );
};

export default PDFViewer;
