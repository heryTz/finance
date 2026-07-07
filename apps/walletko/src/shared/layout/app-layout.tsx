import { useSidebarCollapsed } from "src/shared/hooks/use-sidebar-collapsed";
import { MobileNav } from "src/shared/layout/mobile-nav";
import { Sidebar } from "src/shared/layout/sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { collapsed, toggle } = useSidebarCollapsed();

  return (
    <div className="flex h-svh overflow-hidden bg-desk text-foreground">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex min-w-0 flex-1 flex-col p-0 lg:p-2 lg:pl-2">
        <main className="flex-1 overflow-y-auto bg-background lg:rounded-2xl lg:border lg:border-border lg:shadow-sm">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
