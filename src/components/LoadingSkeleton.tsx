import React from "react";

interface LoadingSkeletonProps {
  count?: number;
  height?: string;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  height = "h-12",
  className = "",
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-slate-800/60 border border-slate-700/30 rounded-lg animate-pulse ${className}`}
        />
      ))}
    </>
  );
};
