

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { fetchMaterials } from "@/lib/helpers";


import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { UploadCard } from "@/components/dashboard/UploadCard";
import { MaterialsList } from "@/components/dashboard/MaterialsList";

export default function DashboardPage() {
    const { user, supabase, isLoading: authLoading } = useSupabase();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!authLoading && !user) router.push("/login");
    }, [user, authLoading, router]);

    const { data: materials, isLoading: materialsLoading, error } = useQuery({
        queryKey: ["materials", user?.id],
        queryFn: () => supabase.auth.getSession().then((res) => fetchMaterials(res.data.session)),
        enabled: !!user && !authLoading,
    });

    const deleteMaterialMutation = useMutation({
        mutationFn: async (materialId: string) => {
            setDeletingId(materialId);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Not authenticated.");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${materialId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${session.access_token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete material.");
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success("Material deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["materials", user?.id] });
        },
        onError: (err: any) => toast.error(err.message),
        onSettled: () => setDeletingId(null),
    });

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    const filteredMaterials = useMemo(() => {
        if (!materials) return [];
        if (!searchTerm.trim()) return materials;
        return materials.filter((m) => m.fileName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [materials, searchTerm]);

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <>
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
            `}</style>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <Sidebar onLogout={handleLogout} />
                <MobileNav onLogout={handleLogout} />

                <main className="mx-auto max-w-4xl px-4 pb-24 pt-8 md:ml-72 md:pt-12">
                    <Header user={user} />
                    <UploadCard onUploadSuccess={() => queryClient.invalidateQueries({ queryKey: ["materials", user?.id] })} />
                    <MaterialsList
                        materials={filteredMaterials || []}
                        isLoading={materialsLoading}
                        error={error as Error | null}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onDelete={deleteMaterialMutation.mutate}
                        deletingId={deletingId}
                    />
                </main>
            </div>
        </>
    );
}