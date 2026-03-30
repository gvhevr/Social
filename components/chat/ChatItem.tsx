"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { User } from "@/lib/types";
import { formatRelativeTime } from "@/lib/helpers";
import { chatIdForUsers } from "@/lib/mockDatabase/messages";
import { Avatar } from "@/components/ui/Avatar";

type Props = {
  currentUserId: string;
  peer: User;
  previewText: string;
  previewAt: string;
  active: boolean;
};

export function ChatItem({ currentUserId, peer, previewText, previewAt, active }: Props) {
  const href = `/messages/${chatIdForUsers(currentUserId, peer.id)}`;

  return (
    <li>
      <Link href={href} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40">
        <motion.div
          className={`flex gap-3 rounded-xl px-3 py-2.5 transition-colors ${
            active
              ? "bg-gradient-to-r from-indigo-500/12 to-purple-600/10 shadow-sm dark:from-indigo-500/10 dark:to-purple-600/5"
              : "hover:bg-gray-100/90 dark:hover:bg-gray-800/80"
          }`}
          whileHover={{ x: 2 }}
          transition={{ duration: 0.18 }}
        >
          <Avatar
            src={peer.avatar}
            alt={peer.username}
            size="md"
            className="shrink-0 ring-2 ring-gray-100 dark:ring-gray-800"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate font-semibold text-gray-900 dark:text-gray-50">{peer.username}</span>
              <time className="shrink-0 text-[11px] font-medium text-gray-400 dark:text-gray-500" dateTime={previewAt}>
                {formatRelativeTime(previewAt)}
              </time>
            </div>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{previewText}</p>
          </div>
        </motion.div>
      </Link>
    </li>
  );
}
