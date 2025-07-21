// "use client";
// import { useState } from 'react';
// import { useSupabase } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Link from 'next/link';

// export default function LoginPage() {
//   const { supabase } = useSupabase();
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);
    
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
    
//     setIsLoading(false);
    
//     if (error) {
//       setError(error.message);
//     } else {
//       router.push('/dashboard');
//       router.refresh();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
//           <CardHeader className="text-center pb-6">
//             <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
//               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//             </div>
//             <CardTitle className="text-2xl font-bold text-gray-900">Welcome back</CardTitle>
//             <p className="text-gray-600 mt-2">Sign in to your account</p>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <form onSubmit={handleLogin} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
//                 <Input 
//                   id="email" 
//                   type="email" 
//                   value={email} 
//                   onChange={(e) => setEmail(e.target.value)} 
//                   required 
//                   className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                   placeholder="Enter your email"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
//                 <Input 
//                   id="password" 
//                   type="password" 
//                   value={password} 
//                   onChange={(e) => setPassword(e.target.value)} 
//                   required 
//                   className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                   placeholder="Enter your password"
//                 />
//               </div>
              
//               {error && (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                   <p className="text-red-600 text-sm flex items-center">
//                     <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     {error}
//                   </p>
//                 </div>
//               )}
              
//               <Button 
//                 type="submit" 
//                 className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center">
//                     <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Signing in...
//                   </div>
//                 ) : (
//                   'Sign in'
//                 )}
//               </Button>
//             </form>
            
//             <div className="text-center">
//               <p className="text-sm text-gray-600">
//                 Don't have an account?{' '}
//                 <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
//                   Sign up
//                 </Link>
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// src/app/login/page.tsx
"use client";
import { useState } from 'react';
import { useSupabase } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
// Import only the GitHub icon
import { FaGithub } from "react-icons/fa";


export default function LoginPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // This function now only needs to handle GitHub
  const handleOAuthSignIn = async (provider: 'github') => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // This redirect URL must be added to your Supabase project's URL configuration
        redirectTo: `${window.location.origin}/auth/callback`,
  
      },
    });
    if (error) {
      setError(error.message);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setIsLoading(false);
    
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome back</CardTitle>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* --- UPDATED SOCIAL LOGIN SECTION --- */}
            <Button variant="outline" className="w-full h-11" onClick={() => handleOAuthSignIn('github')}>
              <FaGithub className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
              Don&#39;t have an account?{' '}
                <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}