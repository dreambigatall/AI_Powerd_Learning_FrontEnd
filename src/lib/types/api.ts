// src/lib/types/api.ts

// ============================================
// General Chat Types
// ============================================
export interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface GeneralChatRequest {
  message: string;
  history?: ChatHistoryItem[];
}

export interface GeneralChatResponse {
  response: string;
  timestamp: string;
}

// ============================================
// Learning Path Types
// ============================================
export interface LearningStep {
  order: number;
  title: string;
  description: string;
  estimatedTime: string;
  resources: string[];
}

export interface LearningPath {
  overview: string;
  steps: LearningStep[];
  estimatedTotalTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';
  prerequisites: string[];
}

export interface LearningPathResponse {
  path: LearningPath;
  cached: boolean;
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GenerateLearningPathRequest {
  goals: string;
  preferences?: string;
}

// ============================================
// Concept Explanation Types
// ============================================
export interface Concept {
  concept: string;
  explanation: string;
  difficulty: number; // 1-5 scale
  examples: string[];
  prerequisites: string[];
}

export interface ExplainConceptsResponse {
  concepts: Concept[];
  language: string;
  cached: boolean;
  id: string;
}

export interface ExplainConceptsRequest {
  language?: string;
}

