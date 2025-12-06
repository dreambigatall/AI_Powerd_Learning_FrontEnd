"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, LogOut, Sparkles, Route } from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar = ({ onLogout }: SidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/chat",
      label: "AI Chat",
      icon: Sparkles,
      color: "hover:bg-violet-100 dark:hover:bg-violet-900/50",
      activeColor: "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300",
    },
    {
      href: "/dashboard",
      label: "Materials",
      icon: FileText,
      color: "hover:bg-blue-100 dark:hover:bg-blue-900/50",
      activeColor: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
    },
    {
      href: "/learning-path",
      label: "Learning Path",
      icon: Route,
      color: "hover:bg-emerald-100 dark:hover:bg-emerald-900/50",
      activeColor: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
    },
  ];

  return (
    <aside className="fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col justify-between border-r border-slate-200 bg-white/70 p-6 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/70 md:flex">
      <div>
        <Link href="/" className="flex items-center gap-2 mb-10">
          <BookOpen className="h-8 w-8 text-blue-500" />
          <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
            AI Learning
          </span>
        </Link>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-base font-semibold transition-all ${
                  isActive
                    ? item.activeColor
                    : `text-slate-700 dark:text-slate-300 ${item.color}`
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.href === "/chat" && (
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r from-violet-500 to-purple-500 text-white px-1.5 py-0.5 rounded">
                    New
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <Button
        onClick={onLogout}
        variant="ghost"
        className="w-full justify-start gap-3 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </Button>
    </aside>
  );
};
