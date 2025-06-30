"use server";

import { compare, hash } from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/drizzle";
import { users } from "@/drizzle/schema";
import ratelimit from "@/lib/ratelimit";

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

export const signIn = async (email: string, password: string) => {
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.email, email.toString()),
  });

  if (!user) return null;

  const isPasswordValid = await compare(password.toString(), user?.password!);

  if (!isPasswordValid) return null;

  return user;
};
