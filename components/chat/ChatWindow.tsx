"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { messagesForChat, parseChatParticipants } from "@/lib/mockDatabase/messages";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { Avatar } from "@/components/ui/Avatar";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";

type Props = {
  chatId: string;
};

export function ChatWindow({ chatId }: Props) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const users = useAuthStore((s) => s.users);
  const messages = useChatStore((s) => s.messages);
  const sendMessage = useChatStore((s) => s.sendMessage);

  const [draft, setDraft] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const parsed = useMemo(() => {
    if (!currentUser) return null;
    return parseChatParticipants(chatId, currentUser.id);
  }, [chatId, currentUser]);

  const otherUser = parsed ? users.find((u) => u.id === parsed.otherUserId) : undefined;

  const thread = useMemo(() => {
    if (!currentUser || !parsed) return [];
    return messagesForChat(messages, currentUser.id, parsed.otherUserId);
  }, [messages, currentUser, parsed]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.length, showTyping]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  const handleSend = () => {
    if (!currentUser || !parsed || !draft.trim()) return;
    sendMessage(currentUser.id, parsed.otherUserId, draft);
    setDraft("");

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setShowTyping(true);
    typingTimerRef.current = setTimeout(() => {
      setShowTyping(false);
      typingTimerRef.current = null;
    }, 2200);
  };

  if (!currentUser) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-gray-500 dark:text-gray-400">
        Log in to use messages.
      </div>
    );
  }

  if (!parsed || !otherUser) {
    return (
      <motion.div
        className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">This chat is unavailable or invalid.</p>
        <Link
          href="/messages"
          className="text-sm font-semibold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400"
        >
          Back to messages
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="flex h-full min-h-[min(70vh,560px)] flex-1 flex-col bg-gradient-to-b from-gray-50/90 to-white/80 dark:from-gray-950/50 dark:to-gray-950/30">
      <div className="flex items-center gap-3 border-b border-gray-200/90 bg-white/80 px-3 py-3 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <Link
          href="/messages"
          className="rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 hover:scale-105 active:scale-95 md:hidden dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="Back to conversations"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <Link href={`/profile/${otherUser.username}`} className="shrink-0 rounded-full ring-2 ring-gray-100 dark:ring-gray-800">
          <Avatar src={otherUser.avatar} alt={otherUser.username} size="md" className="ring-0" />
        </Link>
        <div className="min-w-0">
          <Link
            href={`/profile/${otherUser.username}`}
            className="block truncate text-base font-semibold text-gray-900 underline decoration-indigo-400 decoration-2 underline-offset-4 transition hover:text-indigo-600 dark:text-gray-50 dark:hover:text-indigo-300"
          >
            {otherUser.username}
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400">@{otherUser.username}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
          {thread.length === 0 ? (
            <motion.p
              className="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No messages yet. Say hello.
            </motion.p>
          ) : (
            thread.map((m) => (
              <MessageBubble key={m.id} message={m} isOwn={m.senderId === currentUser.id} />
            ))
          )}
          <AnimatePresence>
            {showTyping ? (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="flex justify-start"
              >
                <TypingIndicator />
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
        <MessageInput value={draft} onChange={setDraft} onSend={handleSend} />
      </div>
    </div>
  );
}
