import { GetBooks } from "@/actions/GetBooks";
import BookCard from "@/components/home/BookCard";
import Filters from "@/components/global/Filters";
import Hero from "@/components/home/Hero";
import Pagination from "@/components/global/Pagination";
import { db } from "@/drizzle";
const RootHome = async ({
  searchParams,
}: {
  searchParams: Promise<{
    sort: string;
    q: string;
    page: number;
    rating: string;
  }>;
}) => {
  const allBooks = await db.query.books.findMany();
  const totalBooks = allBooks.length;
  const pageSize = 16;
  const params = await searchParams;
  const books = await GetBooks(
    params.page,
    pageSize,
    params.sort,
    params.q,
    params.rating
  );

  return (
    <div className="space-y-6 mb-10">
      <Hero />
      <div className="flex justify-between gap-4">
        <h1 className="font-bold text-4xl text-primary mt-2">E-Library</h1>
        <Filters />
      </div>
      <div className="book-list">
        {books.length === 0 && (
          <h3 className="flex justify-center items-center text-xl font-extrabold">
            No Books Found
          </h3>
        )}
        {books.map((book) => (
          <BookCard book={book} key={book.id} />
        ))}
      </div>
      <Pagination noOfBooks={totalBooks} pageSize={pageSize} />
    </div>
  );
};

export default RootHome;
