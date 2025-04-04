"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteBook } from "@/actions/book";

import Moment from "react-moment";
import { MdDelete, MdEdit } from "react-icons/md";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface Props {
  books: book[];
}

const BookTable = ({ books }: Props) => {
  const session = useSession();
  if (books.length === 0) {
    return (
      <div className="flex justify-center items-center text-2xl font-bold text-primary mb-2">
        No Books Uploaded
      </div>
    );
  }

  const [loading, setLoading] = useState(false);
  const onDelete = async (id: string, image: string) => {
    setLoading(true);
    const result = await deleteBook(id, image);
    if (result.success) {
      toast.success("Book updated successfully");
      setLoading(false);
    } else {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <Table>
      <TableHeader className="bg-dark-800 rounded-md">
        <TableRow className="border-none p-4">
          <TableHead className="px-2">Title</TableHead>
          <TableHead className="px-2">Genre</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Created At</TableHead>
          <TableHead className="px-2">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {books.map((book) => {
          return (
            <TableRow key={book.id} className="border-none">
              <TableCell className="flex items-center gap-2">
                <img
                  src={book.coverUrl}
                  className="size-10 rounded-md"
                  alt=""
                />
                <p className="hidden md:block">{book.title}</p>
              </TableCell>
              <TableCell className="">{book.genre}</TableCell>
              <TableCell className="">{book.status}</TableCell>
              <TableCell className="">
                <Moment fromNow>{book.createdAt!}</Moment>
              </TableCell>
              <TableCell className="space-x-2">
                <Button size={"icon"} asChild>
                  <Link
                    href={`/dashboard/${session.data?.user?.id}/books/${book.id}`}
                  >
                    <MdEdit className="size-6" />
                  </Link>
                </Button>
                <Button
                  size={"icon"}
                  variant={"destructive"}
                  onClick={() => onDelete(book.id, book.coverUrl)}
                  disabled={loading}
                >
                  <MdDelete className="size-6" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default BookTable;
