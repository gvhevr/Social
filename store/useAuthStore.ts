import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PublicUser, User } from "@/lib/types";
import {
  findUserByEmail,
  isEmailRegistered,
  isUsernameTaken,
  isUsernameTakenByOthers,
  toPublicUser,
  isValidEmail,
  validateAvatarInput,
  validateRegisterPassword,
  validateUsername,
} from "@/lib/auth";
import { loadSeedUsers } from "@/lib/mockDatabase/seed";
import { randomId } from "@/lib/helpers";

type AuthState = {
  users: User[];
  currentUser: PublicUser | null;
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  register: (input: {
    username: string;
    email: string;
    password: string;
    bio?: string;
  }) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  updateProfile: (patch: {
    username?: string;
    bio?: string;
    avatar?: string;
  }) => { ok: true } | { ok: false; error: string };
};

const seedUsers = loadSeedUsers();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: seedUsers,
      currentUser: null,

      login: (email, password) => {
        const em = email.trim().toLowerCase();
        if (!em || !password) {
          return { ok: false, error: "Enter your email and password." };
        }
        if (!isValidEmail(em)) {
          return { ok: false, error: "Enter a valid email address." };
        }
        const u = findUserByEmail(get().users, em);
        if (!u || u.password !== password) {
          return { ok: false, error: "Invalid email or password." };
        }
        set({ currentUser: toPublicUser(u) });
        return { ok: true };
      },

      register: ({ username, email, password, bio }) => {
        const unameErr = validateUsername(username);
        if (unameErr) return { ok: false, error: unameErr };

        const em = email.trim().toLowerCase();
        if (!em) return { ok: false, error: "Email is required." };
        if (!isValidEmail(em)) return { ok: false, error: "Enter a valid email address." };

        const passErr = validateRegisterPassword(password);
        if (passErr) return { ok: false, error: passErr };

        const { users } = get();
        if (isUsernameTaken(users, username)) {
          return { ok: false, error: "That username is already taken." };
        }
        if (isEmailRegistered(users, em)) {
          return { ok: false, error: "That email is already registered." };
        }

        const uname = username.trim();
        const newUser: User = {
          id: randomId("u"),
          username: uname,
          email: em,
          password,
          bio: (bio ?? "").trim(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(uname.toLowerCase())}`,
        };
        set((s) => ({ users: [...s.users, newUser], currentUser: toPublicUser(newUser) }));
        return { ok: true };
      },

      logout: () => set({ currentUser: null }),

      updateProfile: (patch) => {
        const { currentUser, users } = get();
        if (!currentUser) return { ok: false, error: "Not signed in." };
        const me = users.find((u) => u.id === currentUser.id);
        if (!me) return { ok: false, error: "User not found." };

        let nextUsername = me.username;
        if (patch.username !== undefined) {
          const unameErr = validateUsername(patch.username);
          if (unameErr) return { ok: false, error: unameErr };
          const uname = patch.username.trim();
          if (
            uname.toLowerCase() !== me.username.toLowerCase() &&
            isUsernameTakenByOthers(users, uname, currentUser.id)
          ) {
            return { ok: false, error: "That username is already taken." };
          }
          nextUsername = uname;
        }

        let nextBio = me.bio;
        if (patch.bio !== undefined) nextBio = patch.bio.trim();

        let nextAvatar = me.avatar;
        if (patch.avatar !== undefined) {
          const avErr = validateAvatarInput(patch.avatar);
          if (avErr) return { ok: false, error: avErr };
          const a = patch.avatar.trim();
          if (!a) {
            nextAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nextUsername.toLowerCase())}`;
          } else {
            nextAvatar = a;
          }
        }

        const nextUsers = users.map((u) =>
          u.id === currentUser.id
            ? { ...u, username: nextUsername, bio: nextBio, avatar: nextAvatar }
            : u
        );
        const updated = nextUsers.find((u) => u.id === currentUser.id)!;
        set({ users: nextUsers, currentUser: toPublicUser(updated) });
        return { ok: true };
      },
    }),
    { name: "social-auth-v2" }
  )
);
