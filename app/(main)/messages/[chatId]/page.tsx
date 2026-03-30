import { ChatWindow } from "@/components/chat/ChatWindow";

type Props = { params: { chatId: string } };

export default function MessagesChatPage({ params }: Props) {
  return <ChatWindow chatId={decodeURIComponent(params.chatId)} />;
}
