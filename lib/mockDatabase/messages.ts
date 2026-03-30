import type { Message } from "@/lib/types";
import { conversationKey } from "@/lib/helpers";

export function isMessageInChat(
  m: Message,
  participantA: string,
  participantB: string
): boolean {
  const key = conversationKey(participantA, participantB);
  const mk = conversationKey(m.senderId, m.receiverId);
  return mk === key;
}

export function messagesForChat(
  messages: Message[],
  userId: string,
  otherUserId: string
): Message[] {
  return messages
    .filter((m) => isMessageInChat(m, userId, otherUserId))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export type InboxItem = {
  otherUserId: string;
  lastMessage: Message;
};

export function buildInbox(messages: Message[], currentUserId: string): InboxItem[] {
  const byPeer = new Map<string, Message>();

  for (const m of messages) {
    if (m.senderId !== currentUserId && m.receiverId !== currentUserId) continue;
    const other = m.senderId === currentUserId ? m.receiverId : m.senderId;
    const prev = byPeer.get(other);
    if (!prev || new Date(m.createdAt) > new Date(prev.createdAt)) {
      byPeer.set(other, m);
    }
  }

  return Array.from(byPeer.entries())
    .map(([otherUserId, lastMessage]) => ({
      otherUserId,
      lastMessage,
    }))
    .sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
    );
}

export function parseChatParticipants(
  chatId: string,
  currentUserId: string
): { otherUserId: string } | null {
  const parts = chatId.split("_");
  if (parts.length !== 2) return null;
  const [a, b] = parts;
  if (a !== currentUserId && b !== currentUserId) return null;
  const otherUserId = a === currentUserId ? b : a;
  if (!otherUserId || otherUserId === currentUserId) return null;
  return { otherUserId };
}

export function chatIdForUsers(userA: string, userB: string): string {
  return conversationKey(userA, userB);
}
