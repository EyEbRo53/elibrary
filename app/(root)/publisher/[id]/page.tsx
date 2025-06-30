import { GetBooks } from "@/actions/GetBooks";
import BookCard from "@/components/home/BookCard";
import Filters from "@/components/global/Filters";
import PublisherDetails from "@/components/publisher/PublisherDetails";
import { db } from "@/drizzle";

import { redirect } from "next/navigation";
import Pagination from "@/components/global/Pagination";

const BookDetails = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    sort: string;
    q: string;
    page: number;
    rating: string;
  }>;
}) => {
  const id = (await params).id;
  const searchparams = await searchParams;
  const pageSize = 16;

  const publisherBooks = await db.query.books.findMany({
    where: (book, { eq }) => eq(book.userId, id),
  });
  const totalBooks = publisherBooks.length;
  const books = await GetBooks(
    searchparams.page,
    pageSize,
    searchparams.sort,
    searchparams.q,
    searchparams.rating,
    id
  );

  const publisher = await db.query.publisher.findFirst({
    where: (user, { eq }) => eq(user.userId, id || ""),
  });

  if (!publisher) {
    redirect("/");
  }

  return (
    <div className="my-5 w-full space-y-8">
      <PublisherDetails publisher={publisher} noOfBooks={books.length} />
      <div className="block space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl text-primary my-4">
            {publisher?.name} Library
          </h1>
          <Filters />
        </div>
        <div className="book-list">
          {books.length === 0 && (
            <h3 className="flex justify-center items-center text-xl font-extrabold">
              No Published Books!
            </h3>
          )}
          {books.map((book) => (
            <BookCard book={book} key={book.id} />
          ))}
        </div>
      </div>
      {publisherBooks.length > 10 && (
        <Pagination noOfBooks={totalBooks} pageSize={pageSize} />
      )}
    </div>
  );
};

export default BookDetails;
