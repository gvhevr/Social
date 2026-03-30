"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Comment, User } from "@/lib/types";
import { formatRelativeTime } from "@/lib/helpers";
import { Avatar } from "@/components/ui/Avatar";

type Props = {
  comment: Comment;
  author: User;
  isOwn: boolean;
  onDelete?: () => void;
};

export function CommentItem({ comment, author, isOwn, onDelete }: Props) {
  return (
    <motion.li
      className="py-2"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex gap-3">
        <Link
          href={`/profile/${author.username}`}
          className="mt-0.5 shrink-0 rounded-full ring-2 ring-gray-100 transition hover:ring-indigo-200 dark:ring-gray-800 dark:hover:ring-indigo-900/40"
        >
          <Avatar src={author.avatar} alt={author.username} size="xs" className="ring-0" />
        </Link>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0">
            <Link
              href={`/profile/${author.username}`}
              className="text-sm font-semibold text-gray-900 underline decoration-indigo-400 decoration-2 underline-offset-2 transition hover:text-indigo-700 dark:text-gray-100 dark:hover:text-indigo-300"
            >
              {author.username}
            </Link>
            <time
              dateTime={comment.createdAt}
              className="text-[11px] font-medium text-gray-400 dark:text-gray-500"
            >
              {formatRelativeTime(comment.createdAt)}
            </time>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {comment.text}
          </p>
          {isOwn && onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="text-xs font-semibold text-gray-500 underline-offset-2 transition hover:text-rose-600 hover:underline dark:text-gray-400 dark:hover:text-rose-400"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </motion.li>
  );
}
