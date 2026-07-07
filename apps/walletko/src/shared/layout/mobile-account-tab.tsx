import { useLocation, useNavigate } from "@tanstack/react-router";
import { Info, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useAuthenticatedUser } from "src/shared/hooks/use-authenticated-user";
import { getInitials } from "src/shared/layout/get-initials";
import {
  mobileTabClass,
  tabIndicatorClass,
} from "src/shared/layout/mobile-tab-styles";
import { navItems, secondaryNavItems } from "src/shared/layout/nav-items";
import { SheetRowLink } from "src/shared/layout/sheet-row-link";
import { ThemeSwitcher } from "src/shared/layout/theme-switcher";
import { authClient } from "src/shared/lib/auth-client";
import { cn } from "src/shared/lib/utils";
import { Avatar, AvatarFallback } from "src/shared/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "src/shared/ui/sheet";

export function MobileAccountTab() {
  const [open, setOpen] = useState(false);
  const user = useAuthenticatedUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const active =
    open ||
    secondaryNavItems.some(({ to }) =>
      pathname.startsWith(to.replace(/\/$/, "")),
    ) ||
    pathname.startsWith("/settings");

  const handleLogout = async () => {
    setOpen(false);
    await authClient.signOut();
    await navigate({ to: "/login" });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            aria-label="Account and more"
            className={cn(
              mobileTabClass,
              tabIndicatorClass,
              active
                ? "text-primary before:opacity-100"
                : "text-muted-foreground",
            )}
          >
            <Avatar className="size-5 shrink-0">
              <AvatarFallback
                className={cn(
                  "text-[10px] font-semibold transition-colors",
                  active
                    ? "bg-primary/12 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {getInitials(user)}
              </AvatarFallback>
            </Avatar>
            <span>You</span>
          </button>
        }
      />
      <SheetContent className="mx-auto max-w-md gap-5">
        <SheetHeader className="flex-row items-center gap-3 px-1">
          <Avatar className="size-10 shrink-0">
            <AvatarFallback className="bg-primary/12 text-primary text-sm font-semibold">
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <SheetTitle className="truncate">{user.name}</SheetTitle>
            <span className="truncate text-sm text-muted-foreground">
              {user.email}
            </span>
          </div>
        </SheetHeader>

        <nav className="space-y-0.5">
          {navItems.map(({ to, label, icon }) => (
            <SheetRowLink key={to} to={to} label={label} icon={icon} />
          ))}
        </nav>

        <div className="border-t border-border pt-4">
          <ThemeSwitcher collapsed={false} />
        </div>

        <div className="space-y-0.5 border-t border-border pt-4">
          <SheetRowLink to="/about" label="About" icon={Info} />
          <SheetRowLink to="/settings" label="Settings" icon={Settings} />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="size-[18px] shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
