import type React from "react";

export const H1 = ({
  children,
  className,
}: { children: React.ReactNode; className?: string }) => {
  return (
    <h1
      className={`text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 ${className ?? ""}`}
    >
      {children}
    </h1>
  );
};
