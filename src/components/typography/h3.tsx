import type React from "react";

export const H3 = ({
  children,
  className,
}: { children: React.ReactNode; className?: string }) => {
  return (
    <h3
      className={`text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 ${className ?? ""}`}
    >
      {children}
    </h3>
  );
};
