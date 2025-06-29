import { createAgent, gemini } from "@inngest/agent-kit";
import { marked } from "marked";

import { inngest } from "./client";
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
    const html = await marked.parse(markdownContent as string);

    const PDFDesignerAgent = createAgent({
      name: "PDF Designer",
      system:
        "Your are an expert PDF designer. You will design a CSS stylesheet for the provided HTML content.",
      model: gemini({
        model: "gemini-2.0-flash-lite",
      }),
    });

    const markdownPrompt = `
    You are an expert CSS designer. Given the following HTML content, generate a CSS stylesheet to style it for a professional A4 PDF document.

    **Design Principles:**
    - **Typography:** Use a clean, modern, and highly readable sans-serif font family like 'Inter'. Ensure good font sizes, line heights, and contrast.
    - **Layout:** Use a single-column layout with ample margins for comfortable reading on a PDF.
    - **Headings:** Style h1, h2, h3, etc., with clear hierarchy. \`h1\` should be prominent.
    - **Spacing:** Use vertical rhythm and consistent margins/padding for a balanced and uncluttered look.
    - **Colors:** Use a professional color palette. A dark text color (like #111827) on a white background is standard. Use a subtle accent color (like a muted indigo or blue) for elements like headings or links, but use it sparingly.
    - **Other Elements:** Style paragraphs, lists (ul, ol), blockquotes, and code blocks appropriately.

    **Output Requirements:**
    - Return ONLY the raw CSS code.
    - Do NOT include any explanations, comments, or markdown fences (like \`\`\`css).
    - Do NOT include \`@import\` for fonts, as we will handle font loading separately. Assume the 'Inter' font is available.
    - Do not style the \`body\` or \`html\` tags with background colors. The styling should apply to the content within the page.

    **HTML Content to Style:**
    \`\`\`html
    ${html}
    \`\`\`
    `;
    const { output: CSSOutput } = await PDFDesignerAgent.run(markdownPrompt);
    const customCss = CSSOutput[0].type === "text" ? CSSOutput[0].content : "";

    const updateUserChat = await step.run("updateChat", async () => {
      const update = await updateJob(event.data.id, html, customCss as string);
      return update;
    });

    return {
      customCss: customCss,
      html: html,
      chatId: updateUserChat,
    };
  }
);
