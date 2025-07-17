import FileUpload from "@/components/FileUpload";
import { UploadCloud } from "lucide-react";

interface UploadCardProps {
  onUploadSuccess: () => void;
}

export const UploadCard = ({ onUploadSuccess }: UploadCardProps) => (
    <section className="mb-16 animate-fadeIn rounded-2xl border border-slate-200 bg-white/60 p-6 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-4 text-slate-800 dark:text-slate-200">
            <UploadCloud className="h-6 w-6 text-blue-500" />
            Upload New Material
        </h2>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Supports PDF, images, audio, video, and other document formats.
        </p>
        <FileUpload onUploadSuccess={onUploadSuccess} />
    </section>
);