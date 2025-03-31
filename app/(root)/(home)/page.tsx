import BookOverview from "@/components/home/BookOverview";
import { db } from "@/drizzle";

const RootHome = async () => {
  const books = await db.query.books.findMany();

  return (
    <div>
      <BookOverview book={books[1]} />
    </div>
  );
};

export default RootHome;
