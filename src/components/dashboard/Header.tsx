import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User;
}

export const Header = ({ user }: HeaderProps) => (
    <section className="mb-12 animate-fadeIn">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
            Welcome back, <span className="text-blue-500">{user.email?.split("@")[0] || "User"}</span>
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
            Upload and manage your study materials with ease.
        </p>
    </section>
);