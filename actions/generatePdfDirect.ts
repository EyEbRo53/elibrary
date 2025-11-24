"use server";

import { createAgent, gemini } from "@inngest/agent-kit";
import { marked } from "marked";

import { createPdfHTML } from "@/inngest/pdfServices";
import { uploadGeneratePDF } from "@/actions/Uploadthing";
import { db } from "@/drizzle";
import { jobs } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const generatePdfDirect = async (topic: string, jobId: string) => {
  console.log("generatePdfDirect: starting for", jobId);
  try {
    // Generate markdown content using Gemini
    const PDFAgent = createAgent({
      name: "PDF Generator",
      system:
        "Your are an expert PDF generator. You will generate content for a PDF document based on the provided topic.",
      model: gemini({
        model: "gemini-2.0-flash-lite",
      }),
    });

    const pdfPrompt = `Generate content for a PDF document based on the following topic. Format the entire response using Markdown. The content should be comprehensive, well-structured with headings (e.g., #, ##), subheadings, bullet points, and paragraphs. Do not include any preamble or explanation. Topic: ${topic}`;

    console.time("PDFAgent.run");
    const { output } = await PDFAgent.run(pdfPrompt);
    console.timeEnd("PDFAgent.run");
    const markdownContent = output[0]?.type === "text" ? output[0].content : "";

    // Convert markdown to HTML
    console.time("markdown.parse");
    const html = await marked.parse(markdownContent as string);
    console.timeEnd("markdown.parse");

    // Generate CSS/layout using a second agent
    const PDFDesignerAgent = createAgent({
      name: "PDF Designer",
      system:
        "You are an expert PDF layout designer. Return a complete, styled HTML document including inline CSS suitable for conversion to PDF.",
      model: gemini({
        model: "gemini-2.0-flash-lite",
      }),
    });

    const markdownPrompt = `You are an expert PDF layout designer. Input HTML: \n\n${html}`;
    console.time("PDFDesignerAgent.run");
    const { output: CSSOutput } = await PDFDesignerAgent.run(markdownPrompt);
    console.timeEnd("PDFDesignerAgent.run");
    const customCss = CSSOutput[0]?.type === "text" ? CSSOutput[0].content : "";

    // Create PDF via browserless (returns data URL)
    console.time("createPdfHTML");
    const pdfDataUrl = await createPdfHTML(html, customCss as string);
    console.timeEnd("createPdfHTML");

    // Upload generated PDF
    console.time("uploadGeneratePDF");
    const uploadedUrl = await uploadGeneratePDF(pdfDataUrl, topic);
    console.timeEnd("uploadGeneratePDF");

    // Update job record
    console.time("db.updateJob");
    await db
      .update(jobs)
      .set({ pdfUrl: uploadedUrl as string, status: "completed" })
      .where(eq(jobs.id, jobId));
    console.timeEnd("db.updateJob");

    console.log("generatePdfDirect: completed for", jobId);
    return uploadedUrl;
  } catch (err) {
    console.error("generatePdfDirect error:", err);
    try {
      await db
        .update(jobs)
        .set({ status: "failed" as any })
        .where(eq(jobs.id, jobId));
    } catch (e) {
      console.error("Failed to mark job failed", e);
    }
    throw err;
  }
};
