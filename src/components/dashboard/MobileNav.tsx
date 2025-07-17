import { UploadCloud, FileText, LogOut } from "lucide-react";

interface MobileNavProps {
  onLogout: () => void;
}

export const MobileNav = ({ onLogout }: MobileNavProps) => (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80 md:hidden">
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex flex-col items-center gap-1 text-xs text-slate-600 dark:text-slate-400"
        >
            <UploadCloud className="h-5 w-5" />
            <span>Upload</span>
        </button>
        <button
            onClick={() => document.getElementById("materials")?.scrollIntoView({ behavior: "smooth" })}
            className="flex flex-col items-center gap-1 text-xs text-slate-600 dark:text-slate-400"
        >
            <FileText className="h-5 w-5" />
            <span>Files</span>
        </button>
        <button onClick={onLogout} className="flex flex-col items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
        </button>
    </nav>
);