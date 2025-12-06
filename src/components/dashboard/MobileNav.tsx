"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LogOut, Sparkles, Route } from "lucide-react";

interface MobileNavProps {
  onLogout: () => void;
}

export const MobileNav = ({ onLogout }: MobileNavProps) => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/chat",
      label: "AI Chat",
      icon: Sparkles,
      activeColor: "text-violet-600 dark:text-violet-400",
    },
    {
      href: "/dashboard",
      label: "Materials",
      icon: FileText,
      activeColor: "text-blue-600 dark:text-blue-400",
    },
    {
      href: "/learning-path",
      label: "Path",
      icon: Route,
      activeColor: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80 md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-xs transition-colors ${
              isActive
                ? item.activeColor
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className={isActive ? "font-semibold" : ""}>{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={onLogout}
        className="flex flex-col items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </nav>
  );
};
