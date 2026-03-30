"use client";

import { motion } from "framer-motion";

type Props = { className?: string };

export function TypingIndicator({ className = "" }: Props) {
  return (
    <div
      className={`flex items-center gap-1 rounded-2xl rounded-bl-md border border-gray-200/90 bg-gray-100 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/90 ${className}`}
      role="status"
      aria-label="Someone is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-gray-500 dark:bg-gray-400"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.55,
            repeat: Infinity,
            delay: i * 0.12,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
