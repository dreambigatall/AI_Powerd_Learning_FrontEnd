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
    // eslint-disable-next-line jsx-a11y/alt-text
    if (fileType.startsWith("image")) return { icon: <Image className="h-6 w-6 text-blue-400" aria-hidden="true" />, badge: "IMG" };
    // eslint-disable-next-line jsx-a11y/alt-text
    if (fileType.startsWith("video")) return { icon: <Video className="h-6 w-6 text-purple-400" aria-hidden="true" />, badge: "VID" };
    // eslint-disable-next-line jsx-a11y/alt-text
    if (fileType.startsWith("audio")) return { icon: <Music className="h-6 w-6 text-pink-400" aria-hidden="true" />, badge: "AUDIO" };
    // eslint-disable-next-line jsx-a11y/alt-text
    if (fileType.includes("pdf")) return { icon: <FileText className="h-6 w-6 text-red-400" aria-hidden="true" />, badge: "PDF" };
    // eslint-disable-next-line jsx-a11y/alt-text
    return { icon: <FileText className="h-6 w-6 text-slate-400" aria-hidden="true" />, badge: "FILE" };
};