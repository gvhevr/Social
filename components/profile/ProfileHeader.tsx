"use client";

import Link from "next/link";
import { useState } from "react";
import type { User } from "@/lib/types";
import { toPublicUser } from "@/lib/auth";
import { followerCount, followingCount } from "@/lib/mockDatabase/feed";
import { chatIdForUsers } from "@/lib/mockDatabase/messages";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostStore } from "@/store/usePostStore";
import { Avatar } from "@/components/ui/Avatar";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { FollowButton } from "@/components/follow/FollowButton";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

const linkSecondary =
  "inline-flex h-9 min-h-[2.75rem] items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 md:h-11";

const linkPrimaryLogin =
  "inline-flex h-9 min-h-[2.75rem] items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 md:h-11";

type Props = {
  profileUser: User;
  postsCount: number;
};

export function ProfileHeader({ profileUser, postsCount }: Props) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const follows = usePostStore((s) => s.follows);
  const [editOpen, setEditOpen] = useState(false);

  const isSelf = currentUser?.id === profileUser.id;
  const followers = followerCount(profileUser.id, follows);
  const followingN = followingCount(profileUser.id, follows);

  return (
    <header className="border-b border-zinc-200/90 pb-8 dark:border-zinc-800">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8 md:gap-12">
        <div className="flex justify-center sm:block sm:shrink-0">
          <Avatar src={profileUser.avatar} alt={profileUser.username} size="profile" />
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <ProfileStats
            postsCount={postsCount}
            followersCount={followers}
            followingCount={followingN}
            profileUsername={profileUser.username}
            className="justify-around border-y border-zinc-200 py-3 dark:border-zinc-800 sm:hidden"
          />

          <div className="flex flex-col items-stretch gap-3 sm:items-start">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-2xl">
                {profileUser.username}
              </h1>
              {isSelf ? (
                <>
                  <button type="button" onClick={() => setEditOpen(true)} className={linkSecondary}>
                    Edit profile
                  </button>
                  <Link href="/create" className={linkSecondary}>
                    New post
                  </Link>
                  <Link href="/feed" className={`${linkSecondary} hidden sm:inline-flex`}>
                    Home
                  </Link>
                </>
              ) : currentUser ? (
                <>
                  <FollowButton
                    viewerId={currentUser.id}
                    targetUserId={profileUser.id}
                    targetUsername={profileUser.username}
                  />
                  <Link
                    href={`/messages/${chatIdForUsers(currentUser.id, profileUser.id)}`}
                    className={linkSecondary}
                  >
                    Message
                  </Link>
                </>
              ) : (
                <Link href="/login" className={linkPrimaryLogin}>
                  Follow
                </Link>
              )}
            </div>

            <ProfileStats
              postsCount={postsCount}
              followersCount={followers}
              followingCount={followingN}
              profileUsername={profileUser.username}
              className="hidden gap-10 sm:flex"
            />

            {profileUser.bio ? (
              <p className="max-w-md text-center text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 sm:text-left">
                {profileUser.bio}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {isSelf ? (
        <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} user={toPublicUser(profileUser)} />
      ) : null}
    </header>
  );
}
