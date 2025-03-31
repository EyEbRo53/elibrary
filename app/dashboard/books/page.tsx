import BookTable from "@/components/global/BookTable";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle";

import Link from "next/link";

const Books = async () => {
  const books = await db.query.books.findMany();
  return (
    <section className="w-full rounded-2xl mt-2 bg-dark-100">
      <div className="flex flex-wrap items-center justify-between gap-2 p-6">
        <h2 className="text-xl font-semibold">All Books</h2>
        <Button asChild>
          <Link href="/dashboard/books/new">Create a New Book</Link>
        </Button>
      </div>

      <div className="mt-5 w-full overflow-hidden p-3">
        <BookTable books={books} />
      </div>
    </section>
  );
};

export default Books;
