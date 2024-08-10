import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

export function Sidebar({ menus }: SidebarProps) {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {menus.map((el) => (
              <Link
                key={el.label}
                href={el.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  { "bg-muted": el.active },
                )}
              >
                <el.Icon className="h-4 w-4" />
                {el.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

type SidebarProps = {
  menus: Array<{
    label: string;
    href: string;
    Icon: LucideIcon;
    active?: boolean;
  }>;
};
