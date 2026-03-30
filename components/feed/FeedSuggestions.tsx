"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar } from "@/components/ui/Avatar";

export function FeedSuggestions() {
  const users = useAuthStore((s) => s.users);
  const currentUser = useAuthStore((s) => s.currentUser);

  const suggestions = useMemo(() => {
    if (!currentUser) return users.slice(0, 6);
    return users.filter((u) => u.id !== currentUser.id).slice(0, 6);
  }, [users, currentUser]);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-glass backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/70"
    >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Suggested for you</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              People you might want to follow
            </p>
          </div>
          <span className="rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-600/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            New
          </span>
        </div>

        <ul className="mt-4 space-y-1">
          {suggestions.map((u, i) => (
            <motion.li
              key={u.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/profile/${u.username}`}
                className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-[transform,background-color,box-shadow] duration-200 hover:bg-gray-100/90 hover:shadow-sm dark:hover:bg-gray-800/80 active:scale-[0.98]"
              >
                <Avatar
                  src={u.avatar}
                  alt={u.username}
                  size="sm"
                  className="ring-2 ring-gray-100 transition group-hover:ring-indigo-200 dark:ring-gray-800 dark:group-hover:ring-indigo-900/50"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 decoration-indigo-500 decoration-2 underline-offset-4 transition group-hover:underline dark:text-gray-100">
                    {u.username}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">@{u.username}</p>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>

        <Link
          href="/feed"
          className="mt-4 block text-center text-xs font-medium text-indigo-600 underline-offset-4 transition hover:text-indigo-500 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          See all suggestions
        </Link>
    </motion.aside>
  );
}
