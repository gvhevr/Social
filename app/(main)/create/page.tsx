"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostStore } from "@/store/usePostStore";
import { Card } from "@/components/ui/Card";
import { CreatePostForm } from "@/components/posts/CreatePostForm";

export default function CreatePostPage() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const createPost = usePostStore((s) => s.createPost);

  const close = () => router.push("/feed");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-gray-900/55 backdrop-blur-md dark:bg-black/65"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={close}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-post-title"
        className="relative z-10 w-full max-w-lg sm:max-w-xl"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="max-h-[90dvh] overflow-y-auto border-gray-200/90 p-6 shadow-glass dark:border-gray-800 sm:rounded-2xl sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                New
              </p>
              <h1 id="create-post-title" className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                Create post
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Share a moment with your followers</p>
            </div>
            <button
              type="button"
              onClick={close}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              aria-label="Close dialog"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {currentUser ? (
            <CreatePostForm
              onSubmit={({ content, image }) => {
                createPost(currentUser.id, content, image);
                router.push("/feed");
              }}
              onCancel={close}
            />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">You need to be logged in to create a post.</p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
