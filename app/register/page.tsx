"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  isEmailRegistered,
  isValidEmail,
  isUsernameTaken,
  validateRegisterPassword,
  validateUsername,
} from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const users = useAuthStore((s) => s.users);
  const currentUser = useAuthStore((s) => s.currentUser);
  const [hydrated, setHydrated] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useAuthStore.persist.hasHydrated());
    return unsub;
  }, []);

  useEffect(() => {
    if (hydrated && currentUser) router.replace("/feed");
  }, [hydrated, currentUser, router]);

  const validate = (): boolean => {
    const next: typeof fieldErrors = {};
    const uErr = validateUsername(username);
    if (uErr) next.username = uErr;
    else if (hydrated && isUsernameTaken(users, username)) {
      next.username = "That username is already taken.";
    }

    const em = email.trim();
    if (!em) next.email = "Email is required.";
    else if (!isValidEmail(em)) next.email = "Enter a valid email address.";
    else if (hydrated && isEmailRegistered(users, em)) {
      next.email = "That email is already registered.";
    }

    const pErr = validateRegisterPassword(password);
    if (pErr) next.password = pErr;

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    const res = register({
      username: username.trim(),
      email: email.trim(),
      password,
      bio: bio.trim() || undefined,
    });
    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    router.push("/feed");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg font-bold text-white shadow-lg shadow-violet-500/25">
            S
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Create account</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Join the network — your profile is stored locally in this browser
          </p>
        </div>

        <Card className="border-zinc-200/80 p-8 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:shadow-black/40">
          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <Input
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (fieldErrors.username) setFieldErrors((f) => ({ ...f, username: undefined }));
              }}
              error={fieldErrors.username}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
              }}
              error={fieldErrors.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((f) => ({ ...f, password: undefined }));
              }}
              error={fieldErrors.password}
            />
            <Textarea
              label="Bio (optional)"
              name="bio"
              placeholder="A short line about you…"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[88px]"
            />
            {formError ? (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
              >
                {formError}
              </div>
            ) : null}
            <Button type="submit" className="w-full" size="lg" disabled={!hydrated}>
              Register
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-violet-600 underline-offset-4 hover:underline dark:text-violet-400"
            >
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
