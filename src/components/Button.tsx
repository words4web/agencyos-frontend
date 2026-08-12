import React from "react";
import { ButtonProps } from "@/types/common/common.types";

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyle =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-500 shadow-md shadow-indigo-600/20 active:scale-[0.98]",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 focus:ring-slate-500 active:scale-[0.98]",
    danger:
      "bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 shadow-md shadow-red-600/20 active:scale-[0.98]",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}>
      {children}
    </button>
  );
};
