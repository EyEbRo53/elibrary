"use server";

import { db } from "@/drizzle";
import { jobs } from "@/drizzle/schema";
import { auth } from "@/auth";
import { generatePdfDirect } from "@/actions/generatePdfDirect";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createJob = async (topic: string) => {
  const session = await auth();
  if (!session || !topic) return;
  console.time("db.insert");
  const create = await db
    .insert(jobs)
    .values({
      userId: session.user?.id || "",
      topic: topic,
    })
    .returning({ id: jobs.id });
  console.timeEnd("db.insert");
  // console.log("Chat created:", create[0].id);

  // Fire-and-forget direct PDF generation (no Inngest)
  void generatePdfDirect(topic, create[0].id).catch((err) =>
    console.error("generatePdfDirect error:", err)
  );

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
