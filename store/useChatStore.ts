import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message } from "@/lib/types";
import { loadSeedMessages } from "@/lib/mockDatabase/seed";
import { randomId } from "@/lib/helpers";

type ChatState = {
  messages: Message[];
  sendMessage: (senderId: string, receiverId: string, text: string) => void;
};

const seedMessages = loadSeedMessages();

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: seedMessages,

      sendMessage: (senderId, receiverId, text) => {
        const trimmed = text.trim();
        if (!trimmed || senderId === receiverId) return;
        const msg: Message = {
          id: randomId("m"),
          senderId,
          receiverId,
          text: trimmed,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ messages: [...s.messages, msg] }));
      },
    }),
    { name: "social-chat-v2" }
  )
);
