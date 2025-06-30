"use server";

import { hash } from "bcryptjs";
import { db } from "@/drizzle";
import { users } from "@/drizzle/schema";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";

export const signUp = async (values: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const { fullName, email, password } = values;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  const existingUser = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  });

  if (existingUser) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      name: fullName,
      email,
      password: hashedPassword,
    });

    return { success: true };
  } catch (error) {
    console.log(error, "Signup error");
    return { success: false, error: "Signup error" };
  }
};
