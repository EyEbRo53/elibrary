// PDF.js is loaded from a CDN, so we declare its global variable.
declare const pdfjsLib: any;

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const MAX_TEXT_LENGTH = 100000; // A reasonable limit to avoid overloading the Gemini API context window

/**
 * Loads a PDF document from a given URL.
 * @param url The URL of the PDF file.
 * @returns A promise that resolves to the PDFDocumentProxy object.
 */
export async function loadPdf(url: string): Promise<PDFDocumentProxy> {
  // Use a proxy to try and bypass some CORS issues, though it's not a silver bullet.
  const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;

  const loadingTask = pdfjsLib.getDocument({
    url: proxyUrl,
    CMapReaderFactory: null,
    StandardFontDataFactory: null,
  });
  return loadingTask.promise;
}

/**
 * Extracts text content from all pages of a loaded PDF document.
 * @param pdfDoc The PDFDocumentProxy object.
 * @returns A promise that resolves to the concatenated text of the document.
 */
export async function extractTextFromPdf(
  pdfDoc: PDFDocumentProxy
): Promise<string> {
  let fullText = "";
  const numPages = pdfDoc.numPages;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: { str: string }) => item.str)
      .join(" ");
    fullText += pageText + "\n\n";

    if (fullText.length > MAX_TEXT_LENGTH) {
      console.warn(
        `Text extraction truncated at ${MAX_TEXT_LENGTH} characters.`
      );
      return fullText.substring(0, MAX_TEXT_LENGTH);
    }
  }

  return fullText;
}
