type Props = { children: React.ReactNode; className?: string };

export function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-2xl border border-gray-200/80 bg-white shadow-card dark:border-gray-800 dark:bg-gray-900/90 ${className}`}
    >
      {children}
    </div>
  );
}
