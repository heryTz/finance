import { MoreHorizontalIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "src/shared/lib/utils";
import { buttonVariants } from "src/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "src/shared/ui/dropdown-menu";

type RowActionsProps = {
  label: string;
  children: ReactNode;
};

export function RowActions({ label, children }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "cursor-pointer text-muted-foreground shrink-0",
        )}
        aria-label={label}
      >
        <MoreHorizontalIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
