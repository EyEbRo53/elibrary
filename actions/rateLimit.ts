"use server";

import ratelimit from "@/lib/ratelimit";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const rateLimit = async () => {
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    redirect("/too-fast");
  }
};
