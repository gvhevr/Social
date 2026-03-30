"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";

type Props = {
  liked: boolean;
  disabled?: boolean;
  onToggle: () => void;
  label?: string;
};

const HEART_PATH =
  "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z";

function HeartOutline({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={HEART_PATH} />
    </svg>
  );
}

function HeartFilled({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={HEART_PATH} />
    </svg>
  );
}

const burstAngles = [0, 45, 90, 135, 180, 225, 270, 315];

export function LikeButton({ liked, disabled, onToggle, label = "post" }: Props) {
  const [burst, setBurst] = useState(0);

  const handleClick = useCallback(() => {
    if (disabled) return;
    if (!liked) setBurst((k) => k + 1);
    onToggle();
  }, [disabled, liked, onToggle]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={liked}
      aria-label={liked ? `Unlike ${label}` : `Like ${label}`}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 disabled:cursor-not-allowed disabled:opacity-45 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
    >
      <AnimatePresence>
        {burst > 0
          ? burstAngles.map((deg, i) => (
              <motion.span
                key={`${burst}-${deg}`}
                className="pointer-events-none absolute h-1 w-1 rounded-full bg-rose-500"
                initial={{ opacity: 0.9, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: Math.cos((deg * Math.PI) / 180) * 18,
                  y: Math.sin((deg * Math.PI) / 180) * 18,
                }}
                transition={{ duration: 0.45, delay: i * 0.01, ease: [0.22, 1, 0.36, 1] }}
              />
            ))
          : null}
      </AnimatePresence>

      <motion.span
        className="relative z-[1] flex h-[22px] w-[22px] items-center justify-center text-current"
        animate={
          liked
            ? {
                scale: [1, 1.32, 1],
              }
            : { scale: 1 }
        }
        transition={{
          duration: 0.42,
          ease: [0.34, 1.4, 0.64, 1],
        }}
      >
        <motion.span
          key={liked ? "full" : "outline"}
          initial={{ scale: 0.85, opacity: 0.85 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={`flex h-full w-full items-center justify-center ${
            liked
              ? "text-rose-500 drop-shadow-sm dark:text-rose-400"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          }`}
        >
          {liked ? <HeartFilled className="h-full w-full" /> : <HeartOutline className="h-full w-full" />}
        </motion.span>
      </motion.span>

    </button>
  );
}
