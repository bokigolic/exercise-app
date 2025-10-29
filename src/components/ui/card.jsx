export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl bg-white/5 p-4 ring-1 ring-white/10 shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
}
