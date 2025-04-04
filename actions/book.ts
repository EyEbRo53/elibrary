"use server";

import { db } from "@/drizzle";
import { books } from "@/drizzle/schema";
import { bookSchema } from "@/lib/utils";
import { DeleteImages } from "@/actions/Uploadthing";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// create book
export const createBook = async (book: z.infer<typeof bookSchema>) => {
  try {
    const user = await auth();
    const newBook = await db
      .insert(books)
      .values({
        userId: user?.user?.id!,
        ...book,
      })
      .returning();
    revalidatePath("/", "layout");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

// update book
export const updateBook = async (
  book: z.infer<typeof bookSchema>,
  id: string
) => {
  try {
    const updateBook = await db
      .update(books)
      .set({
        ...book,
      })
      .where(eq(books.id, id))
      .returning();
    revalidatePath("/", "layout");
    console.log(updateBook);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updateBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

// delete book
export const deleteBook = async (id: string, image: string) => {
  try {
    // await DeleteImages({ files: [image] });
    await db.delete(books).where(eq(books.id, id));
    revalidatePath("/", "layout");
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};
