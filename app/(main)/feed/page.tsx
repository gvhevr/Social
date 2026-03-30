"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { selectFeedPosts } from "@/lib/mockDatabase/feed";
import { PostList } from "@/components/posts/PostList";
import { FeedSuggestions } from "@/components/feed/FeedSuggestions";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostStore } from "@/store/usePostStore";

export default function FeedPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const allPosts = usePostStore((s) => s.posts);
  const follows = usePostStore((s) => s.follows);

  const posts = useMemo(
    () => (currentUser ? selectFeedPosts(currentUser.id, allPosts, follows) : []),
    [currentUser, allPosts, follows]
  );

  return (
    <div className="mx-auto w-full max-w-6xl xl:grid xl:grid-cols-[minmax(0,1fr)_288px] xl:items-start xl:gap-10">
      <main className="min-w-0 px-4 py-6 sm:px-5 sm:py-8 md:px-0">
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Feed
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Home</h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Updates from people you follow — refined, calm, and built for focus.
          </p>
        </motion.header>
        <PostList posts={posts} />
      </main>

      <aside className="mt-8 hidden min-w-0 xl:mt-6 xl:block">
        <div className="sticky top-6">
          <FeedSuggestions />
        </div>
      </aside>
    </div>
  );
}
