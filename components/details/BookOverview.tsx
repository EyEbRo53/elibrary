import BookCover from "@/components/global/BookCover";

import { MdStar } from "react-icons/md";

interface Props {
  book: book;
}
const BookOverview = ({ book }: Props) => {
  return (
    <div className="book-overview">
      <div className="flex flex-1 flex-col gap-2 xl:w-[45%] mt-20 xl:mt-0">
        <h1>{book.title}</h1>

        <div className="book-info">
          <p>
            By <span className="font-semibold text-primary">{book.title}</span>
          </p>

          <p>
            Genre{" "}
            <span className="font-semibold text-primary">{book.genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <MdStar className="text-yellow-400 size-6" />
            <p>2</p>
          </div>
        </div>

        <p className="book-description">{book.description}</p>
      </div>

      <div className="relative flex justify-center xl:w-[55%]">
        <div className="relative">
          {/* <BookCover coverImage={book.coverUrl} /> */}
          <BookCover coverImage={"/cover.PNG"} />

          <div className="absolute top-15 opacity-20 left-14 rotate-[20deg] hidden md:block">
            {/* <BookCover coverImage={book.coverUrl} /> */}
            <BookCover coverImage={"/cover.PNG"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookOverview;
