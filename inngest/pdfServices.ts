// Declare global types for jsPDF and html2canvas
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

export const createPdfHTML = async (
  html: string,
  customCss: string
): Promise<string> => {
  try {
    const TOKEN = "2SafpAFc0ApqLuC642afb8cf7b74a484c967e748052289050";
    const url = `https://production-sfo.browserless.io/pdf?token=${TOKEN}`;
    const headers = {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    };

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <style>${customCss}</style>
        </head>
        <body>
          <div class="pdf-content" style={{padding: 20px}}>${html}</div>
        </body>
      </html>
    `;

    const data = {
      html: fullHtml,
      options: {
        displayHeaderFooter: true,
        printBackground: false,
        format: "A4",
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    const pdfBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(pdfBuffer).toString("base64");
    const blobUrl = `data:application/pdf;base64,${base64}`;
    return blobUrl;
  } catch (error) {
    console.error("Error creating PDF:", error);
    throw new Error("Failed to generate PDF from content.");
  }
};
