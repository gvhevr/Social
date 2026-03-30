"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getUserByUsername } from "@/lib/mockDatabase/feed";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostStore } from "@/store/usePostStore";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfilePostsGrid } from "@/components/profile/ProfilePostsGrid";
import { Card } from "@/components/ui/Card";

type Props = { params: { username: string } };

export default function ProfilePage({ params }: Props) {
  const users = useAuthStore((s) => s.users);
  const posts = usePostStore((s) => s.posts);

  const profileUser = useMemo(
    () => getUserByUsername(users, decodeURIComponent(params.username)),
    [users, params.username]
  );

  const userPosts = useMemo(() => {
    if (!profileUser) return [];
    return posts
      .filter((p) => p.authorId === profileUser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, profileUser]);

  if (!profileUser) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <Card className="p-8 text-center">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">User not found</h1>
          <p className="mt-2 text-sm text-zinc-500">There is no profile for @{params.username}.</p>
          <Link href="/feed" className="mt-4 inline-block text-sm font-medium text-violet-600 dark:text-violet-400">
            Back to home
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <ProfileHeader profileUser={profileUser} postsCount={userPosts.length} />

      <section aria-label="Posts" className="mt-8">
        <div className="flex items-center justify-center gap-2 border-t border-zinc-200 py-3 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:border-zinc-800">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
          </svg>
          Posts
        </div>
        <ProfilePostsGrid posts={userPosts} />
      </section>
    </main>
  );
}
