import Link from "next/link";
import type { ReactNode } from "react";
import type { User } from "@/lib/types";
import { formatRelativeTime } from "@/lib/helpers";
import { Avatar } from "@/components/ui/Avatar";

type Props = {
  author: User;
  createdAt: string;
  actions?: ReactNode;
};

export function PostHeader({ author, createdAt, actions }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <Link
        href={`/profile/${author.username}`}
        className="shrink-0 rounded-full ring-2 ring-gray-100 transition hover:ring-indigo-200 dark:ring-gray-800 dark:hover:ring-indigo-900/40"
      >
        <Avatar src={author.avatar} alt={author.username} size="md" className="ring-0" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/profile/${author.username}`}
          className="block truncate text-base font-semibold text-gray-900 underline decoration-indigo-500 decoration-2 underline-offset-4 transition hover:text-indigo-700 dark:text-gray-50 dark:hover:text-indigo-300"
        >
          {author.username}
        </Link>
        <time dateTime={createdAt} className="mt-0.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
          {formatRelativeTime(createdAt)}
        </time>
      </div>
      {actions ? <div className="shrink-0 self-start">{actions}</div> : null}
    </div>
  );
}
