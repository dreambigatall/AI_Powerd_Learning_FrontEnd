import React from "react";
import {
    Image,
    Video,
    Music,
    FileText,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import type { Material } from "./supabase/types";

export const fetchMaterials = async (session: Session | null): Promise<Material[]> => {
    if (!session) throw new Error("Not authenticated");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch materials");
    return response.json();
};

type FileVisuals = { icon: React.ReactElement; badge: string };

export const getFileVisuals = (fileType: string): FileVisuals => {
    if (fileType.startsWith("image")) return { icon: <Image className="h-6 w-6 text-blue-400" />, badge: "IMG" };
    if (fileType.startsWith("video")) return { icon: <Video className="h-6 w-6 text-purple-400" />, badge: "VID" };
    if (fileType.startsWith("audio")) return { icon: <Music className="h-6 w-6 text-pink-400" />, badge: "AUDIO" };
    if (fileType.includes("pdf")) return { icon: <FileText className="h-6 w-6 text-red-400" />, badge: "PDF" };
    return { icon: <FileText className="h-6 w-6 text-slate-400" />, badge: "FILE" };
};