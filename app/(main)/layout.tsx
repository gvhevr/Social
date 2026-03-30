import { AppShell } from "@/components/layout/AppShell";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { MobileNav } from "@/components/layout/MobileNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>
        <div className="min-h-screen bg-gray-50 pb-[5.5rem] dark:bg-gray-900 md:pb-8">{children}</div>
      </AppShell>
      <MobileNav />
    </AuthGuard>
  );
}
