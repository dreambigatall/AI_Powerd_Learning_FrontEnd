
"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import Link from "next/link";
import dynamic from 'next/dynamic';

// UI Components and Icons
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BrainCircuit, HelpCircle, MessageSquare, Loader2 } from "lucide-react";
import { FileText } from "lucide-react";

// Our Custom Components
import Quiz, { type QuizQuestion } from "@/components/Quiz";
import Chat from "@/components/Chat";
import Markdown from 'react-markdown'
// Dynamically import the PDF Viewer to prevent SSR issues
const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
});

// Type Definitions
interface GeneratedContent {
  _id: string;
  type: 'summary' | 'questions';
  content: string;
}

interface Material {
  _id: string;
  fileName: string;
  storagePath: string;
  fileType: string;
  createdAt: string;
  generatedContent: GeneratedContent[];
}

// Data Fetching Function
const fetchMaterialDetails = async (materialId: string, session: Session | null): Promise<Material> => {
  if (!session) throw new Error("Not authenticated");
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${materialId}`, {
    headers: { 'Authorization': `Bearer ${session.access_token}` },
  });
  if (!response.ok) {
    if (response.status === 404) throw new Error("Material not found.");
    if (response.status === 401) throw new Error("You are not authorized to view this material.");
    throw new Error("Failed to fetch material details.");
  }
  return response.json();
};

// CORRECTED: The 'async' keyword has been removed from this function definition.
export default function MaterialStudyPage() {
  const { user, supabase, isLoading: authLoading } = useSupabase();
  const params = useParams();
  const queryClient = useQueryClient();
  const materialId = Array.isArray(params.materialId)
    ? params.materialId[0]
    : params.materialId ?? "";
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Data Fetching
  // const { data: material, isLoading: isMaterialLoading, error } = useQuery({
  //   queryKey: ['material', materialId],
  //   queryFn: () => {
  //     if (!materialId) throw new Error("Material ID is required");
  //     return supabase.auth.getSession().then(res => fetchMaterialDetails(materialId, res.data.session));
  //   },
  //   enabled: !!user && !!materialId,
  // });
    // Data Fetching with Caching Optimization
    const { data: material, isLoading: isMaterialLoading, error } = useQuery({
      queryKey: ['material', materialId],
      queryFn: () => {
        if (!materialId) throw new Error("Material ID is required");
        return supabase.auth.getSession().then(res => fetchMaterialDetails(materialId as string, res.data.session));
      },
      enabled: !!user && !!materialId,
      
      // --- PERFORMANCE OPTIMIZATIONS ---
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
  });
  // Effect to get signed URL for PDF
  useEffect(() => {
    if (material?.storagePath) {
      let isMounted = true;
      const getUrl = async () => {
        try {
          const { data, error } = await supabase.storage
            .from('materials')
            .createSignedUrl(material.storagePath, 60 * 60);
          if (error) throw error;
          if (isMounted) setPdfUrl(data?.signedUrl || null);
        } catch (urlError: any) {
          console.error("Error getting signed URL:", urlError);
          toast.error("Could not get a link to the document file.");
          if (isMounted) setPdfUrl(null);
        }
      };
      getUrl();
      return () => { isMounted = false; };
    }
  }, [material]);

  // Data Transformations
  const summary = material?.generatedContent?.find(c => c.type === 'summary');
  const quizData = material?.generatedContent?.find(c => c.type === 'questions');
  const quizQuestions: QuizQuestion[] | null = quizData ? JSON.parse(quizData.content) : null;

  // AI Generation Mutations
  const generateSummaryMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication session expired.");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${materialId}/summarize`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (!response.ok) throw new Error('Failed to generate summary.');
      return response.json();
    },
    onSuccess: () => {
      toast.success("AI summary has been generated.");
      queryClient.invalidateQueries({ queryKey: ['material', materialId] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const generateQuizMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${materialId}/generate-quiz`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate quiz.');
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("AI quiz has been generated.");
      queryClient.invalidateQueries({ queryKey: ['material', materialId] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleGenerateSummary = () => generateSummaryMutation.mutate();
  const handleGenerateQuiz = () => generateQuizMutation.mutate();

  // Loading & Error States
  if (authLoading || isMaterialLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-4 text-muted-foreground">Loading Study Session...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-red-500 mb-4">Error: {error.message}</p>
        <Link href="/dashboard"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Go Back</Button></Link>
      </div>
    );
  }
  if (!material) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-muted-foreground mb-4">Material could not be loaded.</p>
        <Link href="/dashboard"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Go Back</Button></Link>
      </div>
    );
  }

  // Main Render
  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-muted/30 to-background">
      {/* Sticky Header */}
      <header className="sticky top-0 flex-shrink-0 bg-background/95 border-b z-20 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-all">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4 min-w-0">
          <Link href="/dashboard" aria-label="Back to Dashboard">
            <Button variant="ghost" size="icon" className="rounded-full border border-muted-foreground/10 shadow-sm hover:bg-muted/40">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold truncate" title={material.fileName}>{material.fileName}</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-6 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        {/* PDF Viewer Section */}
        <section className="flex flex-col min-h-0">
          <Card className="flex-grow shadow-lg border bg-background/90">
            <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b">
              <FileText className="h-5 w-5 text-primary/80" />
              <CardTitle className="text-base font-semibold">Original Document</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-center p-0">
              {pdfUrl ? (
                <div className="w-full h-[420px] md:h-[520px] bg-muted/40 rounded-b-lg overflow-hidden transition-all">
                  <PdfViewer fileUrl={pdfUrl} />
                </div>
              ) : (
                <div className="w-full h-[420px] md:h-[520px] flex flex-col items-center justify-center text-center bg-muted/40 rounded-b-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Preparing document...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* AI Content Section */}
        <section className="flex flex-col min-h-0">
          <Tabs defaultValue="summary" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 flex-shrink-0 mb-2 bg-background/80 border rounded-lg shadow-sm">
              <TabsTrigger
                value="summary"
                className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:font-bold data-[state=active]:scale-105 transition-all"
              >
                <BrainCircuit className="mr-1 h-4 w-4" />Summary
              </TabsTrigger>
              <TabsTrigger
                value="quiz"
                className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:font-bold data-[state=active]:scale-105 transition-all"
              >
                <HelpCircle className="mr-1 h-4 w-4" />Quiz
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:font-bold data-[state=active]:scale-105 transition-all"
                aria-label="Chat (coming soon)"
              >
                <MessageSquare className="mr-1 h-4 w-4" />Chat
              </TabsTrigger>
            </TabsList>

            <div className="mt-2 flex-grow overflow-y-auto pr-0 md:pr-2">
              {/* Summary Tab */}
              <TabsContent value="summary">
                <Card className="shadow-md border bg-background/95 transition-all">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b">
                    <BrainCircuit className="h-5 w-5 text-primary/80" />
                    <CardTitle className="text-base font-semibold">AI Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {summary ? (
                      // <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/90 animate-fade-in">
                        <Markdown>
                        {summary.content}
                        </Markdown>
                       
                      // </p>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                        <BrainCircuit className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground mb-4">No summary yet. Generate an AI summary for this document.</p>
                        <Button onClick={handleGenerateSummary} disabled={generateSummaryMutation.isPending} size="lg" className="font-semibold">
                          {generateSummaryMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : 'Generate Summary'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quiz Tab */}
              <TabsContent value="quiz">
                {quizQuestions ? (
                  <Card className="shadow-md border bg-background/95 transition-all">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b">
                      <HelpCircle className="h-5 w-5 text-primary/80" />
                      <CardTitle className="text-base font-semibold">AI-Generated Quiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Quiz questions={quizQuestions} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-md border bg-background/95 transition-all">
                    <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b">
                      <HelpCircle className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-base font-semibold">AI-Generated Quiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                        <HelpCircle className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground mb-4">No quiz generated yet. Create a quiz to test your knowledge.</p>
                        <Button onClick={handleGenerateQuiz} disabled={generateQuizMutation.isPending} size="lg" className="font-semibold">
                          {generateQuizMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Quiz...</> : 'Generate Quiz'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Chat Tab */}
              <TabsContent value="chat">
                <Card className="shadow-md border bg-background/95 transition-all">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2 border-b">
                    <MessageSquare className="h-5 w-5 text-primary/80" />
                    <CardTitle className="text-base font-semibold">Chat with your Document</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {materialId && <Chat materialId={materialId} />}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </section>
      </main>
    </div>
  );
}