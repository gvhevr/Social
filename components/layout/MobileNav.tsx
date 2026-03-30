"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={active ? 2 : 1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={active ? 2 : 1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function PlusIcon({ active }: { active: boolean }) {
  return (
    <span
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 ${active ? "ring-2 ring-indigo-400/50 ring-offset-2 ring-offset-white dark:ring-offset-gray-950" : ""}`}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </span>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={active ? 2 : 1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const currentUser = useAuthStore((s) => s.currentUser);
  const profileHref = currentUser ? `/profile/${currentUser.username}` : "/profile";

  const items = [
    { href: "/feed", label: "Home", Icon: HomeIcon, match: (p: string) => p === "/feed" || p.startsWith("/feed/") },
    {
      href: profileHref,
      label: "Profile",
      Icon: UserIcon,
      match: (p: string) => p.startsWith("/profile"),
    },
    { href: "/create", label: "Create", Icon: PlusIcon, match: (p: string) => p.startsWith("/create") },
    { href: "/messages", label: "Chat", Icon: ChatIcon, match: (p: string) => p.startsWith("/messages") },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-gray-200/90 bg-white/80 px-1 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80 md:hidden">
      {items.map(({ href, label, Icon, match }) => {
        const active = match(pathname ?? "");
        return (
          <Link key={label} href={href} className="flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2 rounded-lg">
            <motion.span
              className={`flex flex-col items-center gap-0.5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}`}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.15 }}
            >
              <Icon active={active} />
              {label !== "Create" ? <span>{label}</span> : <span className="mt-0.5">{label}</span>}
            </motion.span>
          </Link>
        );
      })}
    </nav>
  );
}
