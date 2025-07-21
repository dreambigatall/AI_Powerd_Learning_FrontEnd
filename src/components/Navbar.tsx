// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useSupabase } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { BrainCircuit, BookOpen } from "lucide-react";

export default function Navbar() {
  const { user, isLoading } = useSupabase();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 p-1.5 shadow-md flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white drop-shadow " />
            </span>
            <span className="font-bold">AI Learning</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}