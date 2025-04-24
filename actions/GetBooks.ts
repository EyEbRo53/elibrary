// "use server";

// import { db } from "@/drizzle";

// export const GetBooks = async (
//   page: number,
//   pageSize: number,
//   orderBy: string,
//   query: string,
//   rating: string
// ) => {
//   const books = await db.query.books.findMany({
//     with: {
//       publisher: true,
//     },
//     orderBy:
//       orderBy === "newest"
//         ? (book, { desc }) => desc(book.createdAt)
//         : (book, { asc }) => asc(book.createdAt),
//     limit: pageSize,
//     offset: (page - 1) * pageSize,
//   });

//   if (!books) {
//     return [];
//   }

//   if (query) {
//     return books.filter((book) =>
//       book.title.toLowerCase().includes(query.toLowerCase())
//     );
//   }

//   return books;
// };

"use server";

import { db } from "@/drizzle";
import { eq } from "drizzle-orm";

export const GetBooks = async (
  page: number,
  pageSize: number,
  orderBy: string,
  query: string,
  rating: string,
  filterValue?: string
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
    ...(filterValue && {
      where: (book, { eq }) => eq(book.userId, filterValue || ""),
    }),
  });

  if (query) {
    return books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  // console.log("books", books.length);

  return books;
};
