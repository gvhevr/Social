"use client";

import { usePostStore } from "@/store/usePostStore";
import { isFollowing } from "@/lib/mockDatabase/feed";

type Props = {
  viewerId: string;
  targetUserId: string;
  targetUsername: string;
};

export function FollowButton({ viewerId, targetUserId, targetUsername }: Props) {
  const follows = usePostStore((s) => s.follows);
  const follow = usePostStore((s) => s.follow);
  const unfollow = usePostStore((s) => s.unfollow);

  const active = isFollowing(viewerId, targetUserId, follows);

  return (
    <button
      type="button"
      onClick={() => (active ? unfollow(viewerId, targetUserId) : follow(viewerId, targetUserId))}
      aria-pressed={active}
      aria-label={active ? `Unfollow ${targetUsername}` : `Follow ${targetUsername}`}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 active:scale-[0.98] disabled:opacity-50 ${
        active
          ? "border border-zinc-300 bg-transparent text-zinc-800 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800"
          : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
      }`}
    >
      {active ? "Following" : "Follow"}
    </button>
  );
}
