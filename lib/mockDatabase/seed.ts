import type { Comment, Follow, Message, Post, User } from "@/lib/types";
import usersJson from "@/data/users.json";
import postsJson from "@/data/posts.json";
import commentsJson from "@/data/comments.json";
import messagesJson from "@/data/messages.json";
import followsJson from "@/data/follows.json";

export function loadSeedUsers(): User[] {
  return usersJson as User[];
}

export function loadSeedPosts(): Post[] {
  return (postsJson as Post[]).map((p) => ({
    ...p,
    likes: [...p.likes],
  }));
}

export function loadSeedComments(): Comment[] {
  return commentsJson as Comment[];
}

export function loadSeedMessages(): Message[] {
  return messagesJson as Message[];
}

export function loadSeedFollows(): Follow[] {
  return followsJson as Follow[];
}
