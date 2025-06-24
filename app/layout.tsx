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
    <html lang="en" className="dark text-white">
      <head>
        <script src="https://acrobatservices.adobe.com/view-sdk/viewer.js"></script>
      </head>
      <SessionProvider session={session}>
        <body className="bg-black hide-scrollbar">
          {/* Toaster */}
          <Toaster theme="dark" position="bottom-right" />
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
