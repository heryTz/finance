import { LucideIcon, Menu } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserMenu } from "./user-menu";

export function Appbar({ menus }: AppbarProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link href="/">
              <Logo />
            </Link>
            {menus.map((el) => (
              <Link
                key={el.label}
                href={el.href}
                className={cn(
                  "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                  { "bg-muted": el.active },
                )}
              >
                <el.Icon className="h-4 w-4" />
                {el.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1"></div>
      <UserMenu />
    </header>
  );
}

type AppbarProps = {
  menus: Array<{
    label: string;
    href: string;
    Icon: LucideIcon;
    active?: boolean;
  }>;
};
