import { Input } from "@/components/ui/input";
import { Search, LayoutDashboard, FileText, BookOpen } from "lucide-react";
import { MaterialItem } from "./MaterialItem";
import type { Material } from "@/lib/supabase/types";

interface MaterialsListProps {
  materials: Material[];
  isLoading: boolean;
  error: Error | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export const MaterialsList = ({ materials, isLoading, error, searchTerm, setSearchTerm, onDelete, deletingId }: MaterialsListProps) => {
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
                    ))}
                </div>
            );
        }

        if (error) {
            return <p className="text-center text-red-500">Failed to load materials.</p>;
        }

        if (materials.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
                    <FileText className="h-12 w-12 text-slate-400" />
                    <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">
                        {searchTerm ? `No results for "${searchTerm}"` : "No materials uploaded yet"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {searchTerm ? "Try a different search term." : "Upload your first file to get started."}
                    </p>
                </div>
            );
        }

        return (
            <ul className="space-y-3">
                {materials.map((material) => (
                    <MaterialItem key={material._id} material={material} onDelete={onDelete} deletingId={deletingId} />
                ))}
            </ul>
        );
    };

    return (
        <section id="materials" className="animate-fadeIn">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-200">
                    <span className="rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 p-1.5 shadow-md">
                        <BookOpen className="h-7 w-7 text-white drop-shadow" />
                    </span>
                    Your Materials
                </h2>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Search materials..."
                        className="h-10 w-full rounded-lg border-slate-200 bg-white/80 pl-9 dark:border-slate-700 dark:bg-slate-800/80"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            {renderContent()}
        </section>
    );
};