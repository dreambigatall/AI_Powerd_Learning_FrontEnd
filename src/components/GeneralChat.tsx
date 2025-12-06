// src/components/GeneralChat.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSupabase } from '@/context/AuthContext';
import { toast } from 'sonner';
import Markdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, User, Bot, Sparkles, Trash2, ArrowUp } from 'lucide-react';
import type { ChatHistoryItem } from '@/lib/types/api';

interface Message {
  id: string;
  text: string;
  isUserMessage: boolean;
}

export default function GeneralChat() {
  const { supabase } = useSupabase();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  // Mutation for sending a message
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (currentMessages: Message[]) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated.");

      const userMessage = currentMessages[currentMessages.length - 1].text;
      
      // Convert messages to API format for history
      const history: ChatHistoryItem[] = currentMessages.slice(0, -1).map(msg => ({
        role: msg.isUserMessage ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/general`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ 
          message: userMessage, 
          history 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get a response.");
      }

      const data = await response.json();
      return data.response as string;
    },
    onSuccess: (answer) => {
      setMessages(prev => [...prev, { 
        id: `ai-${Date.now()}`, 
        text: answer, 
        isUserMessage: false 
      }]);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      // Remove the last user message on error
      setMessages(prev => prev.slice(0, -1));
    },
  });

  const handleSendMessage = () => {
    if (!input.trim() || isPending) return;

    const newMessages: Message[] = [
      ...messages, 
      { id: `user-${Date.now()}`, text: input, isUserMessage: true }
    ];
    setMessages(newMessages);
    sendMessage(newMessages);
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    toast.success("Chat cleared");
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      requestAnimationFrame(() => {
        scrollAreaRef.current?.scrollTo({ 
          top: scrollAreaRef.current.scrollHeight, 
          behavior: 'smooth' 
        });
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              AI Learning Assistant
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ask me anything about learning & education
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearChat}
            className="text-slate-500 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 mb-6 shadow-lg">
                <Sparkles className="h-12 w-12 text-violet-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                How can I help you learn today?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
                I&apos;m your AI learning assistant. Ask me about any topic, study strategies, or get help understanding complex concepts.
              </p>
              
              {/* Suggestion chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {[
                  { icon: "🧠", text: "Explain machine learning simply" },
                  { icon: "📚", text: "Best study techniques for exams" },
                  { icon: "⚛️", text: "What is quantum computing?" },
                  { icon: "💡", text: "How to learn programming faster" },
                ].map((suggestion) => (
                  <button
                    key={suggestion.text}
                    onClick={() => {
                      setInput(suggestion.text);
                      textareaRef.current?.focus();
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-left text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:border-violet-300 dark:hover:border-violet-700 transition-all group"
                  >
                    <span className="text-xl">{suggestion.icon}</span>
                    <span className="text-slate-600 dark:text-slate-300 group-hover:text-violet-700 dark:group-hover:text-violet-300">
                      {suggestion.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.isUserMessage ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUserMessage && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                    message.isUserMessage
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className={`prose prose-sm max-w-none ${
                    message.isUserMessage 
                      ? 'prose-invert prose-p:text-white prose-strong:text-white prose-headings:text-white' 
                      : 'dark:prose-invert'
                  }`}>
                    <Markdown>{message.text}</Markdown>
                  </div>
                </div>
                {message.isUserMessage && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {/* Thinking indicator */}
          {isPending && (
            <div className="flex gap-4 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* ChatGPT-style Input Area */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl shadow-lg focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-400/20 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Message AI Learning Assistant..."
              className="flex-1 resize-none bg-transparent px-4 py-4 pr-14 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none min-h-[56px] max-h-[200px]"
              rows={1}
              disabled={isPending}
            />
            <button
              onClick={handleSendMessage}
              disabled={isPending || !input.trim()}
              className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all ${
                input.trim() && !isPending
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-violet-600 hover:to-purple-700'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
            Press Enter to send • Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
