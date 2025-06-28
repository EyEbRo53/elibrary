"use server";

import { db } from "@/drizzle";
import { jobs } from "@/drizzle/schema";
import { auth } from "@/auth";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createJob = async (topic: string) => {
  const session = await auth();
  if (!session || !topic) return;
  const create = await db
    .insert(jobs)
    .values({
      userId: session.user?.id || "",
      topic: topic,
    })
    .returning({ id: jobs.id });
  // console.log("Chat created:", create[0].id);
  revalidatePath("/(root)/generatepdf", "page");
  return create[0].id;
};

export const updateJob = async (id: string, pdfUrl: string | null) => {
  if (!id || !pdfUrl) return;
  const update = await db
    .update(jobs)
    .set({
      pdfUrl: pdfUrl,
      status: "completed",
    })
    .where(eq(jobs.id, id))
    .returning({ id: jobs.id });
  revalidatePath("/(root)/generatepdf", "page");
  return update[0].id;
};
