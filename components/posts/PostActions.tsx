"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { LikeButton } from "./LikeButton";
import { LikeCounter } from "./LikeCounter";

type Props = {
  liked: boolean;
  likeCount: number;
  commentsCount: number;
  commentsOpen: boolean;
  onToggleLike: () => void;
  onToggleComments: () => void;
  canLike: boolean;
  likeAccessibilityLabel?: string;
};

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.488.432.447.74 1.04.865 1.688l.164 1.25M12 20.25c-2.305 0-4.445-.529-6.24-1.469-.204-.1-.42-.156-.64-.156h-.002a1.36 1.36 0 0 1-1.255-.904l-.097-.334a8.82 8.82 0 0 1-.356-1.057c-.15-.476-.24-.975-.24-1.49V12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25-4.03 8.25-9 8.25Zm3.75-8.25a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-3.75 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}

export function PostActions({
  liked,
  likeCount,
  commentsCount,
  commentsOpen,
  onToggleLike,
  onToggleComments,
  canLike,
  likeAccessibilityLabel = "post",
}: Props) {
  return (
    <div className="flex items-center gap-0.5 border-t border-gray-100/90 px-1 py-2 dark:border-gray-800/90">
      <div className="flex items-center gap-0.5 rounded-xl pr-1">
        <LikeButton
          liked={liked}
          disabled={!canLike}
          onToggle={onToggleLike}
          label={likeAccessibilityLabel}
        />
        <LikeCounter count={likeCount} />
      </div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`gap-2 !px-3 transition-colors ${
            commentsOpen
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-gray-600 dark:text-gray-300"
          }`}
          onClick={onToggleComments}
          aria-expanded={commentsOpen}
        >
          <CommentIcon className="h-[18px] w-[18px] shrink-0" />
          <span className="text-sm font-semibold tabular-nums">{commentsCount}</span>
        </Button>
      </motion.div>
    </div>
  );
}
