"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();
export const DeleteImages = async ({ files }: { files: string[] }) => {
  const UUIDs = files.map((file) => file.split("/").pop() || "");

  const deleted = await utapi.deleteFiles(UUIDs);

  // Ensure the response is a plain object
  return JSON.parse(JSON.stringify(deleted));
};
