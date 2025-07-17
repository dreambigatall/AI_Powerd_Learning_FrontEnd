
"use client";

import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/context/AuthContext';
import { toast } from 'sonner';
import Markdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, User, Bot, Save, MessageSquare } from 'lucide-react';

// Type definitions for a single message in our chat
interface Message {
  id: string;
  text: string;
  isUserMessage: boolean;
}

interface ChatProps {
  materialId: string;
  savedChatContent: string | null;
}

export default function Chat({ materialId, savedChatContent }: ChatProps) {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();
  const [input, setInput] = useState('');
  
  // Initialize messages from saved content, or start with an empty array
  const [messages, setMessages] = useState<Message[]>(() => {
    if (savedChatContent) {
      try {
        return JSON.parse(savedChatContent);
      } catch (e) {
        console.error("Failed to parse saved chat content:", e);
        return [];
      }
    }
    return [];
  });
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mutation for sending a message (with history)
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (currentMessages: Message[]) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated.");

      const question = currentMessages[currentMessages.length - 1].text;
      const history = currentMessages.slice(0, -1).map(msg => ({
        role: msg.isUserMessage ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${materialId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ question, history }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get an answer.");
      }
      const data = await response.json();
      return data.answer as string;
    },
    onSuccess: (answer) => {
      setMessages(prev => [...prev, { id: `ai-${Date.now()}`, text: answer, isUserMessage: false }]);
    },
    onError: (error: any) => {
      toast.error(error.message);
      setMessages(prev => prev.slice(0, -1));
    },
  });

  // Mutation for saving the chat session
  const { mutate: saveChat, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (messages.length === 0) throw new Error("Nothing to save.");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated.");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materials/${materialId}/save-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ chatContent: JSON.stringify(messages) }),
      });
      if (!response.ok) throw new Error("Failed to save chat.");
    },
    onSuccess: () => {
      toast.success("Chat session saved!");
      queryClient.invalidateQueries({ queryKey: ['material', materialId] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const newMessages: Message[] = [...messages, { id: `user-${Date.now()}`, text: input, isUserMessage: true }];
    setMessages(newMessages);
    sendMessage(newMessages);
    setInput('');
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      requestAnimationFrame(() => {
        scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'auto' });
      });
    }
  }, [messages]);

  return (
    <Card className="flex-1 flex flex-col shadow-md border bg-background/95 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary/80" />
            Chat with your Document
        </CardTitle>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => saveChat()} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Chat
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground pt-10">
                <p>Ask a question about your document to get started.</p>
              </div>
            ) : (
              messages.map(message => (
                <div key={message.id} className={`flex gap-3 text-sm ${message.isUserMessage ? 'justify-end' : 'justify-start'}`}>
                  {!message.isUserMessage && <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"><Bot size={16}/></div>}
                  <div className={`prose dark:prose-invert rounded-lg px-3 py-2 max-w-sm ${message.isUserMessage ? 'bg-blue-600 text-white' : 'bg-muted'}`}>
                    <Markdown>{message.text}</Markdown>
                  </div>
                  {message.isUserMessage && <div className="bg-secondary text-secondary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"><User size={16}/></div>}
                </div>
              ))
            )}
             {isPending && (
                <div className="flex gap-3 justify-start animate-fade-in">
                   <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"><Loader2 size={16} className="animate-spin"/></div>
                   <div className="rounded-lg px-4 py-2 bg-muted"><p>Thinking...</p></div>
                </div>
             )}
          </div>
        </ScrollArea>
        
        <div className="flex-shrink-0 flex gap-2 items-center pt-4 border-t">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="flex-grow resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
            }}
            rows={1}
            disabled={isPending}
          />
          <Button onClick={handleSendMessage} disabled={isPending || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}