import type React from "react";

export const H2 = ({
  children,
  className,
}: { children: React.ReactNode; className?: string }) => {
  return (
    <h2
      className={`text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 ${className ?? ""}`}
    >
      {children}
    </h2>
  );
};
