import Link from "next/link";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Loader2, Trash2 } from "lucide-react";
import { getFileVisuals } from "@/lib/helpers";
import type { Material } from "@/lib/supabase/types";

interface MaterialItemProps {
  material: Material;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export const MaterialItem = ({ material, onDelete, deletingId }: MaterialItemProps) => {
    const { icon, badge } = getFileVisuals(material.fileType);

    return (
        <li className="group relative flex items-center p-4 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-md transition-all duration-300 hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-blue-500">
            <div className="flex items-center gap-4 flex-grow">
                {icon}
                <div className="flex-grow">
                    <Link href={`/materials/${material._id}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{material.fileName}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(material.createdAt).toLocaleDateString()}
                        </p>
                    </Link>
                </div>
            </div>
            <div className="relative z-10 flex items-center gap-2">
                <span className="px-2 py-1 rounded-md text-xs font-bold uppercase bg-slate-100 dark:bg-slate-800">
                    {badge}
                </span>
                <ConfirmDialog
                    title="Delete Material?"
                    description="This action cannot be undone. All associated data will be permanently removed."
                    onConfirm={() => onDelete(material._id)}
                    confirmText="Delete"
                    trigger={
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={deletingId === material._id}
                            className="h-8 w-8 rounded-full text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/50"
                        >
                            {deletingId === material._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </Button>
                    }
                />
            </div>
        </li>
    );
};