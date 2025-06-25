"use client";

import { useCallback, useState } from "react";
import { Document, Page, pdfjs, Outline } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { Button } from "@/components/ui/button";
import Loading from "@/components/global/Loading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = ({
  pdfUrl,
  status,
}: {
  pdfUrl: string;
  status: "free" | "pro" | null | undefined;
}) => {
  const url =
    process.env.NODE_ENV === "development" ? pdfUrl : `/api/pdf?url=${pdfUrl}`;
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [open, setOpen] = useState(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(status === "free" ? numPages : 10);
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

  function onItemClick({ pageNumber: itemPageNumber }: { pageNumber: number }) {
    setPageNumber(itemPageNumber);
  }

  return (
    <div className="w-fit mt-10 mb-4">
      <h2 className="text-2xl text-primary mb-4">PDF Viewer</h2>

      <div className="relative group">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<Loading />}
          onItemClick={status === "pro" ? () => {} : onItemClick}
          className={"border p-2 border-dark-400 rounded-md"}
        >
          {numPages > 0 && (
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
          )}
          <Button
            className={cn(
              "absolute top-14 z-10 group-hover:opacity-100 opacity-0",
              open ? "right-[40%]" : "left-4",
              status === "pro" ? "hidden" : "block"
            )}
            onClick={() => setOpen(!open)}
          >
            Open Table of Content
          </Button>
          <div className={cn("flex gap-2 min-h-fit rounded-md")}>
            {open && (
              <div className="ml-2">
                <h2 className="text-xl text-primary">Table of Content</h2>
                <Outline onItemClick={onItemClick} />
              </div>
            )}
            <Page pageNumber={pageNumber} customTextRenderer={textRenderer} />
          </div>
          {numPages > 0 && (
            <p className="flex justify-center mt-4">
              Page
              <span className="text-primary font-semibold mx-1">
                {pageNumber}
              </span>
              of {numPages}
            </p>
          )}
        </Document>
        {numPages > 0 && (
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
              disabled={
                pageNumber >= numPages || (status === "pro" && numPages > 10)
              }
              onClick={nextPage}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
