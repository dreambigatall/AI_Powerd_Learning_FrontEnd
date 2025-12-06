// src/components/ConceptExplainer.tsx
"use client";

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, 
  Lightbulb, 
  Languages, 
  AlertTriangle,
  BookOpen,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import type { Concept, ExplainConceptsResponse } from '@/lib/types/api';

interface ConceptExplainerProps {
  materialId: string;
  savedConceptsContent?: string | null;
}

const LANGUAGES = [
  { code: 'English', label: 'English', flag: '🇺🇸' },
  { code: 'Amharic', label: 'አማርኛ', flag: '🇪🇹' },
  { code: 'Afan Oromo', label: 'Afaan Oromoo', flag: '🇪🇹' },
];

export default function ConceptExplainer({ materialId, savedConceptsContent }: ConceptExplainerProps) {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Parse saved concepts if available
  const [concepts, setConcepts] = useState<Concept[] | null>(() => {
    if (savedConceptsContent) {
      try {
        return JSON.parse(savedConceptsContent);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(
    savedConceptsContent ? 'English' : null
  );

  // Mutation for generating concept explanations
  const { mutate: explainConcepts, isPending } = useMutation({
    mutationFn: async (): Promise<ExplainConceptsResponse> => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/materials/${materialId}/explain-concepts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ language: selectedLanguage }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to explain concepts.");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setConcepts(data.concepts);
      setCurrentLanguage(data.language);
      toast.success(`Concepts explained in ${data.language}!`);
      queryClient.invalidateQueries({ queryKey: ['material', materialId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400';
    if (difficulty <= 3) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400';
    if (difficulty <= 4) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy';
    if (difficulty <= 3) return 'Medium';
    if (difficulty <= 4) return 'Hard';
    return 'Very Hard';
  };

  const selectedLang = LANGUAGES.find(l => l.code === selectedLanguage) || LANGUAGES[0];

  return (
    <Card className="flex-1 flex flex-col shadow-md border bg-background/95 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Explain Hard Concepts
        </CardTitle>
        
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
          >
            <Languages className="h-4 w-4 text-slate-500" />
            <span>{selectedLang.flag}</span>
            <span className="hidden sm:inline">{selectedLang.label}</span>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl z-20 py-1 max-h-64 overflow-y-auto">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                      selectedLanguage === lang.code ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : ''
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
        {!concepts ? (
          // No concepts yet - show generate button
          <div className="flex flex-col items-center justify-center py-10 text-center flex-1">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 mb-4">
              <Lightbulb className="h-10 w-10 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Discover Hard Concepts
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
              AI will analyze your document and explain the most challenging concepts in {selectedLanguage}.
            </p>
            <Button
              onClick={() => explainConcepts()}
              disabled={isPending}
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Document...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Explain Concepts
                </>
              )}
            </Button>
          </div>
        ) : (
          // Display concepts
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{concepts.length}</span> concepts identified
                {currentLanguage && <span> • Explained in {currentLanguage}</span>}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => explainConcepts()}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Languages className="h-4 w-4 mr-1" />
                    Re-explain in {selectedLanguage}
                  </>
                )}
              </Button>
            </div>

            <ScrollArea className="flex-1 pr-4 -mr-4">
              <div className="space-y-4 pb-4">
                {concepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                  >
                    {/* Concept Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                        {concept.concept}
                      </h4>
                      <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(concept.difficulty)}`}>
                        {getDifficultyLabel(concept.difficulty)} ({concept.difficulty}/5)
                      </span>
                    </div>

                    {/* Explanation */}
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {concept.explanation}
                    </p>

                    {/* Examples */}
                    {concept.examples.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          Examples
                        </p>
                        <ul className="space-y-2">
                          {concept.examples.map((example, exIdx) => (
                            <li
                              key={exIdx}
                              className="text-sm text-slate-600 dark:text-slate-400 pl-4 border-l-2 border-amber-400"
                            >
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prerequisites */}
                    {concept.prerequisites.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Prerequisites
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {concept.prerequisites.map((prereq, preqIdx) => (
                            <span
                              key={preqIdx}
                              className="px-2.5 py-1 rounded-md text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                            >
                              {prereq}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

