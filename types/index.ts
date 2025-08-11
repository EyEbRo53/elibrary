interface book {
  id: string;
  createdAt: Date | null;
  userId: string;
  status: "free" | "pro" | null;
  title: string;
  genre: string;
  coverUrl: string;
  pdfUrl: string;
  description: string;
  summary: string;
  user?: user;
  publisher?: publisher;
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
  description: string | null;
}

type FormType = "sign-in" | "sign-up";

interface Job {
  id: string;
  createdAt: Date | null;
  userId: string;
  pdfUrl: string | null;
  status: "processing" | "completed" | "failed" | null;
  topic: string;
  html: string | null;
  customCss: string | null;
}

interface PDFPageViewport {
  width: number;
  height: number;
}

interface RenderTask {
  promise: Promise<void>;
}

interface TextContent {
  items: { str: string }[];
}

interface PDFDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PDFPageProxy>;
  destroy: () => void;
}

interface PDFPageProxy {
  getViewport: (options: { scale: number }) => PDFPageViewport;
  render: (params: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PDFPageViewport;
  }) => RenderTask;
  getTextContent: () => Promise<TextContent>;
}
