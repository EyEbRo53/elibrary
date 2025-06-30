"use server";

import { db } from "@/drizzle";
import { jobs } from "@/drizzle/schema";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

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
  await inngest.send({
    name: "generate/pdf-generator",
    data: { topic: topic, id: create[0].id },
  });
  revalidatePath("/(root)/generatepdf", "page");
  return create;
};

export const updateJob = async (id: string, url: string) => {
  if (!id || !url) return;
  const update = await db
    .update(jobs)
    .set({
      pdfUrl: url,
      status: "completed",
    })
    .where(eq(jobs.id, id))
    .returning({ id: jobs.id });
  revalidatePath("/(root)/generatepdf", "page");
  return update[0].id;
};
