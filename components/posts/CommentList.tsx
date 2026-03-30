"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { Comment, User } from "@/lib/types";
import { CommentItem } from "./CommentItem";

type Props = {
  comments: Comment[];
  users: User[];
  currentUserId: string | null;
  onDeleteComment: (commentId: string) => void;
};

export function CommentList({ comments, users, currentUserId, onDeleteComment }: Props) {
  const sorted = useMemo(
    () =>
      [...comments].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [comments]
  );

  if (sorted.length === 0) {
    return (
      <motion.p
        className="py-4 pl-1 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        No comments yet. Be the first to reply.
      </motion.p>
    );
  }

  return (
    <ul className="space-y-1">
      {sorted.map((c) => {
        const author = users.find((u) => u.id === c.authorId);
        if (!author) return null;
        const isOwn = currentUserId !== null && c.authorId === currentUserId;
        return (
          <CommentItem
            key={c.id}
            comment={c}
            author={author}
            isOwn={isOwn}
            onDelete={isOwn ? () => onDeleteComment(c.id) : undefined}
          />
        );
      })}
    </ul>
  );
}
