"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { Post } from "@/lib/types";
import { PostCard } from "@/components/posts/PostCard";

type Props = {
  posts: Post[];
};

export function ProfilePostsGrid({ posts }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openPost = openId ? posts.find((p) => p.id === openId) : null;

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (openId && !posts.some((p) => p.id === openId)) setOpenId(null);
  }, [openId, posts]);

  if (posts.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-600/15 text-indigo-600 dark:text-indigo-400">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008H12V8.25Z"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">No posts yet</p>
        <p className="mt-1 max-w-xs text-sm text-gray-500 dark:text-gray-400">Photos and updates will appear here.</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1 md:gap-1.5">
        {posts.map((post, i) => (
          <motion.button
            key={post.id}
            type="button"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.4) }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setOpenId(post.id)}
            className="group relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-gray-800 dark:focus-visible:ring-offset-gray-950 sm:rounded-xl"
            aria-label="Open post"
          >
            {post.image ? (
              <Image
                src={post.image}
                alt=""
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 33vw, 200px"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-gray-200 to-gray-300 p-2 text-left dark:from-gray-700 dark:to-gray-800">
                <p className="line-clamp-3 text-[10px] font-medium leading-snug text-gray-800 dark:text-gray-200 sm:text-xs">
                  {post.content}
                </p>
              </div>
            )}
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20 dark:group-hover:bg-black/35" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {openPost ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-900/55 p-4 pt-10 backdrop-blur-md sm:pt-16"
            role="dialog"
            aria-modal="true"
            aria-label="Post"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={close}
          >
            <motion.div
              className="relative w-full max-w-lg pb-10"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={close}
                className="absolute -top-2 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-lg dark:bg-gray-900 dark:text-gray-200 sm:-right-2"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </motion.button>
              <PostCard post={openPost} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
