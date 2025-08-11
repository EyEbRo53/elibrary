import type { Metadata } from "next";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

import "./globals.css";
import "../styles/admin.css";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Ebooks",
  description: "Ebooks",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" className="dark bg-black">
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.1/jspdf.umd.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      </head>
      <SessionProvider session={session}>
        <body className="blue-gradient-dark text-white hide-scrollbar">
          {/* Toaster */}
          <Toaster theme="dark" position="bottom-right" />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
