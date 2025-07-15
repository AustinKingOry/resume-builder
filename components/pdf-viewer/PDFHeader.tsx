import React from "react";
import { FileText } from "lucide-react";

interface PDFHeaderProps {
  fileName: string;
}

const PDFHeader: React.FC<PDFHeaderProps> = ({ fileName }) => {
  return (
    <div className="pdf-header flex items-center justify-between p-4 bg-white rounded-t-lg border-b border-gray-100 sticky top-0 z-10 dark:bg-black dark:border-gray-900">
      <div className="flex items-center">
        <FileText className="h-5 w-5 text-purple-600 mr-2 dark:text-purple-400" />
        <h2 className="text-lg font-medium truncate max-w-[300px] sm:max-w-md md:max-w-lg">
          {fileName || "No document loaded"}
        </h2>
      </div>
      <div>
      </div>
    </div>
  );
};

export default PDFHeader;