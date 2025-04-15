"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { FiLoader } from "react-icons/fi";
import { MdOutlineErrorOutline } from "react-icons/md";

import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  fileUrl: string;
};

export default function PdfViewer({ fileUrl }: Props) {
  if (!fileUrl) return;
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="pt-10 space-y-2 w-fit">
      <h2 className="text-2xl font-bold text-primary">PDF Viewer</h2>

      <div className="flex gap-4 justify-end">
        <Button onClick={() => setScale((prev) => prev + 0.2)}>Zoom In</Button>
        <Button onClick={() => setScale((prev) => Math.max(0.2, prev - 0.2))}>
          Zoom Out
        </Button>
      </div>

      <Document
        file={{
          url: `/api/pdf?url=${fileUrl}`,
        }}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error("PDF Load Error:", error)}
        onLoadStart={() => setLoading(true)}
        loading={
          <FiLoader className="text-primary size-10 animate-spin place-content-center" />
        }
        error={<MdOutlineErrorOutline className="text-red-500 size-10" />}
      >
        <div className="h-[820px] overflow-auto hide-scrollbar">
          <Page pageNumber={pageNumber} scale={scale} />
        </div>
      </Document>

      <div className="flex gap-4 mt-4 justify-end">
        <Button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
        >
          Prev
        </Button>
        <span>
          Page {pageNumber} of {numPages}
        </span>
        <Button
          onClick={() =>
            setPageNumber((prev) => Math.min(prev + 1, numPages || 1))
          }
          disabled={pageNumber >= (numPages || 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
