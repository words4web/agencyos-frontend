"use client";

import { Terminal } from "lucide-react";
import { LoginForm } from "@/forms/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-slate-950 p-4">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 mb-2">
            <Terminal size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            Welcome to AgencyOS
          </h2>
          <p className="text-sm text-slate-400">Sign in to your dashboard</p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
