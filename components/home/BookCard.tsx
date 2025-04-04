import BookCover from "@/components/global/BookCover";
import Link from "next/link";

const BookCard = ({ book }: { book: book }) => {
  return (
    <div className="space-y-2">
      <Link href={`/book/${book.id}`} className="flex justify-center">
        <BookCover coverImage={"/cover.PNG"} />
      </Link>
      <div className="mx-5 flex md:block flex-col justify-center items-center">
        <div className="flex justify-between gap-4">
          <div className="space-y-2">
            <h2 className="line-clamp-1 font-bold text-lg">{book.title}</h2>
            <p className="line-clamp-1 font-bold text-lg italic text-gray-400">
              {book.genre}
            </p>
          </div>
          <div className="">{book.status}</div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
