"use server";

import { db } from "@/drizzle";
import { jobs } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();
export const DeleteImages = async ({ files }: { files: string[] }) => {
  const UUIDs = files.map((file) => file.split("/").pop() || "");

  const deleted = await utapi.deleteFiles(UUIDs);

  // Ensure the response is a plain object
  return JSON.parse(JSON.stringify(deleted));
};

export const uploadGeneratePDF = async (
  blobUrl: string,
  topic: string,
  id: string
) => {
  // Fetch the blob from the blobUrl
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  const title = topic.replace(/\s+/g, "-").toLowerCase().slice(0, 50); // Ensure the title is URL-friendly and not too long

  try {
    // Convert blob to File
    const file = new File([blob], `${title}.pdf`, {
      type: "application/pdf",
    });
    const uploadedPDF = await utapi.uploadFiles(file);
    const pdfUrl = uploadedPDF.data?.ufsUrl;
    const update = await db
      .update(jobs)
      .set({
        pdfUrl: pdfUrl,
      })
      .where(eq(jobs.id, id))
      .returning({ id: jobs.id });
    // Ensure the response is a plain object
    return pdfUrl;
  } catch (error) {
    console.error("Error uploading PDF:", error);
  }
};
