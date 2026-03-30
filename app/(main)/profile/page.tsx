"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { ProfileSkeleton } from "@/components/ui/Skeleton";

export default function ProfileIndexPage() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);

  useEffect(() => {
    if (currentUser) router.replace(`/profile/${currentUser.username}`);
  }, [currentUser, router]);

  return <ProfileSkeleton />;
}
