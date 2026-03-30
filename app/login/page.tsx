"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { isValidEmail } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const currentUser = useAuthStore((s) => s.currentUser);
  const [hydrated, setHydrated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

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
    const em = email.trim();
    if (!em) next.email = "Email is required.";
    else if (!isValidEmail(em)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    const res = login(email.trim(), password);
    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    router.push("/feed");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/40 to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/30">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-lg shadow-indigo-500/30">
            S
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Sign in with your email and password</p>
          <p className="mt-3 rounded-xl bg-indigo-50 px-3 py-2 text-xs text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200">
            <span className="font-mono font-medium">alex@example.com</span>
            <span className="mx-1.5 text-indigo-700/60 dark:text-indigo-300/50">·</span>
            <span className="font-mono font-medium">demo123</span>
          </p>
        </div>

        <Card className="border-gray-200/80 p-8 shadow-glass dark:border-gray-800 dark:shadow-black/40">
          <form className="space-y-5" onSubmit={onSubmit} noValidate>
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((f) => ({ ...f, password: undefined }));
              }}
              error={fieldErrors.password}
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
              Log in
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            No account?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400"
            >
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
