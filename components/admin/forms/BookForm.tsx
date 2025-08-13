"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { bookSchema } from "@/lib/utils";
import FileUpload from "@/components/admin/forms/FileUpload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBook, updateBook } from "@/actions/book";

interface Props {
  book: book | undefined;
}

const BookForm = ({ book }: Props) => {
  const router = useRouter();
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [PDFURL, setPDFURL] = useState("");
  const [pending, startTransition] = useTransition();

  const defaultValues = book
    ? {
        ...book,
        status: book.status!,
      }
    : {
        title: "",
        description: "",
        genre: "",
        coverUrl: "",
        pdfUrl: "",
        status: "pro" as "free" | "pro",
      };
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    // console.log(values);
    if (book) {
      setLoading(true);
      const result = await updateBook(values, book.id);
      if (result.success) {
        toast.success("Book updated successfully");
        setLoading(false);
        router.push(`/dashboard/${session.data?.user?.id}/books`);
      } else {
        setLoading(false);
        toast.error("Something went wrong");
      }
    } else {
      setLoading(true);
      const result = await createBook(values);
      if (result.success) {
        toast.success("Book created successfully");
        setLoading(false);
        router.push(`/dashboard/${session.data?.user?.id}/books`);
      } else {
        setLoading(false);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="admin-upload-div">
            <FormField
              control={form.control}
              name={"coverUrl"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Cover</FormLabel>
                  <FormControl>
                    <FileUpload
                      url={field.value}
                      disabled={loading}
                      onChange={field.onChange}
                      type="image"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="block gap-4 lg:w-[50%]">
              <FormField
                control={form.control}
                name={"pdfUrl"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload PDF</FormLabel>
                    <FormControl>
                      <FileUpload
                        url={field.value}
                        disabled={loading}
                        onChange={field.onChange}
                        type="pdf"
                        isUpload={isUpload}
                        setIsUpload={setIsUpload}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* PDF URL input field */}
              <span className="mb-2 flex justify-center items-center text-primary font-bold text-lg">
                OR
              </span>
              <FormField
                control={form.control}
                name={"pdfUrl"}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Add PDF URL</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="PDF URL"
                        {...field}
                        disabled={loading || isUpload}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="admin-inputs-div">
            <FormField
              control={form.control}
              name={"title"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Title</FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Book title"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Transaction Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Book Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-none">
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"genre"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Book genre"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-8">
            <FormField
              control={form.control}
              name={"description"}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="text-base font-normal">
                    Book Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      required
                      placeholder="Book description"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="submit-btn" disabled={loading}>
            {book ? "Update Book" : "Add Book"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default BookForm;
