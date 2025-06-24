"use server";

export const arrayBuffer = async ({ url }: { url: string }) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    const buffer = await response.arrayBuffer();

    // If needed as base64, use:
    // const base64 = Buffer.from(buffer).toString("base64");

    return Buffer.from(buffer); // or return buffer;
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return null; // explicitly return something on error
  }
};
