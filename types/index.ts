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

interface user {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  password: string | null;
  role: "user" | "admin" | "publisher" | null;
  emailVerified: Date | null;
  createdAt: Date | null;
}

interface publisher {
  id: string;
  name: string | null;
  image: string | null;
  createdAt: Date | null;
  userId: string;
}

type FormType = "sign-in" | "sign-up";
