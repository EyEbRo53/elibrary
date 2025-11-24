// BookTableWrapper.tsx
"use client";
import BookTable from "./BookTable";

export default function BookTableWrapper({ books }: { books: any[] }) {
  return <BookTable books={books} />;
}
