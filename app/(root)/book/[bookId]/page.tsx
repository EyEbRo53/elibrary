import BookOverview from "@/components/details/BookOverview";
import { db } from "@/drizzle";

const BookDetails = async ({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) => {
  const id = (await params).bookId;

  const books = await db.query.books.findFirst({
    where: {
      id: id,
    },
  });

  return (
    <div>
      <BookOverview book={books!} />
    </div>
  );
};

export default BookDetails;
