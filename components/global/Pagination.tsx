"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function Pagination({
  noOfBooks,
  pageSize,
}: {
  noOfBooks: number;
  pageSize: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const totalPages = Math.ceil(noOfBooks / pageSize);
  const page = parseInt(searchParams.get("page") || "1");

  const handlePageChange = (newPage: number) => {
    if (!newPage || newPage < 1 || newPage > totalPages) return; // Prevent going out of bounds
    params.set("page", newPage.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 mt-4 justify-end">
      <Button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
        Previous
      </Button>
      <div className="flex items-center justify-center text-lg font-bold">
        Page {page} of {totalPages}
      </div>
      <Button
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages} // totalPages should come from props or state
      >
        Next
      </Button>
    </div>
  );
}
