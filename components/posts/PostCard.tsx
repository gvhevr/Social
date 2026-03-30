"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Post } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostStore } from "@/store/usePostStore";
import { PostHeader } from "./PostHeader";
import { PostActions } from "./PostActions";
import { CommentList } from "./CommentList";
import { CommentInput } from "./CommentInput";

type Props = {
  post: Post;
  suppressEnterAnimation?: boolean;
};

export function PostCard({ post, suppressEnterAnimation }: Props) {
  const users = useAuthStore((s) => s.users);
  const currentUser = useAuthStore((s) => s.currentUser);
  const toggleLike = usePostStore((s) => s.toggleLike);
  const comments = usePostStore((s) => s.comments);
  const addComment = usePostStore((s) => s.addComment);
  const deleteComment = usePostStore((s) => s.deleteComment);
  const deletePost = usePostStore((s) => s.deletePost);

  const author = users.find((u) => u.id === post.authorId);
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  const postComments = comments.filter((c) => c.postId === post.id);
  const liked = currentUser ? post.likes.includes(currentUser.id) : false;

  if (!author) return null;

  const handleSendComment = () => {
    if (!currentUser || !draft.trim()) return;
    addComment(post.id, currentUser.id, draft);
    setDraft("");
  };

  const isOwner = currentUser?.id === post.authorId;

  const handleDeletePost = () => {
    if (!currentUser || !isOwner) return;
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    deletePost(post.id, currentUser.id);
  };

  return (
    <motion.article
      {...(!suppressEnterAnimation
        ? {
            initial: { opacity: 0, y: 22 } as const,
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
          }
        : { initial: false })}
      whileHover={{
        y: -2,
        transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
      }}
      className="gpu-transform overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm transition-shadow duration-300 hover:shadow-card-hover dark:border-gray-800 dark:bg-gray-900/95 dark:hover:shadow-black/40"
    >
      <header className="border-b border-gray-100/90 dark:border-gray-800/90">
        <PostHeader
          author={author}
          createdAt={post.createdAt}
          actions={
            isOwner ? (
              <button
                type="button"
                onClick={handleDeletePost}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 dark:text-gray-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                aria-label="Delete post"
              >
                <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            ) : null
          }
        />
      </header>

      {post.content ? (
        <div className="px-4 py-4">
          <p className="whitespace-pre-wrap text-base font-normal leading-relaxed text-gray-800 dark:text-gray-200">
            {post.content}
          </p>
        </div>
      ) : null}

      {post.image ? (
        <motion.div
          className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800"
          initial={false}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{
              opacity: imageLoaded ? 1 : 0,
              scale: imageLoaded ? 1 : 1.02,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={post.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              unoptimized
              onLoadingComplete={() => setImageLoaded(true)}
            />
          </motion.div>
        </motion.div>
      ) : null}

      <PostActions
        liked={liked}
        likeCount={post.likes.length}
        commentsCount={post.commentsCount}
        commentsOpen={showComments}
        onToggleLike={() => currentUser && toggleLike(post.id, currentUser.id)}
        onToggleComments={() => setShowComments((v) => !v)}
        canLike={!!currentUser}
        likeAccessibilityLabel={`post ${post.id}`}
      />

      <AnimatePresence initial={false}>
        {showComments ? (
          <motion.section
            key="comments"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-gray-100/90 bg-gray-50/95 dark:border-gray-800/90 dark:bg-gray-950/50"
            aria-label="Comments"
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, delay: 0.05 }}
              className="px-4 py-4"
            >
              <div className="ml-1 border-l-2 border-indigo-200/70 pl-4 dark:border-indigo-900/50">
                <CommentList
                  comments={postComments}
                  users={users}
                  currentUserId={currentUser?.id ?? null}
                  onDeleteComment={(id) => {
                    if (currentUser) deleteComment(id, currentUser.id);
                  }}
                />
                {currentUser ? (
                  <CommentInput
                    value={draft}
                    onChange={setDraft}
                    onSubmit={handleSendComment}
                  />
                ) : (
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <Link
                      href="/login"
                      className="font-semibold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400"
                    >
                      Log in
                    </Link>{" "}
                    to comment.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
