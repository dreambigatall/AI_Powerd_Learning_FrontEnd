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

// // src/context/AuthContext.tsx
// "use client";

// import { createContext, useContext, useEffect, useState } from 'react';
// import { createClient } from '@/lib/supabase/client';
// import type {  User } from '@supabase/supabase-js';

// // 1. UPDATE THE CONTEXT'S TYPE DEFINITION
// // We add `isLoading` to the type so components can access it.
// type SupabaseContext = {
//   supabase: ReturnType<typeof createClient>;
//   user: User | null;
//   isLoading: boolean;
// };

// const Context = createContext<SupabaseContext | undefined>(undefined);

// export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
//   //const supabase = createClient();
//   const [supabase] = useState(() => createClient());
//   const [user, setUser] = useState<User | null>(null);
  
//   // 2. ADD THE isLoading STATE
//   // It starts as `true` because we are loading by default.
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // This listener fires whenever the user logs in or out.
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
//       setUser(session?.user ?? null);
//       // 3. SET isLoading TO false ONCE A RESPONSE IS RECEIVED
//       // The auth state is now known, so we are no longer loading.
//       setIsLoading(false); 
//       // Debug: Log auth state changes
//       console.log('[AuthContext] onAuthStateChange:', event, session);
//     });

//     // This handles the initial page load. It checks if a session already exists.
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user ?? null);
//       setIsLoading(false);
//       // Debug: Log initial session
//       console.log('[AuthContext] getSession:', session);
//     });

//     // Cleanup the subscription when the component unmounts.
//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [supabase]);

//   // 4. PROVIDE THE NEW isLoading VALUE
//   // Make `isLoading` available to all child components.
//   return (
//     <Context.Provider value={{ supabase, user, isLoading }}>
//       {children}
//     </Context.Provider>
//   );
// }

// // The useSupabase hook itself doesn't need any changes.
// export const useSupabase = () => {
//   const context = useContext(Context);
//   if (context === undefined) {
//     throw new Error('useSupabase must be used within a SupabaseProvider');
//   }
//   return context;
// };

// // src/context/AuthContext.tsx
// "use client";

// import { createContext, useContext, useEffect, useState } from 'react';
// import { createClient } from '@/lib/supabase/client';
// import type { SupabaseClient, User } from '@supabase/supabase-js';

// // 1. Add `isSyncing` to the context's type definition
// type SupabaseContext = {
//   supabase: SupabaseClient;
//   user: User | null;
//   isLoading: boolean;
//   isSyncing: boolean; // Tracks if the backend user sync is in progress
// };

// const Context = createContext<SupabaseContext | undefined>(undefined);

// const syncUserWithBackend = async (user: User) => {
//   const authId = user.id;
//   const email = user.email;

//   if (!authId || !email) {
//     console.warn("AuthContext: Cannot sync user with backend: authId or email is missing.", { authId, email });
//     return;
//   }
  
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ authId, email }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       if (response.status !== 400 || !errorData.message.includes('already exists')) {
//         throw new Error(errorData.message || 'Failed to sync user with backend.');
//       }
//     }
//     console.log(`[AuthContext] User ${email} successfully synced or already exists in backend.`);
//   } catch (syncError) {
//     console.error('[AuthContext] Backend sync error:', syncError);
//   }
// };


// export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
//   const [supabase] = useState(() => createClient());
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // 2. Add the `isSyncing` state, starting as false
//   const [isSyncing, setIsSyncing] = useState(false);

//   useEffect(() => {
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
//       setUser(session?.user ?? null);
      
//       // We are no longer loading the initial auth state after the first event
//       setIsLoading(false);

//       // 3. Manage the syncing state
//       if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN') && session?.user) {
//         setIsSyncing(true); // Set syncing to true BEFORE starting the sync process
//         await syncUserWithBackend(session.user);
//         setIsSyncing(false); // Set syncing to false AFTER the sync process is complete
//       }
//     });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [supabase]);

//   // 4. Pass the new `isSyncing` state down through the provider
//   return (
//     <Context.Provider value={{ supabase, user, isLoading, isSyncing }}>
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
import type { User } from '@supabase/supabase-js';

type SupabaseContext = {
  supabase: ReturnType<typeof createClient>;
  user: User | null;
  isLoading: boolean;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is the robust pattern for handling auth state
    
    // 1. Get the initial session immediately
    const getActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };
    getActiveSession();

    // 2. Set up a listener for any subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Context.Provider value={{ supabase, user, isLoading }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};