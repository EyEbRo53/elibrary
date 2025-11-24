export const createPdfHTML = async (
  html: string,
  customCss: string
): Promise<string> => {
  try {
    const TOKEN = process.env.BROWSERLESS_TOKEN || "";
    const BASE =
      process.env.BROWSERLESS_URL || "https://production-sfo.browserless.io";
    const url = `${BASE.replace(/\/$/, "")}/pdf${
      TOKEN ? `?token=${TOKEN}` : ""
    }`;
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
          <div class="pdf-content">${html}</div>
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
