import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

// Must be dynamic import to avoid bundling Puppeteer with the edge function
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { html, customCss } = await req.json();

    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
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

    return NextResponse.json({ pdfUrl: blobUrl });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF." },
      { status: 500 }
    );
  }
}
