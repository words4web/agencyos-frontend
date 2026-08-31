import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-850 bg-slate-950/40 hover:bg-slate-950/60 cursor-pointer select-none transition-colors">
          <input
            id={id}
            type="checkbox"
            ref={ref}
            className={`rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 w-4 h-4 ${className}`}
            {...props}
          />
          <span className="text-xs font-medium text-slate-300">{label}</span>
        </label>
        {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
