import type { ReactNode } from "react";
import { cn } from "src/shared/lib/utils";
import { Button, buttonVariants } from "src/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/shared/ui/dropdown-menu";

export type ActionItem = {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive";
  disabled?: boolean;
};

type PageFabProps = {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  items?: ActionItem[];
  disabled?: boolean;
};

const FAB_CLASS =
  "lg:hidden fixed bottom-20 right-4 z-40 size-14 rounded-full shadow-lg";

export function PageFab({
  icon,
  label,
  onClick,
  items,
  disabled,
}: PageFabProps) {
  if (items && items.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(buttonVariants({ size: "icon-lg" }), FAB_CLASS)}
          aria-label={label}
          disabled={disabled}
        >
          {icon}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="mb-2 w-48">
          {items.map((item) => (
            <DropdownMenuItem
              key={item.key}
              variant={
                item.variant === "destructive" ? "destructive" : "default"
              }
              disabled={item.disabled}
              className="gap-2 cursor-pointer"
              onClick={item.onClick}
            >
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      size="icon-lg"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={FAB_CLASS}
    >
      {icon}
    </Button>
  );
}
