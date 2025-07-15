// // src/components/Chat.tsx
// "use client";

// import { useState, useRef, useEffect } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import { useSupabase } from '@/context/AuthContext';
// import { toast } from 'sonner';

// // UI Components
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Loader2, Send, User, Bot } from 'lucide-react';
// import Markdown from 'react-markdown';
// // Type definitions for a single message in our chat
// interface Message {
//   id: string;
//   text: string;
//   isUserMessage: boolean;
// }

// interface ChatProps {
//   materialId: string;
// }

// export default function Chat({ materialId }: ChatProps) {
//   const { supabase } = useSupabase();
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState<Message[]>([]);
  
//   // A ref to automatically scroll to the bottom of the chat
//   const scrollAreaRef = useRef<HTMLDivElement>(null);

//   // --- The Mutation to call our backend's chat endpoint ---
//   const { mutate: sendMessage, isPending } = useMutation({
//     mutationFn: async (question: string) => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (!session) throw new Error("Not authenticated.");

//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/${materialId}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${session.access_token}`,
//         },
//         body: JSON.stringify({ question }),
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to get an answer.");
//       }
//       const data = await response.json();
//       return data.answer as string;
//     },
//     onSuccess: (answer) => {
//       // Add the AI's response to the message list
//       setMessages(prev => [
//         ...prev,
//         { id: `ai-${Date.now()}`, text: answer, isUserMessage: false }
//       ]);
//     },
//     onError: (error) => {
//       toast.error(error.message);
//       // Optional: remove the user's message if the API call fails
//       setMessages(prev => prev.slice(0, -1));
//     },
//   });

//   const handleSendMessage = () => {
//     if (!input.trim()) return;

//     // Optimistically add the user's message to the UI
//     const userMessage: Message = { id: `user-${Date.now()}`, text: input, isUserMessage: true };
//     setMessages(prev => [...prev, userMessage]);
    
//     // Call the mutation
//     sendMessage(input);
//     setInput('');
//   };

//   // Effect to scroll down when new messages are added
//   useEffect(() => {
//     scrollAreaRef.current?.scrollTo({
//       top: scrollAreaRef.current.scrollHeight,
//       behavior: 'smooth',
//     });
//   }, [messages]);

//   return (
//     <Card className="h-full flex flex-col">
//       <CardHeader>
//         <CardTitle>Chat with your Document</CardTitle>
//       </CardHeader>
//       <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
//         {/* Message Display Area */}
//         <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
//           <div className="space-y-4">
//             {messages.length === 0 ? (
//               <div className="text-center text-muted-foreground pt-10">
//                 <p>Ask a question about your document to get started.</p>
//               </div>
//             ) : (
              
//               messages.map(message => (
//                 <div key={message.id} className={`flex gap-3 ${message.isUserMessage ? 'justify-end' : 'justify-start'}`}>
//                   {!message.isUserMessage && <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"><Bot size={16}/></div>}
//                   <div className={`rounded-lg px-4 py-2 max-w-sm ${message.isUserMessage ? 'bg-blue-500 text-white' : 'bg-muted'}`}>
//                     <Markdown>{message.text}</Markdown>
//                   </div>
//                   {message.isUserMessage && <div className="bg-secondary text-secondary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"><User size={16}/></div>}
//                 </div>
//               ))
//             )}
//              {isPending && (
//                 <div className="flex gap-3 justify-start">
//                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"><Loader2 size={16} className="animate-spin"/></div>
//                    <div className="rounded-lg px-4 py-2 bg-muted">
//                       <p>Thinking...</p>
//                    </div>
//                 </div>
//              )}
//           </div>
//         </ScrollArea>

//         {/* Input Area */}
//         <div className="flex-shrink-0 flex gap-2 items-center pt-2">
//           <Textarea
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask a question about the content..."
//             className="flex-grow resize-none"
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSendMessage();
//               }
//             }}
//             rows={1}
//           />
//           <Button onClick={handleSendMessage} disabled={isPending || !input.trim()} size="icon">
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// src/components/Chat.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSupabase } from '@/context/AuthContext';
import { toast } from 'sonner';
import Markdown from 'react-markdown';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, User, Bot } from 'lucide-react';

// Type definitions for a single message in our chat
interface Message {
  id: string;
  text: string;
  isUserMessage: boolean;
}

interface ChatProps {
  materialId: string;
}

export default function Chat({ materialId }: ChatProps) {
  const { supabase } = useSupabase();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // --- UPDATED MUTATION ---
  const { mutate: sendMessage, isPending } = useMutation({
    // The mutation function now accepts the full message history as an argument
    mutationFn: async (currentMessages: Message[]) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated.");

      // The new question is the last message in the array
      const question = currentMessages[currentMessages.length - 1].text;

      // Format the previous messages into the structure the backend expects
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
        // Send the new question AND the formatted history
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
      // Add the AI's response to the message list
      setMessages(prev => [
        ...prev,
        { id: `ai-${Date.now()}`, text: answer, isUserMessage: false }
      ]);
    },
    onError: (error: any) => {
      toast.error(error.message);
      // If the API call fails, remove the user's optimistic message to avoid confusion
      setMessages(prev => prev.slice(0, -1));
    },
  });

  // --- UPDATED HANDLER ---
  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Create the full new message list *before* setting state
    const newMessages: Message[] = [
      ...messages,
      { id: `user-${Date.now()}`, text: input, isUserMessage: true }
    ];
    
    // Update the UI optimistically
    setMessages(newMessages);
    
    // Pass the entire new message list to the mutation function
    sendMessage(newMessages);
    
    setInput('');
  };

  // Effect to scroll down when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Chat with your Document</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        {/* Message Display Area */}
        <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground pt-10">
                <p>Ask a question about your document to get started.</p>
              </div>
            ) : (
              messages.map(message => (
                <div key={message.id} className={`flex gap-3 text-sm ${message.isUserMessage ? 'justify-end' : 'justify-start'}`}>
                  {!message.isUserMessage && <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"><Bot size={16}/></div>}
                  <div className={`prose dark:prose-invert rounded-lg px-4 py-2 max-w-sm ${message.isUserMessage ? 'bg-blue-500 text-white' : 'bg-muted'}`}>
                    <Markdown>{message.text}</Markdown>
                  </div>
                  {message.isUserMessage && <div className="bg-secondary text-secondary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"><User size={16}/></div>}
                </div>
              ))
            )}
             {isPending && (
                <div className="flex gap-3 justify-start">
                   <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"><Loader2 size={16} className="animate-spin"/></div>
                   <div className="rounded-lg px-4 py-2 bg-muted">
                      <p>Thinking...</p>
                   </div>
                </div>
             )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex-shrink-0 flex gap-2 items-center pt-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="flex-grow resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
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