import { Link } from "@tanstack/react-router";
import { cn } from "src/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "src/shared/ui/tooltip";

type NavItemProps = {
  to: string;
  label: string;
  icon: React.ElementType;
  collapsed: boolean;
};

export function NavItem({ to, label, icon: Icon, collapsed }: NavItemProps) {
  const link = (
    <Link
      to={to}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        "[&.active]:bg-sidebar-accent [&.active]:text-sidebar-foreground",
        "before:absolute before:left-0 before:top-1/2 before:h-0 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-sidebar-primary before:transition-all before:content-['']",
        "[&.active]:before:h-5",
        collapsed && "justify-center px-0",
      )}
    >
      <Icon className="size-[18px] shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right" sideOffset={10}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
