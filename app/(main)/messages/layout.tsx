import { MessagesLayoutClient } from "@/components/chat/MessagesLayoutClient";

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return <MessagesLayoutClient>{children}</MessagesLayoutClient>;
}
