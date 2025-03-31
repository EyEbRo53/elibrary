interface book {
  id: string;
  createdAt: Date | null;
  //   userId: string;
  status: "free" | "pro" | null;
  title: string;
  genre: string;
  coverUrl: string;
  pdfUrl: string;
  description: string;
  summary: string;
}
