"use server";

import { db } from "@/drizzle";

export const GetBooks = async (
  page: number,
  pageSize: number,
  orderBy: string,
  query: string,
  rating: string
) => {
  const books = await db.query.books.findMany({
    with: {
      publisher: true,
    },
    orderBy:
      orderBy === "newest"
        ? (book, { desc }) => desc(book.createdAt)
        : (book, { asc }) => asc(book.createdAt),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  if (!books) {
    return [];
  }

  if (query) {
    return books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  return books;
};
