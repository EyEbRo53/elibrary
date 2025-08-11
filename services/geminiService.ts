"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates a summary for the given text using the Gemini model.
 * @param text The text to summarize.
 * @returns A promise that resolves to the summary string.
 */
export async function summarizeText(text: string): Promise<string> {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `Please provide a concise, easy-to-read summary of the following text extracted from a PDF. Structure the summary with a title, a brief overview, and then key takeaways as a bulleted list.

    Text to summarize:
    ---
    ${text}
    ---
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    return response.text || "No summary generated";
  } catch (error) {
    console.error("Error summarizing text with Gemini:", error);
    throw new Error("Failed to generate summary from Gemini API.");
  }
}
