"use server";

import { hash } from "bcryptjs";
import { db } from "@/drizzle";
import { users } from "@/drizzle/schema";

export const signUp = async (values: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const { fullName, email, password } = values;

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
