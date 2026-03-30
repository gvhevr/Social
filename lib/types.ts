export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
};

export type PublicUser = Omit<User, "password">;

export type Post = {
  id: string;
  authorId: string;
  content: string;
  image: string | null;
  likes: string[];
  commentsCount: number;
  createdAt: string;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  text: string;
  createdAt: string;
};

export type Follow = {
  followerId: string;
  followingId: string;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
};
