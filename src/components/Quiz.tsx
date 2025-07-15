// src/components/Quiz.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, BrainCircuit } from "lucide-react";

// Define the structure of a single question object
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  questions: QuizQuestion[];
}

export default function Quiz({ questions }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
  };
  
  if (isFinished) {
    const score = questions.reduce((total, question, index) => {
      return total + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    const scorePercentage = (score / questions.length) * 100;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-4xl font-bold mb-2">
            {score} / {questions.length}
          </p>
          <p className="text-lg text-muted-foreground mb-6">You scored {scorePercentage.toFixed(0)}%</p>
          <div className="space-y-4 text-left">
            {questions.map((q, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <p className="font-semibold">{i + 1}. {q.question}</p>
                <div className="flex items-center mt-2">
                  {selectedAnswers[i] === q.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm">Your answer: {selectedAnswers[i] || "No answer"}</p>
                    {selectedAnswers[i] !== q.correctAnswer && (
                       <p className="text-sm text-green-600">Correct answer: {q.correctAnswer}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleRestart} className="mt-8">Take Quiz Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><BrainCircuit className="mr-2 h-5 w-5" />AI-Generated Quiz</CardTitle>
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mt-1" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-semibold text-lg mb-6">{currentQuestion.question}</p>
        <RadioGroup
          value={selectedAnswers[currentQuestionIndex]}
          onValueChange={handleAnswerSelect}
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
            </div>
          ))}
        </RadioGroup>
        <Button 
          onClick={handleNext} 
          disabled={!selectedAnswers[currentQuestionIndex]}
          className="w-full mt-6"
        >
          {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </CardContent>
    </Card>
  );
}