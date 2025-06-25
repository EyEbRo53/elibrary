"use client";

import { useCallback, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { Button } from "@/components/ui/button";
import Loading from "@/components/global/Loading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = ({ pdfUrl }: { pdfUrl: string }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function highlightPattern(text: string, pattern: string) {
    return text.replace(pattern, (value) => `<mark>${value}</mark>`);
  }

  const [searchText, setSearchText] = useState("");

  const textRenderer = useCallback(
    (textItem: { str: string }) => highlightPattern(textItem.str, searchText),
    [searchText]
  );

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
  }

  return (
    <div className="w-fit mt-10 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <Label htmlFor="search" className="text-lg font-bold">
          Search:
        </Label>
        <Input
          type="search"
          id="search"
          value={searchText}
          onChange={onChange}
        />
      </div>
      <div className="relative group">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<Loading />}
        >
          <Page pageNumber={pageNumber} customTextRenderer={textRenderer} />
        </Document>
        <div className="absolute bottom-4 right-[40%] gap-4 z-10 hidden group-hover:flex">
          <Button
            type="button"
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
            Previous
          </Button>
          <Button
            type="button"
            disabled={pageNumber >= numPages}
            onClick={nextPage}
          >
            Next
          </Button>
        </div>
      </div>
      <p className="flex justify-center mt-4">
        Page
        <span className="text-primary font-semibold mx-1">{pageNumber}</span>
        of {numPages}
      </p>
    </div>
  );
};

export default PDFViewer;
