"use client";

import { AdminGuard } from "@/lib/admin-guard";
import { ChartArea, Landmark, Wallet } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";
import { Appbar } from "@/components/appbar";
import { PropsWithChildren } from "react";

export function Component({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const menus = [
    {
      label: "Dashboard",
      href: "/",
      Icon: ChartArea,
      active: pathname === "/",
    },
    {
      label: "Finance",
      href: "/finance",
      Icon: Landmark,
      active: pathname.startsWith("/finance"),
    },
    {
      label: "Facture",
      href: "/invoice",
      Icon: Wallet,
      active: pathname.startsWith("/invoice"),
    },
  ];

  return (
    <div className="grid min-h-dvh w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar menus={menus} />
      <div className="flex flex-col">
        <Appbar menus={menus} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 max-h-[calc(100dvh_-_56px)] lg:max-h-[calc(100dvh_-_60px)] h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function Layout(props: {}) {
  return (
    <AdminGuard>
      <Component {...props} />
    </AdminGuard>
  );
}
