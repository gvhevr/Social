import type { Follow, Post, User } from "@/lib/types";

export function selectFeedPosts(
  viewerId: string,
  posts: Post[],
  follows: Follow[]
): Post[] {
  const followingIds = new Set(
    follows.filter((f) => f.followerId === viewerId).map((f) => f.followingId)
  );
  followingIds.add(viewerId);

  return posts
    .filter((p) => followingIds.has(p.authorId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function isFollowing(
  viewerId: string,
  targetUserId: string,
  follows: Follow[]
): boolean {
  return follows.some(
    (f) => f.followerId === viewerId && f.followingId === targetUserId
  );
}

export function followerCount(userId: string, follows: Follow[]): number {
  return follows.filter((f) => f.followingId === userId).length;
}

export function followingCount(userId: string, follows: Follow[]): number {
  return follows.filter((f) => f.followerId === userId).length;
}

export function getUserByUsername(users: User[], username: string): User | undefined {
  const u = username.toLowerCase();
  return users.find((x) => x.username.toLowerCase() === u);
}

export function getFollowersForUser(userId: string, follows: Follow[], users: User[]): User[] {
  const ids = follows.filter((f) => f.followingId === userId).map((f) => f.followerId);
  const seen = new Set<string>();
  const out: User[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const u = users.find((x) => x.id === id);
    if (u) out.push(u);
  }
  return out;
}

export function getFollowingForUser(userId: string, follows: Follow[], users: User[]): User[] {
  const ids = follows.filter((f) => f.followerId === userId).map((f) => f.followingId);
  const seen = new Set<string>();
  const out: User[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const u = users.find((x) => x.id === id);
    if (u) out.push(u);
  }
  return out;
}
