// src/app/chat/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import GeneralChat from "@/components/GeneralChat";

export default function ChatPage() {
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
        <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20 dark:from-slate-900 dark:via-violet-950/20 dark:to-purple-950/10">
      <Sidebar onLogout={handleLogout} />
      <MobileNav onLogout={handleLogout} />

      {/* Full height chat container */}
      <main className="md:ml-64 h-screen flex flex-col pb-16 md:pb-0">
        <GeneralChat />
      </main>
    </div>
  );
}
