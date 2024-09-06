"use client";

import { LucideIcon, Menu } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserMenu } from "./user-menu";
import { useState } from "react";

export function Appbar({ menus }: AppbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-4">
          <nav className="font-medium flex flex-col h-dvh">
            <Link href="/" className="px-2" onClick={() => setOpen(false)}>
              <Logo />
            </Link>
            <div className="flex-1 overflow-auto mt-4">
              <div className="grid gap-2">
                {menus.map((el) => (
                  <Link
                    key={el.label}
                    href={el.href}
                    className={cn(
                      "flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                      { "bg-muted": el.active },
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <el.Icon className="h-4 w-4" />
                    {el.label}
                  </Link>
                ))}
              </div>
            </div>
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
