import BookOverview from "@/components/details/BookOverview";
import PDFViewer from "@/components/details/PDFViewer";
import { db } from "@/drizzle";
import { users } from "@/drizzle/schema";

const BookDetails = async ({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) => {
  const id = (await params).bookId;

  const books = await db.query.books.findFirst({
    where: (book, { eq }) => eq(book.id, id),
    // with: users,
  });
  // console.log(books);
  return (
    <div className="mt-10">
      <BookOverview book={books!} />
      <PDFViewer fileUrl="http://localhost:3000/nextjs.pdf" />
    </div>
  );
};

export default BookDetails;
