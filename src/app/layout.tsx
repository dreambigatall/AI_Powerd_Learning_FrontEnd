// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SupabaseProvider from "@/context/AuthContext"; // <-- Import
import { Toaster } from "sonner";
import QueryProvider from "@/context/QueryProvider"; // <-- Import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Learning Platform",
  description: "Your personal AI-powered study partner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <SupabaseProvider>
        <QueryProvider>
          
            {children}
          
        </QueryProvider>
        </SupabaseProvider>
        <Toaster />
      </body>
    </html>
  );
}