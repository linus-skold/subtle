
export const App = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <main className={`h-screen overflow-hidden select-none ${className ?? ''}`}>{children}</main>;
};
