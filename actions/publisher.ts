"use server";

import { db } from "@/drizzle";
import { publisher, users } from "@/drizzle/schema";
import { DeleteImages } from "@/actions/Uploadthing";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// create book
export const createPublisher = async (values: {
  image: string | null | undefined;
  name: string | null | undefined;
}) => {
  console.log(values);
  try {
    const user = await auth();
    const newPublisher = await db
      .insert(publisher)
      .values({
        userId: user?.user?.id!,
        // ...values,
        image: values.image,
        name: values.name,
      })
      .returning();

    await db
      .update(users)
      .set({
        role: "publisher",
      })
      .where(eq(users.id, user?.user?.id!));

    revalidatePath("/", "layout");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newPublisher[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating publihser profile",
    };
  }
};

// update book
export const updatePublisher = async (values: {
  image: string | null | undefined;
  name: string | null | undefined;
}) => {
  try {
    const user = await auth();

    const updatePublisher = await db
      .update(publisher)
      .set({
        ...values,
      })
      .where(eq(publisher.userId, user?.user?.id!))
      .returning();

    revalidatePath("/", "layout");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatePublisher[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while updating publisher profile",
    };
  }
};
