// src/components/LearningPath.tsx
"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2, 
  Route, 
  Target, 
  Clock, 
  BookOpen, 
  ChevronRight,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { LearningPath as LearningPathType, LearningPathResponse } from '@/lib/types/api';

export default function LearningPath() {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();
  const [goals, setGoals] = useState('');
  const [preferences, setPreferences] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Fetch existing learning path
  const { data: pathData, isLoading, error } = useQuery<LearningPathResponse>({
    queryKey: ['learning-path'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/learning-path`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.status === 404) {
        return null as unknown as LearningPathResponse;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch learning path");
      }

      return response.json();
    },
  });

  // Generate new learning path
  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!goals.trim()) throw new Error("Learning goals are required");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/learning-path/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          goals,
          preferences: preferences || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate learning path");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Learning path generated successfully!");
      queryClient.invalidateQueries({ queryKey: ['learning-path'] });
      setShowForm(false);
      setGoals('');
      setPreferences('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleGenerate = () => {
    if (!goals.trim()) {
      toast.error("Please enter your learning goals");
      return;
    }
    generateMutation.mutate();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-slate-500 dark:text-slate-400">Loading your learning path...</p>
      </div>
    );
  }

  // Show form if no path exists or user wants to create new
  if (!pathData || showForm) {
    return (
      <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6 border-b border-slate-200 dark:border-slate-700">
          <div className="mx-auto p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg mb-4 w-fit">
            <Route className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {showForm ? 'Create New Learning Path' : 'Create Your Learning Path'}
            </span>
          </CardTitle>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Tell us your goals and we&apos;ll create a personalized roadmap for you
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="goals" className="text-sm font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-500" />
              Learning Goals *
            </Label>
            <Textarea
              id="goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="e.g., I want to master full-stack web development with React and Node.js"
              rows={4}
              className="resize-none border-slate-200 dark:border-slate-700 focus:border-emerald-400 focus:ring-emerald-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferences" className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-500" />
              Preferences (Optional)
            </Label>
            <Textarea
              id="preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g., Focus on hands-on projects, prefer video tutorials, have 2 hours daily"
              rows={3}
              className="resize-none border-slate-200 dark:border-slate-700 focus:border-emerald-400 focus:ring-emerald-400"
            />
          </div>
          <div className="flex gap-3 pt-2">
            {showForm && (
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending || !goals.trim()}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Learning Path
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Display existing learning path
  const path = pathData.path;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden">
        <CardContent className="pt-6 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Route className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Your Learning Path</h2>
                  <p className="text-emerald-100 text-sm">Personalized just for you</p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowForm(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Path
              </Button>
            </div>

            <p className="text-emerald-50 mb-6 leading-relaxed">{path.overview}</p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{path.estimatedTotalTime}</span>
              </div>
              <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${getDifficultyColor(path.difficulty)}`}>
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{path.difficulty}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">{path.steps.length} Steps</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prerequisites */}
      {path.prerequisites.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-amber-500" />
              Prerequisites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {path.prerequisites.map((prereq, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium"
                >
                  {prereq}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Steps */}
      <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-500" />
            Learning Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="p-6 space-y-6">
              {path.steps.map((step, index) => (
                <div key={step.order} className="relative">
                  {/* Connector Line */}
                  {index < path.steps.length - 1 && (
                    <div className="absolute left-5 top-14 w-0.5 h-[calc(100%-20px)] bg-gradient-to-b from-emerald-400 to-teal-400" />
                  )}
                  
                  <div className="flex gap-4">
                    {/* Step Number */}
                    <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      {step.order}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                          {step.title}
                        </h3>
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 rounded-full px-2 py-1">
                          <Clock className="h-3 w-3" />
                          {step.estimatedTime}
                        </span>
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                        {step.description}
                      </p>

                      {step.resources.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                            Resources
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {step.resources.map((resource, rIdx) => (
                              <span
                                key={rIdx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                              >
                                <ChevronRight className="h-3 w-3" />
                                {resource}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Progress Section */}
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Your Progress
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              0 / {path.steps.length} completed
            </span>
          </div>
          <Progress value={0} className="h-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Start your journey by completing the first step!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

