import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, UploadCloud, FileText, LogOut } from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar = ({ onLogout }: SidebarProps) => (
    <aside className="fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col justify-between border-r border-slate-200 bg-white/70 p-6 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/70 md:flex">
        <div>
            <Link href="/" className="flex items-center gap-2 mb-10">
                <BookOpen className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
                    AI Learning
                </span>
            </Link>
            <nav className="space-y-2">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-blue-100 dark:hover:bg-blue-900/50"
                >
                    <UploadCloud className="h-5 w-5" />
                    <span>Upload</span>
                </button>
                <button
                    onClick={() => document.getElementById("materials")?.scrollIntoView({ behavior: "smooth" })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-purple-100 dark:hover:bg-purple-900/50"
                >
                    <FileText className="h-5 w-5" />
                    <span>Materials</span>
                </button>
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