import React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface PDFControlsProps {
  currentPage: number;
  numPages: number;
  scale: number;
  onPageChange: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

const PDFControls: React.FC<PDFControlsProps> = ({
  currentPage,
  numPages,
  scale,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      onPageChange(page);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      goToPage(value);
    }
  };

  return (
    <div className="pdf-controls flex flex-wrap items-center justify-between px-4 py-3 bg-white border-t border-gray-200 shadow-sm rounded-b-lg sticky bottom-0">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || numPages <= 1}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center">
          <Input
            type="text"
            value={currentPage}
            onChange={handlePageInputChange}
            className="w-12 text-center h-9"
            disabled={numPages <= 1}
          />
          <span className="mx-2 text-gray-500">of {numPages}</span>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= numPages || numPages <= 1}
          className="h-9 w-9"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-1 mt-2 sm:mt-0">
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          className="h-9 w-9"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          onClick={onZoomReset}
          className="h-9 text-xs"
          title="Reset zoom"
        >
          {Math.round(scale * 100)}%
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          className="h-9 w-9"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomReset}
          className="h-9 w-9"
          title="Reset view"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PDFControls;