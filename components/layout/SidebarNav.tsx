"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/feed", label: "Home", icon: HomeIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/create", label: "Create Post", icon: PlusIcon },
  { href: "/messages", label: "Messages", icon: MessageIcon },
];

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  );
}

export function SidebarNav() {
  const pathname = usePathname();
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);

  const profileHref = currentUser ? `/profile/${currentUser.username}` : "/profile";

  return (
    <aside className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white/70 px-3 py-5 shadow-glass backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/70">
      <Link href="/feed" className="mb-6 flex items-center gap-3 px-2 transition hover:opacity-90 active:scale-[0.98]">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
          S
        </span>
        <span className="hidden text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50 lg:inline">
          Social
        </span>
      </Link>

      <nav className="flex min-h-0 flex-1 flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const resolved = label === "Profile" ? profileHref : href;
          const active =
            label === "Profile"
              ? pathname?.startsWith("/profile")
              : pathname === href || pathname?.startsWith(`${href}/`);

          return (
            <Link key={label} href={resolved} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50">
              <motion.span
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gradient-to-r from-indigo-500/12 to-purple-600/12 text-indigo-700 shadow-sm dark:text-indigo-300"
                    : "text-gray-600 hover:bg-gray-100/90 dark:text-gray-400 dark:hover:bg-gray-800/80"
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.18 }}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="hidden lg:inline">{label}</span>
              </motion.span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-gray-200/80 pt-4 dark:border-gray-800">
        <div className="flex items-center justify-between gap-2 px-1">
          <ThemeToggle />
        </div>
        {currentUser ? (
          <div className="rounded-xl bg-gray-50/90 p-3 dark:bg-gray-800/50">
            <p className="truncate px-1 text-xs font-medium text-gray-900 dark:text-gray-100">@{currentUser.username}</p>
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-start !px-2" onClick={logout}>
              Log out
            </Button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
