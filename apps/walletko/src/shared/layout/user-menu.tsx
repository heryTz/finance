import { useNavigate } from "@tanstack/react-router";
import { Info, LogOut, MoreVerticalIcon, Settings } from "lucide-react";
import { useAuthenticatedUser } from "src/shared/hooks/use-authenticated-user";
import { getInitials } from "src/shared/layout/get-initials";
import { authClient } from "src/shared/lib/auth-client";
import { cn } from "src/shared/lib/utils";
import { Avatar, AvatarFallback } from "src/shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/shared/ui/dropdown-menu";

export function UserMenu({ collapsed }: { collapsed: boolean }) {
  const user = useAuthenticatedUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut();
    await navigate({ to: "/login" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-sidebar-foreground/70 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground cursor-pointer",
          collapsed && "justify-center px-0",
        )}
      >
        <Avatar className="size-7 shrink-0">
          <AvatarFallback className="bg-sidebar-primary/12 text-sidebar-primary text-xs font-semibold">
            {getInitials(user)}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <>
            <div className="flex min-w-0 flex-col text-left">
              <span className="truncate text-sm font-medium leading-tight">
                {user.name}
              </span>
              <span className="truncate text-xs text-sidebar-foreground/50 leading-tight">
                {user.email}
              </span>
            </div>
            <MoreVerticalIcon className="size-4 shrink-0" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align={collapsed ? "center" : "start"}
        className="w-44"
      >
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onClick={() => navigate({ to: "/about" })}
        >
          <Info className="size-4" />
          About
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 cursor-pointer"
          onClick={() => navigate({ to: "/settings" })}
        >
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
