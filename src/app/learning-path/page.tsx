// src/app/learning-path/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import LearningPath from "@/components/LearningPath";

export default function LearningPathPage() {
  const { user, supabase, isLoading: authLoading } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 dark:from-slate-900 dark:via-emerald-950/20 dark:to-teal-950/10">
      <Sidebar onLogout={handleLogout} />
      <MobileNav onLogout={handleLogout} />

      <main className="md:ml-64 min-h-screen">
        <div className="p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                Learning Path
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Your personalized roadmap to mastery
              </p>
            </div>

            <LearningPath />
          </div>
        </div>
      </main>
    </div>
  );
}

