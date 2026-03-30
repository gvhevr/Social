import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Comment, Follow, Post } from "@/lib/types";
import {
  loadSeedComments,
  loadSeedFollows,
  loadSeedPosts,
} from "@/lib/mockDatabase/seed";
import { selectFeedPosts } from "@/lib/mockDatabase/feed";
import { randomId } from "@/lib/helpers";

type PostState = {
  posts: Post[];
  comments: Comment[];
  follows: Follow[];
  getFeed: (viewerId: string) => Post[];
  toggleLike: (postId: string, userId: string) => void;
  addComment: (postId: string, authorId: string, text: string) => void;
  deleteComment: (commentId: string, requesterId: string) => void;
  deletePost: (postId: string, requesterId: string) => void;
  createPost: (authorId: string, content: string, image: string | null) => void;
  follow: (followerId: string, followingId: string) => void;
  unfollow: (followerId: string, followingId: string) => void;
};

const seedPosts = loadSeedPosts();
const seedComments = loadSeedComments();
const seedFollows = loadSeedFollows();

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      posts: seedPosts,
      comments: seedComments,
      follows: seedFollows,

      getFeed: (viewerId) => selectFeedPosts(viewerId, get().posts, get().follows),

      toggleLike: (postId, userId) => {
        set((s) => ({
          posts: s.posts.map((p) => {
            if (p.id !== postId) return p;
            const has = p.likes.includes(userId);
            return {
              ...p,
              likes: has ? p.likes.filter((id) => id !== userId) : [...p.likes, userId],
            };
          }),
        }));
      },

      addComment: (postId, authorId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const c: Comment = {
          id: randomId("c"),
          postId,
          authorId,
          text: trimmed,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          comments: [...s.comments, c],
          posts: s.posts.map((p) =>
            p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
          ),
        }));
      },

      deleteComment: (commentId, requesterId) => {
        set((s) => {
          const target = s.comments.find((c) => c.id === commentId);
          if (!target || target.authorId !== requesterId) return s;
          return {
            comments: s.comments.filter((c) => c.id !== commentId),
            posts: s.posts.map((p) =>
              p.id === target.postId
                ? { ...p, commentsCount: Math.max(0, p.commentsCount - 1) }
                : p
            ),
          };
        });
      },

      deletePost: (postId, requesterId) => {
        set((s) => {
          const post = s.posts.find((p) => p.id === postId);
          if (!post || post.authorId !== requesterId) return s;
          return {
            posts: s.posts.filter((p) => p.id !== postId),
            comments: s.comments.filter((c) => c.postId !== postId),
          };
        });
      },

      createPost: (authorId, content, image) => {
        const text = content.trim();
        if (!text && !image) return;
        const post: Post = {
          id: randomId("p"),
          authorId,
          content: text,
          image,
          likes: [],
          commentsCount: 0,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ posts: [post, ...s.posts] }));
      },

      follow: (followerId, followingId) => {
        if (followerId === followingId) return;
        set((s) => {
          if (s.follows.some((f) => f.followerId === followerId && f.followingId === followingId)) {
            return s;
          }
          return {
            follows: [...s.follows, { followerId, followingId }],
          };
        });
      },

      unfollow: (followerId, followingId) => {
        set((s) => ({
          follows: s.follows.filter(
            (f) => !(f.followerId === followerId && f.followingId === followingId)
          ),
        }));
      },
    }),
    { name: "social-posts-v3" }
  )
);
