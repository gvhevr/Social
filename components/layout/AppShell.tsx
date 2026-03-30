import { SidebarNav } from "./SidebarNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] gap-4 px-3 pb-4 pt-3 sm:gap-6 sm:px-5 md:px-6 lg:gap-8 lg:px-8">
      <div className="hidden md:block md:w-[240px] lg:w-[260px] shrink-0">
        <div className="sticky top-4 flex max-h-[calc(100vh-2rem)] flex-col">
          <SidebarNav />
        </div>
      </div>
      <div className="min-h-screen min-w-0 flex-1">{children}</div>
    </div>
  );
}
