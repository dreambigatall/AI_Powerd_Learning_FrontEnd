// src/app/page.tsx
"use client";

import { useSupabase } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { UploadCloud, FileText, HelpCircle, MessageSquare, Loader2 } from "lucide-react";

// This is the component that contains the actual landing page content
function LandingPageContent() {
  const features = [
    {
      icon: <UploadCloud className="h-8 w-8 text-primary" />,
      title: "Upload Anything",
      description: "Simply upload your study materials in PDF, DOCX, or TXT format and let our AI do the rest.",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Instant Summaries",
      description: "Get concise, AI-generated summaries of your documents to grasp key concepts in seconds.",
    },
    {
      icon: <HelpCircle className="h-8 w-8 text-primary" />,
      title: "Auto-Generated Quizzes",
      description: "Test your knowledge with interactive quizzes created automatically from your content.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Chat with your Docs",
      description: "Ask specific questions and get instant answers based directly on your uploaded materials.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-background to-muted/40">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Unlock Your Study Potential with AI
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Transform your documents into interactive learning experiences. Get summaries, quizzes, and answers instantly.
            </p>
            <div className="mt-6 space-x-4">
              <Button asChild size="lg">
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Learn Smarter, Not Harder</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides the tools you need to deeply understand your study materials.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 mt-12">
              {features.map((feature) => (
                 <div key={feature.title} className="flex gap-4">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div className="grid gap-1">
                      <h3 className="text-lg font-bold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                 </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 AI Learning. All rights reserved.</p>
      </footer>
    </div>
  );
}


// This is the main page component that handles the redirect logic
export default function HomePage() {
  const { user, isLoading } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    // If the user session is loaded and a user exists, redirect to the dashboard
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  // While checking for a session, show a loading screen
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If loading is done and there's no user, show the landing page
  if (!user) {
    return <LandingPageContent />;
  }

  // Fallback for the brief moment before redirect
  return null;
}