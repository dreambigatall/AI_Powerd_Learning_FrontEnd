// // src/context/AuthContext.tsx
// "use client";

// import { createContext, useContext, useEffect, useState } from 'react';
// import { createClient } from '@/lib/supabase/client';
// import type { SupabaseClient, User } from '@supabase/supabase-js';

// type SupabaseContext = {
//   supabase: SupabaseClient;
//   user: User | null;
// };

// const Context = createContext<SupabaseContext | undefined>(undefined);

// export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
//   const supabase = createClient();
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
//       setUser(session?.user ?? null);
//     });

//     // Load initial user session
//     supabase.auth.getUser().then(({ data }) => {
//       setUser(data.user);
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [supabase]);

//   return (
//     <Context.Provider value={{ supabase, user }}>
//       {children}
//     </Context.Provider>
//   );
// }

// export const useSupabase = () => {
//   const context = useContext(Context);
//   if (context === undefined) {
//     throw new Error('useSupabase must be used within a SupabaseProvider');
//   }
//   return context;
// };

// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient, User } from '@supabase/supabase-js';

// 1. UPDATE THE CONTEXT'S TYPE DEFINITION
// We add `isLoading` to the type so components can access it.
type SupabaseContext = {
  supabase: ReturnType<typeof createClient>;
  user: User | null;
  isLoading: boolean;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  //const supabase = createClient();
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  
  // 2. ADD THE isLoading STATE
  // It starts as `true` because we are loading by default.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This listener fires whenever the user logs in or out.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      // 3. SET isLoading TO false ONCE A RESPONSE IS RECEIVED
      // The auth state is now known, so we are no longer loading.
      setIsLoading(false); 
      // Debug: Log auth state changes
      console.log('[AuthContext] onAuthStateChange:', event, session);
    });

    // This handles the initial page load. It checks if a session already exists.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      // Debug: Log initial session
      console.log('[AuthContext] getSession:', session);
    });

    // Cleanup the subscription when the component unmounts.
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // 4. PROVIDE THE NEW isLoading VALUE
  // Make `isLoading` available to all child components.
  return (
    <Context.Provider value={{ supabase, user, isLoading }}>
      {children}
    </Context.Provider>
  );
}

// The useSupabase hook itself doesn't need any changes.
export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};