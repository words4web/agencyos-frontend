"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main glassmorphism card */}
      <div className="z-10 w-full max-w-md p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 shadow-2xl flex flex-col items-center text-center space-y-6 mx-4">
        {/* Glow Icon wrapper */}
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shadow-inner animate-pulse">
          <AlertCircle size={32} />
        </div>

        {/* Large Header */}
        <div className="space-y-2">
          <h1 className="text-8xl font-black tracking-tighter bg-gradient-to-r from-violet-400 via-fuchsia-400 to-red-400 bg-clip-text text-transparent drop-shadow-sm select-none">
            404
          </h1>
          <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Navigation Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/"
            className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-900/25 active:scale-[0.98] transition-all">
            <Home size={16} />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex-1 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-700/50 active:scale-[0.98] transition-all">
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 text-xs text-slate-600 select-none">
        Agency OS &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
