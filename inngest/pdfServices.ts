import puppeteer from "puppeteer";

export const createPdfHTML = async (
  html: string,
  customCss: string
): Promise<string> => {
  try {
    const browser = await puppeteer.launch({
      headless: "shell",
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // for Vercel, Netlify, etc.
    });

    const page = await browser.newPage();

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

    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const buffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    const base64 = Buffer.from(buffer).toString("base64");
    const blobUrl = `data:application/pdf;base64,${base64}`;
    return blobUrl;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF from content.");
  }
};
