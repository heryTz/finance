import { PanelLeft, PanelLeftClose } from "lucide-react";
import { NavItem } from "src/shared/layout/nav-item";
import { navItems } from "src/shared/layout/nav-items";
import { ThemeSwitcher } from "src/shared/layout/theme-switcher";
import { UserMenu } from "src/shared/layout/user-menu";
import { cn } from "src/shared/lib/utils";
import { Button } from "src/shared/ui/button";
import { Logo } from "src/shared/ui/logo";

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col px-3 py-3 transition-[width] duration-200 ease-out lg:flex",
        collapsed ? "w-[76px]" : "w-60",
      )}
    >
      <div
        className={cn(
          "mb-3 flex h-9 items-center",
          collapsed ? "justify-center" : "gap-2.5 px-2",
        )}
      >
        <Logo className="size-7 shrink-0" />
        {!collapsed && (
          <span className="flex-1 truncate text-base font-semibold tracking-tight text-sidebar-primary">
            Walletko
          </span>
        )}
        {!collapsed && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Collapse sidebar"
            onClick={onToggle}
            className="shrink-0 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <PanelLeftClose className="size-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ to, label, icon }) => (
          <NavItem
            key={to}
            to={to}
            label={label}
            icon={icon}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {collapsed && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Expand sidebar"
          onClick={onToggle}
          className="mb-2 self-center text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <PanelLeft className="size-4" />
        </Button>
      )}

      <div className={cn("mb-1 flex", collapsed && "justify-center")}>
        <ThemeSwitcher collapsed={collapsed} />
      </div>

      <div className="mt-1 border-t border-sidebar-border pt-2">
        <UserMenu collapsed={collapsed} />
      </div>
    </aside>
  );
}
