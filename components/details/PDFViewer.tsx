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
  const [outline, setOutline] = useState<any[] | null>(null);
  const [outlineError, setOutlineError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    // free users only get 10 pages
    const allowedPages = status === "free" ? Math.min(numPages, 10) : numPages;
    setNumPages(allowedPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prev) => Math.max(1, Math.min(prev + offset, numPages)));
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function highlightPattern(text: string, pattern: string) {
    if (!pattern.trim()) return text;
    const regex = new RegExp(`(${pattern})`, "gi");
    return text.replace(regex, `<mark>$1</mark>`);
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
    if (itemPageNumber > 0 && itemPageNumber <= numPages) {
      setPageNumber(itemPageNumber);
    }
  }

  return (
    <div className="w-fit mt-10 mb-4">
      <h2 className="text-2xl text-primary mb-4">PDF Viewer</h2>

      <div className="relative group">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) =>
            console.warn("Document load error:", err.message)
          }
          loading={<Loading />}
          className="border p-2 border-dark-400 rounded-md"
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

          <div className="flex gap-2 min-h-fit rounded-md">
            {open && (
              <div className="ml-2 w-64">
                <h2 className="text-xl text-primary mb-2">Table of Content</h2>
                <Outline
                  onItemClick={onItemClick}
                  onLoadSuccess={setOutline}
                  onLoadError={() =>
                    setOutlineError("No table of contents found.")
                  }
                />
                {outlineError && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {outlineError}
                  </p>
                )}
              </div>
            )}

            {/* ✅ Only render Page when we know numPages */}
            {numPages > 0 && pageNumber <= numPages && (
              <Page
                key={pageNumber} // forces rerender when page changes
                pageNumber={pageNumber}
                customTextRenderer={textRenderer}
                onLoadError={(err) =>
                  console.warn("Page load error:", err.message)
                }
              />
            )}
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
