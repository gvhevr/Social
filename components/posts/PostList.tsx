"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { PostCard } from "./PostCard";
import { PostCardSkeleton } from "@/components/ui/Skeleton";

type Props = {
  posts: Post[];
};

const INITIAL = 8;
const BATCH = 6;

export function PostList({ posts }: Props) {
  const [visible, setVisible] = useState(INITIAL);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const inView = useInView(loadMoreRef, { margin: "180px", once: false });
  const postsKey = useMemo(() => posts.map((p) => p.id).join(","), [posts]);

  const slice = useMemo(() => posts.slice(0, visible), [posts, visible]);

  useEffect(() => {
    if (inView && visible < posts.length) {
      setVisible((v) => Math.min(v + BATCH, posts.length));
    }
  }, [inView, posts.length, visible]);

  useEffect(() => {
    setVisible(Math.min(INITIAL, posts.length));
  }, [postsKey, posts.length]);

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-dashed border-gray-300/90 bg-white/80 px-8 py-16 text-center shadow-sm backdrop-blur-sm dark:border-gray-600 dark:bg-gray-900/50"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 text-indigo-600 dark:text-indigo-400">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h18m-9 3h.008v.008H12V15.75zm-6.75-4.5h.008v.008H5.25V11.25zm13.5 0h.008v.008H18.75V11.25zm-13.5-3h.008v.008H5.25V8.25zm13.5 0h.008v.008H18.75V8.25z"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">No posts yet</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          Follow people or share something new — your personalized feed will appear here.
        </p>
        <Link
          href="/create"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:brightness-110 active:scale-[0.98]"
        >
          Create a post
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {slice.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.38,
              delay: Math.min(i * 0.05, 0.35),
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <PostCard post={p} suppressEnterAnimation />
          </motion.div>
        ))}
      </div>

      {visible < posts.length ? (
        <div ref={loadMoreRef} className="mt-6 flex flex-col gap-4" aria-hidden>
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      ) : null}
    </>
  );
}
