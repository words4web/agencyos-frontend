import React from "react";
import { Terminal } from "lucide-react";

export const AuthLoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md transition-all duration-300 animate-in fade-in">
      <div className="flex flex-col items-center gap-4 p-8 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
          <Terminal size={32} />
          <span className="text-xl font-bold tracking-wider text-slate-100">
            AgencyOS
          </span>
        </div>
        <div className="flex gap-1.5 pt-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce" />
        </div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse">
          Authenticating...
        </p>
      </div>
    </div>
  );
};
