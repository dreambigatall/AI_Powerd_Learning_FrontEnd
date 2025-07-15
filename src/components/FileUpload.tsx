// src/components/FileUpload.tsx
"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSupabase } from '@/context/AuthContext';
import { toast } from 'sonner';
export default function FileUpload({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const { supabase, user } = useSupabase();
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles[0] || !user) return;

    setIsUploading(true);
    const file = acceptedFiles[0];
    const fileExt = file.name.split('.').pop();
    // Path in Supabase storage: user_id/filename_with_timestamp.ext
    // const filePath = `${user.id}/${file.name.replace(/\.[^/.]+$/, "")}_${Date.now()}.${fileExt}`;
    const filePath = `private/${user.id}/${file.name.replace(/\.[^/.]+$/, "")}_${Date.now()}.${fileExt}`;
    console.log("Uploading to path:", filePath); // Add this log to see the new path
    try {
      // Step 1: Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('materials') // Make sure this is your bucket name
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      
      toast.success("File Uploaded to Storage", { description: "Now processing..." });

      // Step 2: Call our backend to create the material record
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // We need to send the user's auth token to our backend
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          storagePath: filePath,
          fileType: fileExt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create material record in backend.');
      }
      
      toast.success("Success!", { description: "Your material is ready." });
      onUploadSuccess(); // Notify the parent component to refetch data

    } catch (error: any) {
      console.error('Upload or processing error:', error);
      toast.error("Error", { description: error.message || "Something went wrong." });
    } finally {
      setIsUploading(false);
    }
  }, [user, supabase, toast, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
      ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <p>Uploading...</p>
      ) : isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag 'n' drop a PDF, DOCX, or TXT file here, or click to select</p>
      )}
    </div>
  );
}