import type { PublicUser, User } from "@/lib/types";

export function toPublicUser(user: User): PublicUser {
  const { password, ...rest } = user;
  void password;
  return rest;
}

export function findUserByEmail(users: User[], email: string): User | undefined {
  const q = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === q);
}

export function isUsernameTaken(users: User[], username: string): boolean {
  const u = username.trim();
  if (!u) return false;
  const lower = u.toLowerCase();
  return users.some((x) => x.username.toLowerCase() === lower);
}

export function isUsernameTakenByOthers(
  users: User[],
  username: string,
  exceptUserId: string
): boolean {
  const u = username.trim();
  if (!u) return false;
  const lower = u.toLowerCase();
  return users.some(
    (x) => x.id !== exceptUserId && x.username.toLowerCase() === lower
  );
}

export function isEmailRegistered(users: User[], email: string): boolean {
  const e = email.trim().toLowerCase();
  return users.some((x) => x.email.toLowerCase() === e);
}
