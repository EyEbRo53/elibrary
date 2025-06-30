import { auth } from "@/auth";
import { db } from "@/drizzle";

import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const jobs = await db.query.jobs.findMany({
    orderBy: (jobs, { desc }) => desc(jobs.createdAt),
    where: (user, { eq }) => eq(user.userId, session?.user?.id || ""),
  });
  return NextResponse.json(jobs);
}
