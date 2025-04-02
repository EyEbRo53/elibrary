import BookCard from "@/components/home/BookCard";
import Filters from "@/components/home/Filters";
import Hero from "@/components/home/Hero";
import { db } from "@/drizzle";

const RootHome = async () => {
  const books = await db.query.books.findMany();
  return (
    <div className="space-y-6 mb-4">
      <Hero />
      <h1 className="font-bold text-4xl text-primary mt-2">Our Library</h1>
      <Filters books={books} />
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
    </div>
  );
};

export default RootHome;
