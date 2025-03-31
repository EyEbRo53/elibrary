import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const bookSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  genre: z.string().trim().min(2).max(50),
  coverUrl: z.string().nonempty(),
  pdfUrl: z.string().nonempty(),
  summary: z.string().trim().min(10),
  status: z.enum(["free", "pro"]),
});
