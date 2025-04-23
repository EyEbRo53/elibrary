"use client";

import BookCover from "@/components/global/BookCover";

import Link from "next/link";
import Moment from "react-moment";

const BookCard = ({ book }: { book: book }) => {
  return (
    <div className="space-y-2 w-full justify-center items-center flex">
      <Link href={`/book/${book.id}`} className="flex justify-center relative">
        <BookCover coverImage={"/cover.PNG"} />
        <div className="bookcard-div">
          <div className="flex justify-between gap-1 p-2">
            <div className="space-y-1">
              <h2 className="line-clamp-1 font-bold text-lg">{book.title}</h2>
              <p className="line-clamp-1 font-bold text-lg italic text-gray-400">
                {book.genre}
              </p>
            </div>
            <div className="capitalize text-primary">{book.status}</div>
          </div>
          <div className="bookcard-last-div">
            <p className="">By: {book?.publisher?.name}</p>
            {book.createdAt && <Moment fromNow>{book.createdAt}</Moment>}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
