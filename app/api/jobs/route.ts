import { db } from "@/drizzle";

import { NextResponse } from "next/server";

export async function GET() {
  const jobs = await db.query.jobs.findMany({
    orderBy: (jobs, { desc }) => desc(jobs.createdAt),
  });
  return NextResponse.json(jobs);
}
