type Props = {
  count: number;
  className?: string;
};

export function LikeCounter({ count, className = "" }: Props) {
  return (
    <span
      className={`min-w-[1.25rem] text-sm font-semibold tabular-nums text-gray-800 dark:text-gray-200 ${className}`}
      aria-label={`${count} likes`}
    >
      {count.toLocaleString()}
    </span>
  );
}
