"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();
export const DeleteImages = async ({ files }: { files: string[] }) => {
  const UUIDs = files.map((file) => file.split("/").pop() || "");

  const deleted = await utapi.deleteFiles(UUIDs);

  // Ensure the response is a plain object
  return JSON.parse(JSON.stringify(deleted));
};

export const uploadGeneratePDF = async (blobUrl: string, topic: string) => {
  // Fetch the blob from the blobUrl
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  const title = topic.replace(/\s+/g, "-").toLowerCase().slice(0, 50); // Ensure the title is URL-friendly and not too long

  // Convert blob to File
  const file = new File([blob], `${title}.pdf`, {
    type: "application/pdf",
  });
  const uploadedPDF = await utapi.uploadFiles(file);
  // Ensure the response is a plain object
  return uploadedPDF.data?.ufsUrl;
};
