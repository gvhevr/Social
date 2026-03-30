"use client";

import { motion } from "framer-motion";
import type { Message } from "@/lib/types";
import { formatRelativeTime } from "@/lib/helpers";

type Props = {
  message: Message;
  isOwn: boolean;
};

export function MessageBubble({ message, isOwn }: Props) {
  return (
    <div className={`flex w-full ${isOwn ? "justify-end" : "justify-start"}`}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className={`max-w-[min(100%,20rem)] rounded-2xl px-4 py-2.5 text-[15px] leading-snug shadow-sm ${
          isOwn
            ? "rounded-br-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/20"
            : "rounded-bl-md border border-gray-200/90 bg-gray-200 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <time
          dateTime={message.createdAt}
          className={`mt-1 block text-[10px] font-semibold opacity-80 ${isOwn ? "text-right text-white/90" : "text-gray-600 dark:text-gray-400"}`}
        >
          {formatRelativeTime(message.createdAt)}
        </time>
      </motion.div>
    </div>
  );
}
