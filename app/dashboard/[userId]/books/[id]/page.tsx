import BookForm from "@/components/admin/forms/BookForm";
import { db } from "@/drizzle";

const NewBooks = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const newId = id === "new" ? "" : id;

  const book = await db.query.books.findFirst({
    where: (book, { eq }) => eq(book.id, newId),
  });
  return (
    <section className="w-full">
      <BookForm book={book} />
    </section>
  );
};

export default NewBooks;
