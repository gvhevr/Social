type Props = { className?: string; rounded?: "md" | "lg" | "xl" | "full" };

const roundedMap = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export function Skeleton({ className = "", rounded = "xl" }: Props) {
  return (
    <div
      className={`relative isolate overflow-hidden bg-gray-200/90 dark:bg-gray-800/90 ${roundedMap[rounded]} ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/[0.06]" />
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/90">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" rounded="lg" />
          <Skeleton className="h-3 w-20" rounded="lg" />
        </div>
      </div>
      <Skeleton className="mt-4 h-16 w-full" rounded="xl" />
      <Skeleton className="mt-3 aspect-[4/3] w-full" rounded="xl" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-9 w-9" rounded="lg" />
        <Skeleton className="h-9 w-16" rounded="lg" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Skeleton className="mx-auto h-28 w-28 shrink-0 sm:mx-0" rounded="full" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-48" rounded="lg" />
          <Skeleton className="h-4 w-full max-w-md" rounded="lg" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24" rounded="xl" />
            <Skeleton className="h-10 w-24" rounded="xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatListSkeleton() {
  return (
    <ul className="divide-y divide-gray-100 dark:divide-gray-800/80">
      {[1, 2, 3, 4].map((i) => (
        <li key={i} className="flex gap-3 px-3 py-3">
          <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <Skeleton className="h-3.5 w-24" rounded="lg" />
            <Skeleton className="h-3 w-full max-w-[8rem]" rounded="lg" />
          </div>
        </li>
      ))}
    </ul>
  );
}
