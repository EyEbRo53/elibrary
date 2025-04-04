import BookOverview from "@/components/details/BookOverview";
import { db } from "@/drizzle";

const BookDetails = async ({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) => {
  const id = (await params).bookId;

  const books = await db.query.books.findFirst({
    where: (book, { eq }) => eq(book.id, id),
  });

  return (
    <div className="mt-10">
      <BookOverview book={books!} />
    </div>
  );
};

export default BookDetails;
