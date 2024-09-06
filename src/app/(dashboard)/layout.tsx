"use client";

import { AdminGuard } from "@/lib/admin-guard";
import { ArrowLeftRightIcon, ChartArea, Wallet } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";
import { Appbar } from "@/components/appbar";
import { PropsWithChildren } from "react";
import { routes } from "../routes";

export function Component({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const menus = [
    {
      label: "Dashboard",
      href: routes.dashboard(),
      Icon: ChartArea,
      active: pathname === routes.dashboard(),
    },
    {
      label: "Opération",
      href: routes.operation(),
      Icon: ArrowLeftRightIcon,
      active: pathname.startsWith(routes.operation()),
    },
    {
      label: "Facture",
      href: routes.invoice(),
      Icon: Wallet,
      active: pathname.startsWith(routes.invoice()),
    },
  ];

  return (
    <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar menus={menus} />
      <div className="flex flex-col h-dvh">
        <Appbar menus={menus} />
        <main className="flex flex-1 flex-col p-4 lg:p-6 overflow-auto">
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
