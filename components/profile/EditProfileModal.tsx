"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicUser } from "@/lib/types";
import { validateUsername } from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type Props = {
  open: boolean;
  onClose: () => void;
  user: PublicUser;
};

export function EditProfileModal({ open, onClose, user }: Props) {
  const router = useRouter();
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const fileRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatarValue, setAvatarValue] = useState(user.avatar);
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setUsername(user.username);
    setBio(user.bio);
    setAvatarValue(user.avatar);
    setUsernameError(undefined);
    setFormError(null);
    setSubmitting(false);
    if (fileRef.current) fileRef.current.value = "";
  }, [open, user.username, user.bio, user.avatar]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const previewSrc = useMemo(() => {
    const u = avatarValue.trim();
    if (u) return u;
    const seed = username.trim().toLowerCase() || user.username.toLowerCase();
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  }, [avatarValue, username, user.username]);

  const onPickFile = useCallback((file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") setAvatarValue(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const uErr = validateUsername(username);
    setUsernameError(uErr ?? undefined);
    if (uErr) return;

    setSubmitting(true);
    const res = updateProfile({
      username: username.trim(),
      bio: bio.trim(),
      avatar: avatarValue.trim(),
    });
    setSubmitting(false);
    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    if (username.trim() !== user.username) {
      router.replace(`/profile/${encodeURIComponent(username.trim())}`);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-gray-900/55 backdrop-blur-md dark:bg-black/65"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="max-h-[90dvh] overflow-y-auto border-gray-200/90 p-6 shadow-glass dark:border-gray-800 sm:rounded-2xl sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Profile
              </p>
              <h1
                id="edit-profile-title"
                className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50"
              >
                Edit profile
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Username, photo, and bio
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              aria-label="Close dialog"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Avatar src={previewSrc} alt={username || user.username} size="xl" className="ring-2 ring-gray-100 dark:ring-gray-800" />
              <div className="flex w-full min-w-0 flex-col gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => onPickFile(e.target.files?.[0])}
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                    Upload image
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setAvatarValue("")}>
                    Generated avatar
                  </Button>
                </div>
                <Input
                  label="Photo URL (optional)"
                  name="avatarUrl"
                  type="url"
                  autoComplete="off"
                  placeholder="https://…"
                  value={avatarValue.startsWith("data:") ? "" : avatarValue}
                  onChange={(e) => setAvatarValue(e.target.value)}
                />
                {avatarValue.startsWith("data:") ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Using uploaded image. Replace via URL or upload.</p>
                ) : null}
              </div>
            </div>

            <Input
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={usernameError}
            />

            <Textarea
              label="Bio"
              name="bio"
              placeholder="A few words about you"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />

            {formError ? (
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                Save
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
