import { cn } from "@/lib/utils";
import BookCoverSvg from "@/components/global/BookCoverSvg";

interface Props {
  coverImage: string;
}

const BookCover = ({ coverImage }: Props) => {
  return (
    <div className={cn("relative transition-all duration-300")}>
      <BookCoverSvg />
      <div className="absolute z-10" style={{ left: "4%", top: "3%" }}>
        <img
          src={coverImage}
          alt=""
          className="rounded-lg w-[252px] h-[344px]"
        />
      </div>
    </div>
  );
};

export default BookCover;
