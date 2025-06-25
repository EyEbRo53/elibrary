import BookOverview from "@/components/details/BookOverview";
import PDFViewer from "@/components/details/PDFViewer";
import { db } from "@/drizzle";

const BookDetails = async ({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) => {
  const id = (await params).bookId;

  const book = await db.query.books.findFirst({
    where: (book, { eq }) => eq(book.id, id),
    with: { user: true },
  });

  return (
    <div className="mt-10">
      <BookOverview book={book!} />
      <PDFViewer pdfUrl={book?.pdfUrl!} />
    </div>
  );
};

export default BookDetails;
