export const App = ({
  children,
  className,
}: { children: React.ReactNode; className?: string }) => {
  return (
    <main id="app" className={`h-screen overflow-hidden select-none ${className ?? ""}`}>
      {children}
    </main>
  );
};
