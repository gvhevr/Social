"use client";

import Link from "next/link";
import type { User } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";

type Props = {
  users: User[];
  title?: string;
  hideHeading?: boolean;
};

export function FollowingList({ users, title = "Following", hideHeading = false }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      {hideHeading ? null : (
        <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      )}
      {users.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Not following anyone yet.</p>
      ) : (
        <ul className="space-y-2.5">
          {users.map((u) => (
            <li key={u.id}>
              <Link
                href={`/profile/${u.username}`}
                className="flex items-center gap-2.5 rounded-lg py-1 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/80"
              >
                <Avatar src={u.avatar} alt={u.username} size="sm" />
                <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {u.username}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
