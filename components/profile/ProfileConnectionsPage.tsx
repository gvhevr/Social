"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  getFollowersForUser,
  getFollowingForUser,
  getUserByUsername,
} from "@/lib/mockDatabase/feed";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostStore } from "@/store/usePostStore";
import { FollowersList } from "@/components/follow/FollowersList";
import { FollowingList } from "@/components/follow/FollowingList";
import { Card } from "@/components/ui/Card";

type Kind = "followers" | "following";

type Props = {
  usernameParam: string;
  kind: Kind;
};

export function ProfileConnectionsPage({ usernameParam, kind }: Props) {
  const users = useAuthStore((s) => s.users);
  const follows = usePostStore((s) => s.follows);
  const raw = decodeURIComponent(usernameParam);

  const profileUser = useMemo(() => getUserByUsername(users, raw), [users, raw]);

  const profileHref = `/profile/${encodeURIComponent(raw)}`;
  const title = kind === "followers" ? "Followers" : "Following";

  const listUsers = useMemo(() => {
    if (!profileUser) return [];
    return kind === "followers"
      ? getFollowersForUser(profileUser.id, follows, users)
      : getFollowingForUser(profileUser.id, follows, users);
  }, [profileUser, follows, users, kind]);

  if (!profileUser) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <Card className="p-8 text-center">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">User not found</h1>
          <Link href="/feed" className="mt-4 inline-block text-sm font-medium text-violet-600 dark:text-violet-400">
            Back to home
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <nav className="mb-6">
        <Link
          href={profileHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 transition hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          @{profileUser.username}
        </Link>
      </nav>

      <h1 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h1>
      {kind === "followers" ? (
        <FollowersList users={listUsers} hideHeading />
      ) : (
        <FollowingList users={listUsers} hideHeading />
      )}
    </main>
  );
}
