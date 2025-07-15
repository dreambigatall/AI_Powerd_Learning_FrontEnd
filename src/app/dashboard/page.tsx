// // // // // src/app/dashboard/page.tsx
// // // // "use client"; // We'll make it a client component for now to use the hook

// // // // import { useSupabase } from "@/context/AuthContext";
// // // // import { useRouter } from "next/navigation";
// // // // import { useEffect } from "react";
// // // // import { Button } from "@/components/ui/button";

// // // // export default function DashboardPage() {
// // // //   const { user, supabase } = useSupabase();
// // // //   const router = useRouter();

// // // //   // This effect will run when the component mounts or user state changes
// // // //   useEffect(() => {
// // // //     if (user === null) {
// // // //       router.push('/login');
// // // //     }
// // // //   }, [user, router]);
  
// // // //   const handleLogout = async () => {
// // // //     await supabase.auth.signOut();
// // // //     router.push('/'); // Redirect to home page on logout
// // // //     router.refresh();
// // // //   };

// // // //   if (!user) {
// // // //     return <div>Loading...</div>; // Or a spinner component
// // // //   }

// // // //   return (
// // // //     <div className="p-8">
// // // //       <div className="flex justify-between items-center">
// // // //         <h1 className="text-2xl font-bold">Dashboard</h1>
// // // //         <Button onClick={handleLogout}>Logout</Button>
// // // //       </div>
// // // //       <p className="mt-4">Welcome, {user.email}!</p>
// // // //       {/* This is where we will build the rest of our app */}
// // // //     </div>
// // // //   );
// // // // }

// // // // src/app/dashboard/page.tsx
// // // "use client";

// // // import { useSupabase } from "@/context/AuthContext";
// // // import { useRouter } from "next/navigation";
// // // import { useEffect } from "react";
// // // import { Button } from "@/components/ui/button";
// // // import FileUpload from "@/components/FileUpload";
// // // import { useQuery, useQueryClient } from "@tanstack/react-query";
// // // import type { Session } from "@supabase/supabase-js";

// // // // Define the type for our Material object based on the backend response
// // // interface Material {
// // //   _id: string;
// // //   fileName: string;
// // //   fileType: string;
// // //   createdAt: string;
// // // }

// // // // Function to fetch materials from our backend
// // // const fetchMaterials = async (session: Session | null): Promise<Material[]> => {
// // //   if (!session) throw new Error("Not authenticated");

// // //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
// // //     headers: {
// // //       'Authorization': `Bearer ${session.access_token}`,
// // //     },
// // //   });

// // //   if (!response.ok) {
// // //     throw new Error("Failed to fetch materials");
// // //   }
// // //   return response.json();
// // // };


// // // export default function DashboardPage() {
// // //   const { user, supabase } = useSupabase();
// // //   const router = useRouter();
// // //   const queryClient = useQueryClient();

// // //   // Redirect if not logged in
// // //   useEffect(() => {
// // //     if (user === null) {
// // //       router.push('/login');
// // //     }
// // //   }, [user, router]);
  
// // //   // Use TanStack Query to fetch data
// // //   const { data: materials, isLoading, error } = useQuery({
// // //     queryKey: ['materials', user?.id], // A unique key for this query
// // //     queryFn: () => supabase.auth.getSession().then(res => fetchMaterials(res.data.session)),
// // //     enabled: !!user, // Only run the query if the user exists
// // //   });

// // //   const handleLogout = async () => {
// // //     await supabase.auth.signOut();
// // //     router.push('/');
// // //     router.refresh();
// // //   };
  
// // //   // This function will be called from the FileUpload component on success
// // //   const onUploadSuccess = () => {
// // //     // This tells TanStack Query to refetch the 'materials' query
// // //     queryClient.invalidateQueries({ queryKey: ['materials', user?.id] });
// // //   };

// // //   if (!user) {
// // //     return <div>Loading...</div>;
// // //   }

// // //   return (
// // //     <div className="container mx-auto p-8">
// // //       <div className="flex justify-between items-center mb-8">
// // //         <div>
// // //           <h1 className="text-3xl font-bold">Your Dashboard</h1>
// // //           <p className="text-muted-foreground">Welcome back, {user.email}</p>
// // //         </div>
// // //         <Button onClick={handleLogout}>Logout</Button>
// // //       </div>

// // //       <div className="mb-8">
// // //         <h2 className="text-2xl font-semibold mb-4">Upload New Material</h2>
// // //         <FileUpload onUploadSuccess={onUploadSuccess} />
// // //       </div>

// // //       <div>
// // //         <h2 className="text-2xl font-semibold mb-4">Your Materials</h2>
// // //         {isLoading && <p>Loading materials...</p>}
// // //         {error && <p className="text-red-500">Error: {error.message}</p>}
// // //         {materials && materials.length > 0 ? (
// // //           <ul className="space-y-4">
// // //             {materials.map((material) => (
// // //               <li key={material._id} className="p-4 border rounded-lg flex justify-between items-center">
// // //                 <div>
// // //                   <p className="font-medium">{material.fileName}</p>
// // //                   <p className="text-sm text-muted-foreground">
// // //                     Uploaded on: {new Date(material.createdAt).toLocaleDateString()}
// // //                   </p>
// // //                 </div>
// // //                 {/* We'll add buttons here later */}
// // //               </li>
// // //             ))}
// // //           </ul>
// // //         ) : (
// // //           !isLoading && <p>You haven't uploaded any materials yet.</p>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // src/app/dashboard/page.tsx
// // "use client";

// // import { useSupabase } from "@/context/AuthContext";
// // import { useRouter } from "next/navigation";
// // import { useEffect } from "react";
// // import { Button } from "@/components/ui/button";
// // import FileUpload from "@/components/FileUpload";
// // import { useQuery, useQueryClient } from "@tanstack/react-query";
// // import type { Session } from "@supabase/supabase-js";
// // import Link from "next/link";

// // interface Material {
// //   _id: string;
// //   fileName: string;
// //   fileType: string;
// //   createdAt: string;
// // }

// // const fetchMaterials = async (session: Session | null): Promise<Material[]> => {
// //   if (!session) throw new Error("Not authenticated");
// //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
// //     headers: {
// //       'Authorization': `Bearer ${session.access_token}`,
// //     },
// //   });
// //   if (!response.ok) throw new Error("Failed to fetch materials");
// //   return response.json();
// // };

// // export default function DashboardPage() {
// //   // 1. DESTRUCTURE isLoading FROM THE HOOK
// //   const { user, supabase, isLoading } = useSupabase();
// //   const router = useRouter();
// //   const queryClient = useQueryClient();

// //   // 2. UPDATE THE REDIRECT LOGIC
// //   // This effect now waits for `isLoading` to be false before checking for a user.
// //   useEffect(() => {
// //     if (!isLoading && !user) {
// //       router.push('/login');
// //     }
// //   }, [user, isLoading, router]);
  
// //   const { data: materials, error, isLoading: materialsLoading } = useQuery({
// //     queryKey: ['materials', user?.id],
// //     queryFn: () => supabase.auth.getSession().then(res => fetchMaterials(res.data.session)),
// //     enabled: !!user && !isLoading, // Only run the query when auth is confirmed and user exists
// //   });

// //   const handleLogout = async () => {
// //     await supabase.auth.signOut();
// //     router.push('/');
// //     router.refresh();
// //   };
  
// //   const onUploadSuccess = () => {
// //     queryClient.invalidateQueries({ queryKey: ['materials', user?.id] });
// //   };

// //   // 3. ADD A GLOBAL LOADING STATE
// //   // Show this while the application is verifying the user's session.
// //   if (isLoading) {
// //     return (
// //       <div className="flex justify-center items-center min-h-screen">
// //         <p className="text-lg">Loading Application...</p>
// //       </div>
// //     );
// //   }

// //   // If loading is done but there's no user, the useEffect will redirect.
// //   // Returning null here prevents a brief flash of the dashboard UI.
// //   if (!user) {
// //     return null;
// //   }

// //   // The rest of the component remains the same.
// //   return (
// //     <div className="container mx-auto p-4 sm:p-8">
// //       <div className="flex justify-between items-center mb-8">
// //         <div>
// //           <h1 className="text-2xl sm:text-3xl font-bold">Your Dashboard</h1>
// //           <p className="text-muted-foreground">Welcome back, {user.email}</p>
// //         </div>
// //         <Button onClick={handleLogout}>Logout</Button>
// //       </div>

// //       <div className="mb-8">
// //         <h2 className="text-xl sm:text-2xl font-semibold mb-4">Upload New Material</h2>
// //         <FileUpload onUploadSuccess={onUploadSuccess} />
// //       </div>

// //       <div>
// //         <h2 className="text-xl sm:text-2xl font-semibold mb-4">Your Materials</h2>
// //         {materialsLoading && <p>Loading materials...</p>}
// //         {error && <p className="text-red-500">Error: {error.message}</p>}
// //         {materials && materials.length > 0 ? (
// //           <ul className="space-y-4">
// //           {materials.map((material) => (
// //             <li key={material._id}>
// //               <Link href={`/materials/${material._id}`}> {/* <-- Wrap with Link */}
// //                 <div className="p-4 border rounded-lg flex justify-between items-center hover:bg-muted transition-colors">
// //                   <div>
// //                     <p className="font-medium">{material.fileName}</p>
// //                     <p className="text-sm text-muted-foreground">
// //                       Uploaded on: {new Date(material.createdAt).toLocaleDateString()}
// //                     </p>
// //                   </div>
// //                   {/* We'll add buttons here later */}
// //                 </div>
// //               </Link>
// //             </li>
// //           ))}
// //         </ul>
// //         ) : (
// //           !materialsLoading && <p>You haven't uploaded any materials yet.</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // src/app/dashboard/page.tsx
// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useSupabase } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import Link from 'next/link';
// import { Button } from "@/components/ui/button";
// import FileUpload from "@/components/FileUpload";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import type { Session } from "@supabase/supabase-js";
// import { toast } from "sonner";
// import { Trash2, Loader2, FileText, UploadCloud } from "lucide-react";
// import ConfirmDialog from "@/components/ConfirmDialog";

// // Type definition for a single material object
// interface Material {
//   _id: string;
//   fileName: string;
//   fileType: string;
//   createdAt: string;
// }

// // Data fetching function for getting all materials
// const fetchMaterials = async (session: Session | null): Promise<Material[]> => {
//   if (!session) throw new Error("Not authenticated");
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
//     headers: {
//       'Authorization': `Bearer ${session.access_token}`,
//     },
//   });
//   if (!response.ok) throw new Error("Failed to fetch materials");
//   return response.json();
// };

// export default function DashboardPage() {
//   const { user, supabase, isLoading: authLoading } = useSupabase();
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   // Effect to handle redirecting if the user is not logged in
//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.push('/login');
//     }
//   }, [user, authLoading, router]);
  
//   // TanStack Query hook to fetch the user's materials
//   const { data: materials, isLoading: materialsLoading, error } = useQuery({
//     queryKey: ['materials', user?.id],
//     queryFn: () => supabase.auth.getSession().then(res => fetchMaterials(res.data.session)),
//     enabled: !!user && !authLoading,
//   });

//   // TanStack Mutation hook for deleting a material
//   const deleteMaterialMutation = useMutation({
//     mutationFn: async (materialId: string) => {
//       setDeletingId(materialId);
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) throw new Error("Not authenticated.");

//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${materialId}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${session.access_token}` },
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to delete material.");
//       }
//       return response.json();
//     },
//     onSuccess: () => {
//       toast.success("Material deleted successfully.");
//       queryClient.invalidateQueries({ queryKey: ['materials', user?.id] });
//     },
//     onError: (err: any) => {
//       toast.error(err.message);
//     },
//     onSettled: () => {
//       setDeletingId(null);
//     }
//   });

//   const handleDelete = (materialId: string) => {
//     deleteMaterialMutation.mutate(materialId);
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     router.push('/');
//     router.refresh();
//   };
  
//   const onUploadSuccess = () => {
//     queryClient.invalidateQueries({ queryKey: ['materials', user?.id] });
//   };

//   // Main loading state for the page while authentication is checked
//   if (authLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   // This check ensures we don't render anything for a logged-out user before redirecting
//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="container mx-auto p-4 sm:p-8">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold">Your Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back, {user.email}</p>
//         </div>
//         <Button onClick={handleLogout}>Logout</Button>
//       </div>

//       <div className="mb-12 p-6 border-2 border-dashed rounded-xl">
//         <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
//             <UploadCloud className="inline-block mr-2 h-6 w-6" />
//             Upload New Material
//         </h2>
//         <FileUpload onUploadSuccess={onUploadSuccess} />
//       </div>

//       <div>
//         <h2 className="text-xl sm:text-2xl font-semibold mb-4">
//             <FileText className="inline-block mr-2 h-6 w-6" />
//             Your Materials
//         </h2>
//         {materialsLoading && <p>Loading materials...</p>}
//         {error && <p className="text-red-500">Error: {error.message}</p>}
//         {materials && materials.length > 0 ? (
//           <ul className="space-y-3">
//             {materials.map((material) => (
//               <li key={material._id} className="border rounded-lg flex items-center group transition-shadow hover:shadow-md">
//                 <Link href={`/materials/${material._id}`} className="flex-grow p-4">
//                   <div className="hover:text-primary transition-colors">
//                     <p className="font-medium">{material.fileName}</p>
//                     <p className="text-sm text-muted-foreground">
//                       Uploaded on: {new Date(material.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </Link>

//                 <div className="p-2">
//                   <ConfirmDialog
//                     title="Are you absolutely sure?"
//                     description="This action cannot be undone. This will permanently delete the material and all of its generated AI content."
//                     onConfirm={() => handleDelete(material._id)}
//                     confirmText="Yes, delete it"
//                     trigger={
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
//                         disabled={deletingId === material._id}
//                         aria-label={`Delete ${material.fileName}`}
//                       >
//                         {deletingId === material._id ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <Trash2 className="h-4 w-4" />
//                         )}
//                       </Button>
//                     }
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           !materialsLoading && (
//             <div className="text-center py-10 border-2 border-dashed rounded-lg">
//                 <p className="text-muted-foreground">You haven't uploaded any materials yet.</p>
//                 <p className="text-sm text-muted-foreground mt-1">Use the uploader above to get started!</p>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// }

// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSupabase } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/FileUpload";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Trash2, Loader2, FileText, UploadCloud, Search, File, Image, Video, Music, BookOpen } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Material {
  _id: string;
  fileName: string;
  fileType: string;
  createdAt: string;
}

const fetchMaterials = async (session: Session | null): Promise<Material[]> => {
  if (!session) throw new Error("Not authenticated");
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
    headers: { 'Authorization': `Bearer ${session.access_token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch materials");
  return response.json();
};

// Helper to get icon by file type
const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image")) return <Image className="h-5 w-5 text-blue-400" />;
  if (fileType.startsWith("video")) return <Video className="h-5 w-5 text-purple-400" />;
  if (fileType.startsWith("audio")) return <Music className="h-5 w-5 text-pink-400" />;
  if (fileType.includes("pdf")) return <FileText className="h-5 w-5 text-red-400" />;
  return <File className="h-5 w-5 text-muted-foreground" />;
};

export default function DashboardPage() {
  const { user, supabase, isLoading: authLoading } = useSupabase();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);
  
  const { data: materials, isLoading: materialsLoading, error } = useQuery({
    queryKey: ['materials', user?.id],
    queryFn: () => supabase.auth.getSession().then(res => fetchMaterials(res.data.session)),
    enabled: !!user && !authLoading,
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: async (materialId: string) => {
      setDeletingId(materialId);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated.");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${materialId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete material.");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Material deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['materials', user?.id] });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
    onSettled: () => {
      setDeletingId(null);
    }
  });

  const handleDelete = (materialId: string) => {
    deleteMaterialMutation.mutate(materialId);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };
  
  const onUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['materials', user?.id] });
  };

  const filteredMaterials = useMemo(() => {
    if (!materials) return [];
    if (!searchTerm.trim()) return materials;
    return materials.filter(material =>
      material.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [materials, searchTerm]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-[#18181b] dark:via-[#23232a] dark:to-[#18181b]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#18181b]/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-8">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100">AI Learning</span>
          </div>
          <Button onClick={handleLogout} variant="outline" className="font-medium">Logout</Button>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl p-4 sm:p-8">
        <div className="mt-8 mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">Welcome back, <span className="text-blue-600 dark:text-blue-400">{user.email?.split('@')[0] || 'User'}</span></h1>
          <p className="text-muted-foreground text-base">Manage your study materials and uploads below.</p>
        </div>

        {/* Upload Card */}
        <section className="mb-12">
          <div className="rounded-2xl shadow-lg bg-white dark:bg-[#23232a] border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center text-center transition-shadow hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
              <UploadCloud className="inline-block h-7 w-7 text-blue-500" />
              Upload New Material
            </h2>
            <p className="text-muted-foreground mb-4">Supported: PDF, images, audio, video, docs</p>
            <FileUpload onUploadSuccess={onUploadSuccess} />
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center my-10">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
          <span className="mx-4 text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest">Your Materials</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
        </div>

        {/* Search and Materials List Card */}
        <section className="rounded-2xl shadow-lg bg-white dark:bg-[#23232a] border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <FileText className="inline-block h-6 w-6 text-blue-500" />
              Your Materials
            </h2>
            <div className="relative w-full sm:w-auto sm:min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search your materials..."
                className="pl-10 rounded-full bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {materialsLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
            </div>
          )}
          {error && <p className="text-red-500 text-center">Error: {error.message}</p>}

          {filteredMaterials && filteredMaterials.length > 0 ? (
            <ul className="space-y-3">
              {filteredMaterials.map((material) => (
                <li key={material._id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center group transition-shadow hover:shadow-md px-4 py-3">
                  <div className="mr-4 flex-shrink-0">{getFileIcon(material.fileType)}</div>
                  <Link href={`/materials/${material._id}`} className="flex-grow min-w-0">
                    <div className="hover:text-primary transition-colors">
                      <p className="font-medium truncate text-lg" title={material.fileName}>{material.fileName}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded on: {new Date(material.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                  <div className="p-2 flex-shrink-0">
                    <ConfirmDialog
                      title="Are you absolutely sure?"
                      description="This action cannot be undone. This will permanently delete the material and all of its generated AI content."
                      onConfirm={() => handleDelete(material._id)}
                      confirmText="Yes, delete it"
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={deletingId === material._id}
                          aria-label={`Delete ${material.fileName}`}
                        >
                          {deletingId === material._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            !materialsLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <FileText className="h-16 w-16 text-slate-300 mb-4" />
                {searchTerm ? (
                  <p className="text-muted-foreground text-lg">No materials found matching "{searchTerm}".</p>
                ) : (
                  <>
                    <p className="text-muted-foreground text-lg">You haven't uploaded any materials yet.</p>
                    <p className="text-sm text-muted-foreground mt-1">Use the uploader above to get started!</p>
                  </>
                )}
              </div>
            )
          )}
        </section>
      </main>
    </div>
  );
}