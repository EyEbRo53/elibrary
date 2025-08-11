import { auth } from "@/auth";
import BookTable from "@/components/global/BookTable";
import Profile from "@/components/global/Profile";
import { db } from "@/drizzle";

const DashboadHome = async () => {
  const session = await auth();
  const books = await db.query.books.findMany({
    where: (books, { eq }) => eq(books.userId, session?.user?.id || ""),
  });
  const publisher = await db.query.publisher.findFirst({
    where: (publisher, { eq }) => eq(publisher.userId, session?.user?.id || ""),
  });

  const publisherData = {
    name: publisher?.name ?? "",
    imageUrl: publisher?.image ?? "",
    description: publisher?.description ?? "",
    stats: {
      books: books.length,
      downloads: 486500,
    },
  };

  return (
    <Profile
      publisherData={publisherData}
      Books={<BookTable books={books} />}
    />
  );
};

export default DashboadHome;
