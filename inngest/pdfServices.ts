import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium"; // ✅ works in serverless

export const createPdfHTML = async (html: string, customCss: string) => {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>${customCss}</style>
        </head>
        <body>
          <div class="pdf-content">${html}</div>
        </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const buffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    const base64 = Buffer.from(buffer).toString("base64");
    return `data:application/pdf;base64,${base64}`;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF from content.");
  }
};
