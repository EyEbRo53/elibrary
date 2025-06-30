import { createAgent, gemini } from "@inngest/agent-kit";
import { marked } from "marked";

import { inngest } from "./client";
import { createPdfHTML } from "./pdfServices";
import { uploadGeneratePDF } from "@/actions/Uploadthing";
import { updateJob } from "@/actions/jobs";

export const PDFGenerator = inngest.createFunction(
  { id: "pdf-generator" },
  { event: "generate/pdf-generator" },
  async ({ event, step }) => {
    const PDFAgent = createAgent({
      name: "PDF Generator",
      system:
        "Your are an expert PDF generator. You will generate content for a PDF document based on the provided topic.",
      model: gemini({
        model: "gemini-2.0-flash-lite",
      }),
    });

    const pdfPrompt = `
                       Generate content for a PDF document based on the following topic.
                       Format the entire response using Markdown.
                       The content should be comprehensive, well-structured with headings (e.g., #, ##), subheadings, bullet points, and paragraphs.
                       Do not include any preamble or explanation like "Here is the content for your PDF". Just return the pure Markdown content.
                       Topic: ${event.data.topic}`;

    const { output } = await PDFAgent.run(pdfPrompt);
    const markdownContent = output[0].type === "text" ? output[0].content : "";

    const html = await step.run("Markdown-to-HTML", async () => {
      const html = await marked.parse(markdownContent as string);
      return html;
    });

    const PDFDesignerAgent = createAgent({
      name: "PDF Designer",
      system:
        "You are an expert PDF layout designer. Your task is to create a clean, professional, and print-ready HTML + CSS layout that will be converted into a PDF document. The design should: Use only inline or embedded CSS (no external stylesheets).Be A4 page size, with standard print margins (1 inch).Support print-friendly fonts (e.g., sans-serif or Georgia). Look visually professional — align sections, use spacing, bold headers, and distinct sections. Include headers, sections, and content blocks with good vertical rhythm and spacing. Avoid JavaScript; focus only on HTML + CSS.",
      model: gemini({
        model: "gemini-2.0-flash-lite",
      }),
    });

    const markdownPrompt = `
    You are an expert PDF layout designer and CSS stylist.

    Your task is to receive HTML content and return a complete, styled version of it, ready to be converted     into a professional PDF.

    Responsibilities:

    1. Ensure the HTML is valid, well-structured, and includes a full document structure:
       - Must contain \`<!DOCTYPE html>\`, \`<html>\`, \`<head>\`, and \`<body>\` tags.
       - If the provided HTML is incomplete or malformed, correct it.
    
    2. Embed a clean, inline CSS stylesheet inside a \`<style>\` tag in the \`<head>\`.

    3. Follow these styling principles:
       - Use the 'Inter' font (assume it's available).
       - Use print-friendly design: A4 size layout, 1-inch margins.
       - Font color: #111827. Headings: bold, clear hierarchy.
       - Lists, blockquotes, and paragraphs must have appropriate spacing and alignment.
       - Avoid background colors and JavaScript.
       - Use a muted accent color (e.g., #4f46e5) sparingly for headings or links.

    Output Instructions:
    - Return a complete HTML string including the CSS and content inside standard tags.
    - Do not include markdown formatting, comments, or any explanation.
    - You must handle and fix broken HTML if present.

    Input HTML Content:
    \`\`\`html
    ${html}
    \`\`\`
    `;

    const { output: CSSOutput } = await PDFDesignerAgent.run(markdownPrompt);
    const customCss = CSSOutput[0].type === "text" ? CSSOutput[0].content : "";

    const createdPDF = await step.run("Create PDF", async () => {
      const PDFURL = await createPdfHTML(html, customCss as string);
      const uploadedPDFURL = await uploadGeneratePDF(PDFURL, event.data.topic);
      return uploadedPDFURL;
    });

    const updateUserChat = await step.run("updateChat", async () => {
      const update = await updateJob(event.data.id, createdPDF as string);
      return update;
    });

    return {
      customCss: customCss,
      html: html,
      pdf: createdPDF,
      chatId: updateUserChat,
    };
  }
);
