"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Card } from "@/components/ui/Card";
import { ChatList } from "./ChatList";

type Props = {
  children: React.ReactNode;
};

export function MessagesLayoutClient({ children }: Props) {
  const pathname = usePathname();
  const currentUser = useAuthStore((s) => s.currentUser);
  const users = useAuthStore((s) => s.users);

  const chatId =
    pathname.startsWith("/messages/") && pathname.length > "/messages/".length
      ? decodeURIComponent(pathname.slice("/messages/".length).split("/")[0] ?? "")
      : null;

  const showListOnMobile = !chatId;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-5 sm:py-8 md:px-0">
      <motion.header
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Inbox</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Messages</h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          Direct chats stay in this browser — fast, private, and distraction-free.
        </p>
      </motion.header>

      <Card className="flex min-h-[min(70vh,620px)] flex-col overflow-hidden border-gray-200/90 shadow-glass dark:border-gray-800 md:flex-row">
        <aside
          className={`w-full shrink-0 overflow-hidden border-gray-200 dark:border-gray-800 md:w-[min(100%,320px)] md:border-r ${
            showListOnMobile ? "block" : "hidden md:block"
          }`}
        >
          {currentUser ? <ChatList currentUserId={currentUser.id} users={users} activeChatId={chatId} /> : null}
        </aside>

        <section
          className={`flex min-h-[320px] flex-1 flex-col bg-gray-50/50 dark:bg-gray-950/30 ${
            showListOnMobile ? "hidden md:flex" : "flex"
          }`}
        >
          {children}
        </section>
      </Card>
    </main>
  );
}
