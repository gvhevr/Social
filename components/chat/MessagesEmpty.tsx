"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function MessagesEmpty() {
  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 text-indigo-600 dark:text-indigo-400">
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      </div>
      <p className="text-base font-semibold text-gray-800 dark:text-gray-200">Select a conversation</p>
      <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        Choose someone from the list or message them from their profile.
      </p>
      <Link
        href="/feed"
        className="mt-2 text-sm font-semibold text-indigo-600 underline-offset-4 transition hover:underline dark:text-indigo-400"
      >
        Back to feed
      </Link>
    </motion.div>
  );
}
