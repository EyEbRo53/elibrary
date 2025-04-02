import BookCover from "@/components/details/BookCover";

const BookCard = ({ book }: { book: book }) => {
  return (
    <div>
      <div className="relative flex justify-center -mt-14">
        <BookCover coverImage={"/cover.PNG"} />
      </div>
    </div>
  );
};

export default BookCard;
