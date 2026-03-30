"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { User } from "@/lib/types";
import { buildInbox, chatIdForUsers } from "@/lib/mockDatabase/messages";
import { useChatStore } from "@/store/useChatStore";
import { ChatItem } from "./ChatItem";

type Props = {
  currentUserId: string;
  users: User[];
  activeChatId: string | null;
};

export function ChatList({ currentUserId, users, activeChatId }: Props) {
  const messages = useChatStore((s) => s.messages);

  const inbox = useMemo(
    () => buildInbox(messages, currentUserId),
    [messages, currentUserId]
  );

  if (inbox.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center px-6 py-14 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-600/15 text-indigo-600 dark:text-indigo-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V4.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 1c-1.887 0-3.665.555-5.155 1.513" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">No messages yet</p>
        <p className="mt-2 max-w-[14rem] text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          Open a chat from someone’s profile to start a conversation.
        </p>
      </motion.div>
    );
  }

  return (
    <ul className="space-y-0.5 p-2">
      {inbox.map(({ otherUserId, lastMessage }) => {
        const peer = users.find((u) => u.id === otherUserId);
        if (!peer) return null;
        const active = activeChatId === chatIdForUsers(currentUserId, otherUserId);
        return (
          <ChatItem
            key={otherUserId}
            currentUserId={currentUserId}
            peer={peer}
            previewText={lastMessage.text}
            previewAt={lastMessage.createdAt}
            active={active}
          />
        );
      })}
    </ul>
  );
}
